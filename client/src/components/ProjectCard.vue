<script setup lang="ts">
import type { Project } from '../types'

defineProps<{ project: Project }>()
</script>

<template>
  <article class="project-card">
    <h3>{{ project.title }}</h3>
    <p>{{ project.description }}</p>
    <div class="project-card__tags">
      <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
    </div>
    <div class="project-card__links">
      <a v-if="project.links.repo" :href="project.links.repo" target="_blank" rel="noopener">Source</a>
      <a v-if="project.links.demo" :href="project.links.demo" target="_blank" rel="noopener">Live demo</a>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(27, 27, 47, 0.08);
}

.project-card h3 {
  font-size: 1.2rem;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.project-card__tags span {
  font-size: 0.78rem;
  font-weight: 600;
  font-family: var(--font-display);
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(6, 182, 212, 0.1);
  color: var(--color-cyan);
}

.project-card__links {
  display: flex;
  gap: 16px;
  margin-top: auto;
  font-weight: 600;
  font-size: 0.9rem;
}

.project-card__links a {
  text-decoration: none;
}
</style>
