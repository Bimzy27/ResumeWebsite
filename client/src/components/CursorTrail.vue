<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// A small canvas overlay, fixed to the viewport above everything else but
// never intercepting clicks (pointer-events: none). Each pointer move spawns
// a couple of tiny particles at the cursor position; they drift slightly,
// shrink, and fade out over their lifetime, then get pruned from the array.
// Driven by requestAnimationFrame rather than re-rendering Vue-side DOM nodes
// per particle, since a few hundred of these need to update every frame
// without the overhead of the virtual DOM.

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  hue: string
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

// Pulled from the site's own palette so the trail reads as part of the
// design rather than a generic effect.
const COLORS = ['124, 58, 237', '255, 107, 74', '6, 182, 212']

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let rafId = 0
let width = 0
let height = 0
let dpr = 1
let lastSpawn = 0
let reduceMotion = false

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

function spawn(x: number, y: number) {
  // Throttled to ~every 16ms worth of movement so a fast swipe across the
  // screen doesn't dump dozens of particles in a single frame.
  const now = performance.now()
  if (now - lastSpawn < 16) return
  lastSpawn = now

  const count = reduceMotion ? 1 : 2
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6 - 0.15,
      size: Math.random() * 2.5 + 1.5,
      life: 0,
      maxLife: Math.random() * 400 + 400,
      hue: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
  }

  // Hard cap so a long idle drag session can't grow this unbounded.
  if (particles.length > 200) particles.splice(0, particles.length - 200)
}

function onPointerMove(event: PointerEvent) {
  spawn(event.clientX, event.clientY)
}

let prevTime = performance.now()

function tick() {
  if (!ctx) return
  const now = performance.now()
  const dt = now - prevTime
  prevTime = now

  ctx.clearRect(0, 0, width, height)

  particles = particles.filter((p) => p.life < p.maxLife)
  for (const p of particles) {
    p.life += dt
    p.x += p.vx * dt * 0.06
    p.y += p.vy * dt * 0.06

    const t = p.life / p.maxLife
    const alpha = 1 - t
    const radius = p.size * (1 - t * 0.6)

    ctx.beginPath()
    ctx.arc(p.x, p.y, Math.max(radius, 0), 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${p.hue}, ${alpha * 0.55})`
    ctx.fill()
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

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  prevTime = performance.now()
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
