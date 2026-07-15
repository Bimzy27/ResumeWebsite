<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'
import type { Book } from '../types'

// Rotating 3D carousel of the books Branden has read, built from proxy
// box-geometry books with generated cover textures.
// PLACEHOLDER GEOMETRY: a real bookshelf model arrives in a follow-up task;
// this proxy keeps the carousel, hover, and click-through behaviour working
// until then. Clicking a book opens its Amazon purchase link.

const props = defineProps<{ books: Book[] }>()

const emit = defineEmits<{
  // Pointer entered/left a book. null on leave; used by the parent for the
  // pointer cursor.
  hover: [bookId: string | null]
}>()

// ── cover texture ─────────────────────────────────────────────────────────
// Proxy covers are drawn onto a canvas: solid cover color, a lighter framing
// band, then the wrapped title and the author. Text color flips between
// near-white and near-black based on the cover's luminance.
function textColorFor(hex: string): string {
  const color = new THREE.Color(hex)
  // Relative luminance approximation on the sRGB components.
  const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b
  return luminance > 0.5 ? '#1b1b2f' : '#f5f2ff'
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function makeCoverTexture(book: Book): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 384
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = book.coverColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const ink = textColorFor(book.coverColor)
  ctx.strokeStyle = ink
  ctx.globalAlpha = 0.35
  ctx.lineWidth = 4
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28)
  ctx.globalAlpha = 1

  ctx.fillStyle = ink
  ctx.textAlign = 'center'
  ctx.font = '700 30px "Space Grotesk", system-ui, sans-serif'
  const lines = wrapText(ctx, book.title, canvas.width - 56)
  const lineHeight = 36
  const startY = 120 - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, startY + i * lineHeight))

  ctx.font = '500 20px "Inter", system-ui, sans-serif'
  ctx.fillText(book.author, canvas.width / 2, canvas.height - 44)

  const texture = new THREE.CanvasTexture(canvas)
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
    map: makeCoverTexture(book),
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

// ── shelf disc (proxy for the future bookshelf model) ─────────────────────
const shelfGeometry = new THREE.CylinderGeometry(RING_RADIUS + 0.22, RING_RADIUS + 0.22, 0.05, 48)
const shelfMaterial = new THREE.MeshStandardMaterial({ color: '#8a5a3b', roughness: 0.8 })

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
const rotationY = ref(0)
const spinSpeed = ref(0.3)
const scales = ref<number[]>(props.books.map(() => 1))

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  // Ease the spin to a stop while a book is hovered, and back up after.
  const targetSpeed = hoveredId.value ? 0 : 0.3
  spinSpeed.value += (targetSpeed - spinSpeed.value) * Math.min(1, delta * 6)
  rotationY.value = (rotationY.value + delta * spinSpeed.value) % (Math.PI * 2)

  // Hovered book grows slightly; everything eases back to rest.
  const next = scales.value.slice()
  let changed = false
  bookMeshes.forEach((def, i) => {
    const target = def.book.id === hoveredId.value ? 1.14 : 1
    const eased = next[i] + (target - next[i]) * Math.min(1, delta * 10)
    if (Math.abs(eased - next[i]) > 0.0001) {
      next[i] = eased
      changed = true
    }
  })
  if (changed) scales.value = next
})

onUnmounted(() => {
  bookGeometry.dispose()
  shelfGeometry.dispose()
  shelfMaterial.dispose()
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
    <!-- Shelf top surface sits exactly at the books' bottom edge
         (-BOOK_SIZE[1]/2 = -0.26): center at -0.26 - height/2. -->
    <TresMesh
      :geometry="shelfGeometry"
      :material="shelfMaterial"
      :position="[0, -0.285, 0]"
    />
  </TresGroup>
</template>
