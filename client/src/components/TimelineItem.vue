<script setup lang="ts">
import type { ExperienceEntry } from '../types'

defineProps<{
  entry: ExperienceEntry
  index: number
}>()
</script>

<template>
  <div class="timeline-item" :class="{ 'timeline-item--right': index % 2 === 1 }">
    <div class="timeline-item__marker"></div>
    <div class="timeline-item__card">
      <span class="timeline-item__period">{{ entry.period }}</span>
      <h3>{{ entry.company }}</h3>
      <p class="timeline-item__role">{{ entry.role }}</p>
      <ul>
        <li v-for="(highlight, i) in entry.highlights" :key="i">{{ highlight }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  align-items: start;
  margin-bottom: 48px;
}

.timeline-item__marker {
  grid-column: 2;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--gradient-hero);
  margin-top: 8px;
  justify-self: center;
  box-shadow: 0 0 0 6px var(--color-bg);
}

.timeline-item__card {
  grid-column: 1;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
}

.timeline-item--right .timeline-item__card {
  grid-column: 3;
}

.timeline-item__period {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  color: var(--color-primary);
  background: rgba(124, 58, 237, 0.08);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
}

.timeline-item__card h3 {
  font-size: 1.3rem;
  margin-bottom: 4px;
}

.timeline-item__role {
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 16px;
}

.timeline-item__card ul {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-item__card li {
  color: var(--color-text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .timeline-item {
    grid-template-columns: 32px 1fr;
  }

  .timeline-item__marker {
    grid-column: 1;
    margin-top: 6px;
  }

  .timeline-item__card,
  .timeline-item--right .timeline-item__card {
    grid-column: 2;
  }
}
</style>
