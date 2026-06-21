<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Background3D from './Background3DScene.vue'
import HeroSection from './HeroSection.vue'
import SkillsSection from './SkillsSection.vue'

// Pins the 3D desk scene behind both the Hero and Skills sections (via a
// CSS-grid sticky trick: bg + fg share the same grid cell, so the bg stays
// pinned to the viewport for as long as the foreground content is taller
// than 100vh). Scroll progress through the Hero section's own height drives
// the camera from a tight torso/head close-up to the full wide desk shot —
// by the time the Skills section scrolls into view, the camera is fully
// zoomed out and stays that way for the rest of the pinned scroll.
const progress = ref(0)
const heroRef = ref<HTMLElement | null>(null)

let rafId = 0

function updateProgress() {
  const el = heroRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const heroHeight = el.offsetHeight || 1
  const scrolled = -rect.top
  progress.value = Math.min(1, Math.max(0, scrolled / heroHeight))
}

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    updateProgress()
    rafId = 0
  })
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="scrolly">
    <div class="scrolly__bg">
      <!-- Hero's purple glow, rendered behind the 3D canvas. It used to live
           inside HeroSection with z-index:-1, but that only ordered it
           relative to siblings within .scrolly__fg (z-index 1) — it could
           never appear behind .scrolly__bg (z-index 0) from there, since a
           child can't escape its ancestor's stacking context. The canvas
           above is alpha-transparent except where the avatar actually draws,
           so this shows through everywhere except where it's occluded by
           the avatar. -->
      <div class="scrolly__glow"></div>
      <Background3D :progress="progress" />
    </div>
    <div class="scrolly__fg">
      <div ref="heroRef"><HeroSection /></div>
      <SkillsSection />
    </div>
  </div>
</template>

<style scoped>
.scrolly {
  display: grid;
  grid-template-columns: 1fr;
}

.scrolly__bg {
  grid-row: 1;
  grid-column: 1;
  position: sticky;
  top: 0;
  height: 100vh;
  align-self: start;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.scrolly__glow {
  position: absolute;
  /* Overscan past the blur radius so it doesn't fade out at the edges;
     .scrolly__bg's overflow:hidden clips this back to its 100vh box. */
  inset: -100px;
  /* Radial blob (purple core easing through indigo into a cyan/blue accent)
     instead of a flat linear wash across the whole box — the alpha stops
     taper it to fully transparent on their own, and the mask below adds an
     extra fade toward the bottom so it reads as a glow, not a painted panel. */
  background: radial-gradient(
    ellipse 75% 65% at 65% 10%,
    rgba(124, 58, 237, 0.55) 0%,
    rgba(79, 70, 229, 0.38) 35%,
    rgba(6, 182, 212, 0.22) 60%,
    rgba(6, 182, 212, 0) 85%
  );
  filter: blur(80px);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 40%, transparent 80%);
  mask-image: linear-gradient(to bottom, black 0%, black 40%, transparent 80%);
}

.scrolly__fg {
  grid-row: 1;
  grid-column: 1;
  z-index: 1;
}

@media (max-width: 900px) {
  .scrolly {
    display: block;
  }

  .scrolly__bg {
    display: none;
  }
}
</style>
