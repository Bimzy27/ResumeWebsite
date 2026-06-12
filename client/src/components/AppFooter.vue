<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <span>&copy; {{ year }} Branden Immerzeel</span>
      <span class="footer__stack">Built with Vue 3, TypeScript &amp; ASP.NET Core</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding: 32px 0;
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
</style>
