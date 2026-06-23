<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// A small canvas overlay, fixed to the viewport above everything else but
// never intercepting clicks (pointer-events: none). Rather than a cloud of
// independent particles, this tracks a single trail of recent head
// positions: a "head" point eases toward the real cursor position each
// frame (so it glides instead of snapping), and the most recent head
// positions are kept in a short history. The newest point (closest to the
// current cursor location) is drawn biggest and brightest; each older point
// — which is, by construction, farther from wherever the cursor is right
// now — is drawn smaller and dimmer, tapering the trail off to nothing.

interface Point {
  x: number
  y: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

const TRAIL_COLOR = '124, 58, 237' // var(--color-primary)
const MAX_RADIUS = 13
const DEFAULT_TRAIL_LENGTH = 14
// How quickly the head catches up to the real cursor position — lower is
// laggier/floatier, higher snaps closer to the actual pointer.
const EASE = 0.12

let ctx: CanvasRenderingContext2D | null = null
let rafId = 0
let width = 0
let height = 0
let dpr = 1
let reduceMotion = false
// Reduced-motion visitors get just the single head dot, no tapering tail.
let trailLength = DEFAULT_TRAIL_LENGTH

const target: Point = { x: 0, y: 0 }
const head: Point = { x: 0, y: 0 }
let trail: Point[] = []
let hasMoved = false

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function onPointerMove(event: PointerEvent) {
  target.x = event.clientX
  target.y = event.clientY
  if (!hasMoved) {
    // First move: snap immediately instead of easing in from a stale 0,0.
    head.x = target.x
    head.y = target.y
    hasMoved = true
  }
}

function tick() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  if (hasMoved) {
    head.x += (target.x - head.x) * EASE
    head.y += (target.y - head.y) * EASE

    trail.push({ x: head.x, y: head.y })
    if (trail.length > trailLength) trail.shift()

    const count = trail.length
    for (let i = 0; i < count; i++) {
      const point = trail[i]
      // 0 for the oldest/farthest point, 1 for the newest (at the cursor).
      const t = (i + 1) / count
      const radius = MAX_RADIUS * t
      const alpha = t * t * 0.5

      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${TRAIL_COLOR}, ${alpha})`
      ctx.fill()
    }
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Touch-primary devices have no hovering cursor to trail — skip entirely.
  const isTouchPrimary = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  if (isTouchPrimary) return

  // Respect reduced-motion by keeping just the head with no tapering tail.
  if (reduceMotion) trailLength = 1

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <canvas ref="canvasRef" class="cursor-trail" aria-hidden="true"></canvas>
</template>

<style scoped>
.cursor-trail {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}
</style>
