<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'
import type { Book } from '../types'
import BookPedestal from './BookPedestal.vue'

// Rotating 3D carousel of the books Branden has read: proxy box-geometry
// books wearing their real Amazon cover art as the front-face texture (see
// public/book-covers/ and data/books.ts), standing on a real pedestal model
// (see BookPedestal.vue).
// PLACEHOLDER GEOMETRY: the books themselves are still boxes; only the
// pedestal is a real model so far. Clicking a book opens its Amazon
// purchase link.

// Reference BookPedestal explicitly so noUnusedLocals is satisfied.
// (vue-tsc sometimes fails to detect template-only usage inside TresCanvas.)
void BookPedestal

const props = defineProps<{ books: Book[] }>()

const emit = defineEmits<{
  // Pointer entered/left a book. null on leave; used by the parent for the
  // pointer cursor.
  hover: [bookId: string | null]
}>()

// ── cover texture ─────────────────────────────────────────────────────────
// One shared loader for every cover; textures populate asynchronously but
// the carousel is already animating every frame (spin/hover), so a cover
// simply appears once its image lands rather than needing an explicit
// re-render trigger.
const textureLoader = new THREE.TextureLoader()

function loadCoverTexture(book: Book): THREE.Texture {
  const texture = textureLoader.load(book.coverImage)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

// ── book meshes ───────────────────────────────────────────────────────────
// Books stand upright on a ring, front cover facing outward; the whole ring
// spins slowly and pauses while a book is hovered.
// Sized to fit the tall half-width column the carousel renders in since the
// device/bookshelf sections share one row (see BookshelfSection.vue).
const RING_RADIUS = 0.92
const BOOK_SIZE: [number, number, number] = [0.36, 0.52, 0.07]

const bookGeometry = new THREE.BoxGeometry(...BOOK_SIZE)

interface BookMeshDef {
  book: Book
  materials: THREE.Material[]
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

const pagesMat = new THREE.MeshStandardMaterial({ color: '#f5f0e6', roughness: 0.9 })

const bookMeshes: BookMeshDef[] = props.books.map((book, index) => {
  const angle = (index / props.books.length) * Math.PI * 2
  const coverMat = new THREE.MeshStandardMaterial({
    map: loadCoverTexture(book),
    roughness: 0.6,
  })
  const spineMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(book.coverColor).multiplyScalar(0.75),
    roughness: 0.6,
  })
  const backMat = new THREE.MeshStandardMaterial({ color: book.coverColor, roughness: 0.6 })
  return {
    book,
    // BoxGeometry face order: +x (fore-edge), -x (spine), +y, -y, +z (front
    // cover, faces outward after the rotation below), -z (back cover).
    materials: [pagesMat, spineMat, pagesMat, pagesMat, coverMat, backMat],
    position: [Math.sin(angle) * RING_RADIUS, 0, Math.cos(angle) * RING_RADIUS],
    rotationY: angle,
    onClick: () => openBook(book),
    onEnter: () => onEnter(book.id),
  }
})

// ── pedestal the books stand on ───────────────────────────────────────────
// Sizing/placement inputs for BookPedestal, which owns the model itself.
// It sits OUTSIDE the spinning group in the template below: the cylinder
// proxy it replaced was rotationally symmetric so spinning it was invisible,
// but a wood-grained model visibly turns, and a still pedestal under a
// turning carousel is the better read anyway.
const PEDESTAL_DIAMETER = (RING_RADIUS + 0.22) * 2
const BOOKS_BOTTOM_Y = -BOOK_SIZE[1] / 2

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
  bookMeshes.forEach((def, i) => {
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
  bookGeometry.dispose()
  pagesMat.dispose()
  for (const def of bookMeshes) {
    for (const mat of def.materials) {
      if (mat === pagesMat) continue
      const std = mat as THREE.MeshStandardMaterial
      std.map?.dispose()
      std.dispose()
    }
  }
})
</script>

<template>
  <TresGroup :rotation="[0, rotationY, 0]">
    <TresMesh
      v-for="(def, index) in bookMeshes"
      :key="def.book.id"
      :geometry="bookGeometry"
      :material="def.materials"
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
