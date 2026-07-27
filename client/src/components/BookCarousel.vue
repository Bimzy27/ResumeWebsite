<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'
import type { Book } from '../types'
import BookPedestal from './BookPedestal.vue'

import bookUrl from '../assets/models/book.glb'

// Rotating 3D carousel of the books Branden has read: a real book model (see
// src/assets/models/book.glb) per title, wearing that title's real Amazon
// cover art, standing on a real pedestal (see BookPedestal.vue). Clicking a
// book opens its Amazon purchase link.

// Reference BookPedestal explicitly so noUnusedLocals is satisfied.
// (vue-tsc sometimes fails to detect template-only usage inside TresCanvas.)
void BookPedestal

const props = defineProps<{ books: Book[] }>()

const emit = defineEmits<{
  // Pointer entered/left a book. null on leave; used by the parent for the
  // pointer cursor.
  hover: [bookId: string | null]
}>()

// ── layout ────────────────────────────────────────────────────────────────
// Books stand upright on a ring, front cover facing outward; the whole ring
// spins slowly and pauses while a book is hovered. The height and radius are
// carried over from the box proxy this replaced so the ring still fits the
// column the carousel renders in (see BookshelfSection.vue).
const RING_RADIUS = 0.92
const BOOK_HEIGHT = 0.52

// ── cover compositing ─────────────────────────────────────────────────────
// The model ships deliberately blank: its baked texture is an atlas of flat
// neutral panels, one per face, so a cover can be painted into the front one.
// These rects are the atlas regions for each face, measured off the model's
// own UVs (the outermost vertices facing each axis) rather than eyeballed.
// glTF UV origin is top-left with V running down, which is also canvas
// pixel order, so u/v map straight onto x/y below.
const FRONT_UV = { u0: 0.0031, u1: 0.3491, v0: 0.3817, v1: 0.9902 }
const BACK_UV = { u0: 0.418, u1: 0.748, v0: 0.382, v1: 0.994 }
const SPINE_UV = { u0: 0.772, u1: 0.8339, v0: 0.3931, v1: 0.9964 }

// Matches the model's own baked texture resolution, so compositing costs no
// fidelity on the page-edge and spine detail already baked into it. At this
// size the front-cover region is ~354 px wide, close to the source cover
// images' native ~377 px, so titles stay legible when a book is hovered.
const TEXTURE_SIZE = 1024

type UvRect = { u0: number; u1: number; v0: number; v1: number }

function rectPx(rect: UvRect) {
  return {
    x: rect.u0 * TEXTURE_SIZE,
    y: rect.v0 * TEXTURE_SIZE,
    w: (rect.u1 - rect.u0) * TEXTURE_SIZE,
    h: (rect.v1 - rect.v0) * TEXTURE_SIZE,
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

// One texture per book: the model's baked atlas, with the book's spine and
// back tinted its cover colour and its real cover art painted over the front
// panel. Tinting multiplies so the baked shading and edge detail survive
// underneath rather than being flattened by a solid fill.
function makeBookTexture(
  baseImage: CanvasImageSource,
  cover: HTMLImageElement,
  coverColor: string,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE_SIZE
  canvas.height = TEXTURE_SIZE
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(baseImage, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE)

  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = coverColor
  for (const rect of [SPINE_UV, BACK_UV]) {
    const { x, y, w, h } = rectPx(rect)
    ctx.fillRect(x, y, w, h)
  }
  ctx.globalCompositeOperation = 'source-over'

  // Drawn rotated 180 degrees: the front panel's UV island is itself laid
  // into the atlas upside down and mirrored, so painting the cover straight
  // renders it the same way on the book. Verified against the live render.
  const front = rectPx(FRONT_UV)
  ctx.save()
  ctx.translate(front.x + front.w, front.y + front.h)
  ctx.scale(-1, -1)
  ctx.drawImage(cover, 0, 0, front.w, front.h)
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  // glTF textures are sampled with a top-left origin; CanvasTexture defaults
  // to the flipped WebGL convention, which would mirror the atlas vertically
  // and put every panel on the wrong face.
  texture.flipY = false
  texture.anisotropy = 4
  return texture
}

// ── book meshes ───────────────────────────────────────────────────────────
interface BookMeshDef {
  book: Book
  // The same shared instance on every def; carried here rather than in its
  // own ref so the template binding is never null.
  geometry: THREE.BufferGeometry
  material: THREE.MeshStandardMaterial
  position: [number, number, number]
  rotationY: number
  // Stable handler references, created once. Inline template handlers
  // (`@click="openBook(def.book)"`) get a NEW function identity on every
  // re-render, and Tres' patchProp adds a listener for each new identity
  // without removing the old one - since the spin re-renders this component
  // every frame, one click ended up firing dozens of stacked listeners
  // (opening dozens of tabs). Stable references are only patched once.
  onClick: () => void
  onEnter: () => void
}

// Empty until the model and every cover image have loaded; geometry is
// shared across all twelve defs and only the material differs.
// shallowRef, not ref: a deep ref would run Vue's UnwrapRef over the three.js
// objects, and MeshStandardMaterial's self-referential WebGPU node fields
// don't survive that transform (see DeviceModel.vue for the same trap).
const bookMeshes = shallowRef<BookMeshDef[]>([])
let cancelled = false

// The model carries its own Blender scale and origin, so it's centred and
// scaled to BOOK_HEIGHT from its measured bounds rather than by hard-coded
// numbers - a re-export at a different size still lands on the ring.
function prepareGeometry(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  const centre = new THREE.Vector3()
  const size = new THREE.Vector3()
  box.getCenter(centre)
  box.getSize(size)
  geometry.translate(-centre.x, -centre.y, -centre.z)
  const scale = BOOK_HEIGHT / size.y
  geometry.scale(scale, scale, scale)
}

function findFirstMesh(root: THREE.Object3D): THREE.Mesh {
  let found: THREE.Mesh | null = null
  root.traverse((obj) => {
    if (!found && (obj as THREE.Mesh).isMesh) found = obj as THREE.Mesh
  })
  if (!found) throw new Error('book.glb has no mesh')
  return found
}

function loadModel(): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(bookUrl, (gltf) => resolve(gltf.scene), undefined, reject)
  })
}

onMounted(async () => {
  const [scene, covers] = await Promise.all([
    loadModel(),
    Promise.all(props.books.map((book) => loadImage(book.coverImage))),
  ])
  if (cancelled) return

  const mesh = findFirstMesh(scene)
  prepareGeometry(mesh.geometry)
  const geometry = mesh.geometry

  // Every source model here has exactly one material; Mesh.material is typed
  // as Material | Material[], so narrow before the cast.
  const baseMaterial = (
    Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
  ) as THREE.MeshStandardMaterial
  const baseImage = baseMaterial.map?.image as CanvasImageSource | undefined

  bookMeshes.value = props.books.map((book, index) => {
    const angle = (index / props.books.length) * Math.PI * 2
    // Clone so each book gets its own composited map while the emissive and
    // metallic-roughness maps stay shared with the base material.
    const material = baseMaterial.clone()
    if (baseImage) {
      material.map = makeBookTexture(baseImage, covers[index], book.coverColor)
    }
    return {
      book,
      geometry,
      material,
      // Front cover faces +Z, so the same ring placement the box proxy used
      // still turns each cover outward.
      position: [Math.sin(angle) * RING_RADIUS, 0, Math.cos(angle) * RING_RADIUS],
      rotationY: angle,
      onClick: () => openBook(book),
      onEnter: () => onEnter(book.id),
    }
  })
})

// ── pedestal the books stand on ───────────────────────────────────────────
// Sizing/placement inputs for BookPedestal, which owns the model itself.
// It sits OUTSIDE the spinning group in the template below: the cylinder
// proxy it replaced was rotationally symmetric so spinning it was invisible,
// but a wood-grained model visibly turns, and a still pedestal under a
// turning carousel is the better read anyway.
const PEDESTAL_DIAMETER = (RING_RADIUS + 0.22) * 2
const BOOKS_BOTTOM_Y = -BOOK_HEIGHT / 2

// ── interaction + per-frame spin ──────────────────────────────────────────
const hoveredId = ref<string | null>(null)

function onEnter(bookId: string) {
  hoveredId.value = bookId
  emit('hover', bookId)
}

function onLeave() {
  hoveredId.value = null
  emit('hover', null)
}

function openBook(book: Book) {
  window.open(book.amazonUrl, '_blank', 'noopener,noreferrer')
}

// Reactive per-frame bindings instead of Tres template refs (see
// DeviceModel.vue for the rationale).
const REST_SPIN_SPEED = 0.15
const rotationY = ref(0)
const spinSpeed = ref(REST_SPIN_SPEED)
const scales = ref<number[]>(props.books.map(() => 1))

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  // Ease the spin to a stop while a book is hovered, and back up after.
  const targetSpeed = hoveredId.value ? 0 : REST_SPIN_SPEED
  spinSpeed.value += (targetSpeed - spinSpeed.value) * Math.min(1, delta * 6)
  rotationY.value = (rotationY.value + delta * spinSpeed.value) % (Math.PI * 2)

  // Hovered book pops up noticeably larger, snapping in fast and settling
  // back out slower so it reads as a deliberate pop rather than a wobble.
  const next = scales.value.slice()
  let changed = false
  bookMeshes.value.forEach((def, i) => {
    const hovered = def.book.id === hoveredId.value
    const target = hovered ? 1.45 : 1
    const rate = hovered ? 22 : 9
    const eased = next[i] + (target - next[i]) * Math.min(1, delta * rate)
    if (Math.abs(eased - next[i]) > 0.0001) {
      next[i] = eased
      changed = true
    }
  })
  if (changed) scales.value = next
})

onUnmounted(() => {
  cancelled = true
  // Geometry is one shared instance across every def, so dispose it once.
  bookMeshes.value[0]?.geometry.dispose()
  // Likewise only the base colour map is per-book (see the clone above); the
  // remaining maps are shared, so they're disposed once with the first.
  bookMeshes.value.forEach((def, i) => {
    def.material.map?.dispose()
    if (i === 0) {
      def.material.emissiveMap?.dispose()
      def.material.metalnessMap?.dispose()
      def.material.roughnessMap?.dispose()
      def.material.normalMap?.dispose()
    }
    def.material.dispose()
  })
})
</script>

<template>
  <TresGroup :rotation="[0, rotationY, 0]">
    <TresMesh
      v-for="(def, index) in bookMeshes"
      :key="def.book.id"
      :geometry="def.geometry"
      :material="def.material"
      :position="def.position"
      :rotation="[0, def.rotationY, 0]"
      :scale="[scales[index], scales[index], scales[index]]"
      @click="def.onClick"
      @pointerenter="def.onEnter"
      @pointerleave="onLeave"
    />
  </TresGroup>

  <!-- Outside the group above so it stays still while the books turn, and
       so this subtree is untouched by that group's per-frame re-render. -->
  <BookPedestal
    :diameter="PEDESTAL_DIAMETER"
    :top-y="BOOKS_BOTTOM_Y"
  />
</template>
