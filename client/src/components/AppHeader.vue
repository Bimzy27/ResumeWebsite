<script setup lang="ts">
import { SHOW_DEVICE_BOOKSHELF } from '../featureFlags'

const links = [
  { id: 'top', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  ...(SHOW_DEVICE_BOOKSHELF
    ? [
        { id: 'device', label: 'Device' },
        { id: 'bookshelf', label: 'Bookshelf' },
      ]
    : []),
  { id: 'contact', label: 'Contact' },
]

// The "About" link/logo both target #top, which sits below the sticky
// header in the document - a plain anchor jump lands at the hero's
// offsetTop (i.e. just past the header), not the literal top of the page.
// Scrolling the window itself to 0 bypasses that and reaches the true top.
//
// The browser can cancel a programmatic smooth scroll before it completes:
// a layout shift while heavy content (the 3D scenes) is still loading
// triggers scroll anchoring, which strands the page a few dozen pixels
// short of the top. When the scroll settles, snap to 0 if the animation was
// cut off. `scrollend` fires once per settled scroll in Chromium and
// Firefox; the timeout covers Safari, which lacks the event. Any user input
// that scrolls (wheel, touch, keys) disarms the snap so we never yank the
// page away from someone who changed their mind mid-animation.
let snapTimer: number | undefined
const disarmEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const

function disarmSnap() {
  window.clearTimeout(snapTimer)
  window.removeEventListener('scrollend', snapToTopIfStranded)
  for (const event of disarmEvents) window.removeEventListener(event, disarmSnap)
}

function snapToTopIfStranded() {
  disarmSnap()
  if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: 'instant' })
}

function scrollToTop(event: MouseEvent) {
  event.preventDefault()
  disarmSnap()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  window.addEventListener('scrollend', snapToTopIfStranded)
  for (const disarmEvent of disarmEvents) {
    window.addEventListener(disarmEvent, disarmSnap, { passive: true })
  }
  snapTimer = window.setTimeout(snapToTopIfStranded, 2000)
  history.replaceState(null, '', '#top')
}
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <a
        href="#top"
        class="header__logo"
        @click="scrollToTop"
      >Branden Immerzeel</a>
      <nav class="header__nav">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          @click="link.id === 'top' ? scrollToTop($event) : undefined"
        >{{ link.label }}</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(253, 252, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.header__logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-text);
  text-decoration: none;
  white-space: nowrap;
}

.header__nav {
  display: flex;
  gap: 28px;
}

.header__nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.15s ease;
  /* Touch-size hit area; visually inert because the fixed-height header row
     centers the links. */
  padding: 14px 0;
}

.header__nav a:hover {
  color: var(--color-primary);
}

/* tablet, see breakpoints in style.css. One row can't fit the logo plus all
   five links below ~620px, so the header becomes two rows: logo on top, nav
   spread across its own full-width row. The links' vertical padding gives
   each a 44px-plus touch target. */
@media (max-width: 768px) {
  .header__inner {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding-top: 12px;
  }

  .header__nav {
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0;
  }

  .header__nav a {
    font-size: 0.9rem;
    padding: 14px 4px;
  }

  /* Padded hit area for the logo link; the negative margin keeps the two
     header rows at their visual height. */
  .header__logo {
    padding: 11px 0;
    margin: -11px 0;
  }
}
</style>
