<script setup lang="ts">
const links = [
  { id: 'top', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
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
      <div class="header__right">
        <nav class="header__nav">
          <a
            v-for="link in links"
            :key="link.id"
            :href="`#${link.id}`"
            @click="link.id === 'top' ? scrollToTop($event) : undefined"
          >{{ link.label }}</a>
        </nav>

        <div class="header__social">
          <a
            href="https://www.linkedin.com/in/branden-immerzeel/"
            target="_blank"
            rel="noopener"
            class="icon-btn icon-btn--linkedin"
            aria-label="LinkedIn profile"
            title="LinkedIn"
          >
            <svg
              class="icon-btn__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
              />
            </svg>
            <span class="icon-btn__label">LinkedIn</span>
          </a>

          <a
            href="https://www.youtube.com/@BimzyDev"
            target="_blank"
            rel="noopener"
            class="icon-btn icon-btn--youtube"
            aria-label="YouTube channel"
            title="YouTube"
          >
            <svg
              class="icon-btn__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"
              />
            </svg>
            <span class="icon-btn__label">YouTube</span>
          </a>
        </div>
      </div>
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

/* Fills the rest of the row after the logo. The nav's auto side margins
   (below) consume all the free space here evenly on both sides, which both
   centers the nav in the gap between the logo and the social buttons AND
   pushes the social buttons flush against the row's right edge - no
   justify-content needed, the auto margins already account for it. */
.header__right {
  display: flex;
  flex: 1;
  align-items: center;
}

.header__nav {
  display: flex;
  gap: 28px;
  margin: 0 auto;
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

.header__social {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Same button style as the Contact section's social links (see
   ContactSection.vue's .icon-btn), scaled down since these sit in the
   72px-tall header rather than the Contact section's dedicated row -
   duplicated here since Vue's scoped styles don't share across components. */
.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8rem;
  line-height: 1;
  text-decoration: none;
  transition:
    transform 0.16s ease,
    filter 0.16s ease,
    box-shadow 0.16s ease;
}

.icon-btn__icon {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.icon-btn:hover,
.icon-btn:focus-visible {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.icon-btn--linkedin {
  background: #0a66c2;
  box-shadow: 0 6px 14px rgba(10, 102, 194, 0.28);
}

.icon-btn--youtube {
  background: #ff0000;
  box-shadow: 0 6px 14px rgba(255, 0, 0, 0.28);
}

/* tablet, see breakpoints in style.css. One row can't fit the logo plus all
   links and social buttons below ~620px, so the header stacks: logo on top,
   nav on its own full-width row, then the social buttons on a row below
   that. The links' vertical padding gives each a 44px-plus touch target. */
@media (max-width: 768px) {
  .header__inner {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding-top: 12px;
  }

  .header__right {
    flex: initial;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 4px;
  }

  .header__nav {
    /* Cancels the desktop rule's auto side margins: those center the nav
       and shrink it to its content width, but this stacked mobile layout
       wants it stretched full-width with the links spread edge to edge. */
    margin: 0;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0;
  }

  .header__nav a {
    font-size: 0.9rem;
    padding: 14px 4px;
  }

  .header__social {
    /* Right-aligned to match the desktop row's flush-right position,
       instead of centered. */
    justify-content: flex-end;
    flex-wrap: wrap;
    padding-bottom: 12px;
  }

  .icon-btn {
    height: 44px;
  }

  /* Padded hit area for the logo link; the negative margin keeps the two
     header rows at their visual height. */
  .header__logo {
    padding: 11px 0;
    margin: -11px 0;
  }
}
</style>
