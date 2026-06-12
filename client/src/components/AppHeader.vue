<script setup lang="ts">
const links = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <a href="#top" class="header__logo">Branden Immerzeel</a>
      <nav class="header__nav">
        <a v-for="link in links" :key="link.id" :href="`#${link.id}`">{{ link.label }}</a>
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
