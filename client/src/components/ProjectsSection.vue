<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useApiResource } from '../composables/useApi'
import { fallbackProjects } from '../data/fallback'
import type { Project } from '../types'
import ProjectCard from './ProjectCard.vue'

const { data: projects } = useApiResource<Project[]>('/projects', fallbackProjects)

// --- Pinned horizontal scroll ----------------------------------------------
// When the projects row is wider than the visible area, we "pin" the whole
// section to the viewport (via position: sticky) and translate the card track
// horizontally in step with the page's vertical scroll. The result: as the
// visitor scrolls down and reaches this section, the page appears to stop
// scrolling vertically while the cards slide to reveal the rightmost project,
// then normal vertical scrolling resumes once they're fully revealed. Scrolling
// back up reverses it. The extra page height we reserve below the section is
// exactly the horizontal travel distance, so vertical scroll maps 1:1 to
// horizontal movement and feels natural.
//
// This is a scroll-LINKED effect, not a wheel hijack: we never call
// preventDefault, so trackpads, touch, keyboard (PageDown), and the scrollbar
// all keep working. On small screens and for visitors who prefer reduced
// motion, we fall back to a plain native horizontal-scroll row instead.

const root = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)

const pinned = ref(false)
const centered = ref(true)
const maxTranslate = ref(0)
const translateX = ref(0)

let rafId = 0
let resizeObserver: ResizeObserver | null = null
let reduceMotion: MediaQueryList | null = null
let smallScreen: MediaQueryList | null = null

const sectionStyle = computed(() =>
  pinned.value ? { height: `calc(100vh + ${maxTranslate.value}px)` } : {},
)
const trackStyle = computed(() =>
  pinned.value ? { transform: `translate3d(${-translateX.value}px, 0, 0)` } : {},
)

// Decide whether to pin, and how far the track can travel.
function measure() {
  const vp = viewport.value
  const tr = track.value
  if (!vp || !tr) return

  const disabled = (reduceMotion?.matches ?? false) || (smallScreen?.matches ?? false)
  const overflow = Math.max(0, tr.scrollWidth - vp.clientWidth)

  // When every card fits the rail, centre the group on the page; once they
  // overflow they sit flush-left so scroll/pin can reveal the rightmost ones.
  centered.value = overflow <= 0

  if (disabled || overflow <= 0) {
    pinned.value = false
    maxTranslate.value = 0
    translateX.value = 0
    return
  }

  pinned.value = true
  maxTranslate.value = overflow
  update()
}

// Map the section's scroll position to a horizontal offset.
function update() {
  if (!pinned.value || !root.value) return
  const rect = root.value.getBoundingClientRect()
  // While the sticky child is pinned, rect.top travels from 0 down to
  // -maxTranslate (because the section is exactly maxTranslate taller than the
  // viewport). Normalise that to 0..1 and apply it as the horizontal offset.
  const progress = Math.min(1, Math.max(0, -rect.top / maxTranslate.value))
  translateX.value = progress * maxTranslate.value
}

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    update()
  })
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  smallScreen = window.matchMedia('(max-width: 768px)')
  reduceMotion.addEventListener('change', measure)
  smallScreen.addEventListener('change', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure)

  // Recompute when the track's size changes — covers async project data,
  // lazy-loaded thumbnails, and web-font swaps shifting the layout.
  if (track.value) {
    resizeObserver = new ResizeObserver(() => measure())
    resizeObserver.observe(track.value)
  }

  nextTick(measure)
})

watch(projects, () => nextTick(measure))

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measure)
  reduceMotion?.removeEventListener('change', measure)
  smallScreen?.removeEventListener('change', measure)
  resizeObserver?.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section
    id="projects"
    ref="root"
    class="projects"
    :class="{ 'projects--pinned': pinned }"
    :style="sectionStyle"
  >
    <div class="projects__sticky">
      <div class="container">
        <p class="section-eyebrow">Projects</p>
        <h2 class="section-title">Things I've built</h2>
        <p class="section-intro">
          A selection of things I've designed and built.
        </p>
      </div>

      <div class="projects__rail">
        <div class="projects__viewport" ref="viewport">
          <div
            class="projects__track"
            :class="{ 'projects__track--centered': centered }"
            ref="track"
            :style="trackStyle"
          >
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* The heading stays in the site's standard 1100px centred column so it lines
   up with every other section. Only the card rail gets the extra width, as its
   own page-centred band: up to five 340px cards (24px gaps) fit on one line on
   a large enough screen — 5 * 340 + 4 * 24 + 2 * 24 padding = 1844px. On
   narrower viewports the row overflows and the pinned horizontal scroll takes
   over as before. */
.projects__rail {
  width: 100%;
  max-width: 1844px;
  margin: 0 auto;
  padding: 0 24px;
}

/* When pinned, the section itself is taller than the viewport (its height is
   set inline) and the inner block sticks to the top of the screen for the
   duration of the horizontal travel. Drop the default section padding so the
   100vh sticky child controls the vertical rhythm. */
.projects--pinned {
  padding: 0;
}

.projects--pinned .projects__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

/* The window onto the card track. */
.projects__viewport {
  margin-top: 40px;
  /* Fallback (not pinned): a normal native horizontal-scroll row. */
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
  /* Vertical room so the cards' hover lift + shadow aren't clipped. */
  padding: 18px 0 34px;
}

/* Pinned: cards move via transform, so the viewport just clips, it doesn't
   scroll. Horizontal overflow is hidden at the container edges; the vertical
   padding above keeps hover shadows visible. */
.projects--pinned .projects__viewport {
  overflow: hidden;
}

.projects__track {
  display: flex;
  flex-wrap: nowrap;
  gap: 24px;
  will-change: transform;
}

/* When the cards all fit, centre them within the rail so the group sits in the
   middle of the page instead of bunching to the left. Only applied when there's
   no overflow, so it never interferes with the flush-left start the scroll/pin
   relies on. */
.projects__track--centered {
  justify-content: center;
}

/* Fixed-width cards that never shrink, so the row can exceed the container
   width and have somewhere to travel. */
.projects__track > * {
  flex: 0 0 340px;
  scroll-snap-align: start;
}

@media (max-width: 768px) {
  /* Below the pin breakpoint cards become swipeable viewport-width panels. */
  .projects__track > * {
    flex-basis: min(85vw, 340px);
  }
}
</style>
