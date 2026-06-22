<script setup lang="ts">
const links = [
  { id: 'top', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

// The "About" link/logo both target #top, which sits below the sticky
// header in the document — a plain anchor jump lands at the hero's
// offsetTop (i.e. just past the header), not the literal top of the page.
// Scrolling the window itself to 0 bypasses that and reaches the true top.
function scrollToTop(event: MouseEvent) {
  event.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  history.replaceState(null, '', '#top')
}
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <a href="#top" class="header__logo" @click="scrollToTop">Branden Immerzeel</a>
      <nav class="header__nav">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          @click="link.id === 'top' ? scrollToTop($event) : undefined"
          >{{ link.label }}</a
        >
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
}

.header__nav a:hover {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .header__nav {
    gap: 16px;
  }
  .header__nav a {
    font-size: 0.85rem;
  }
}
</style>
