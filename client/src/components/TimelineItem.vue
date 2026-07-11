<script setup lang="ts">
import type { ExperienceEntry } from '../types'

defineProps<{
  entry: ExperienceEntry
  index: number
}>()
</script>

<template>
  <div
    class="timeline-item"
    :class="{ 'timeline-item--right': index % 2 === 1 }"
  >
    <div class="timeline-item__marker" />
    <div class="timeline-item__card">
      <span class="timeline-item__period">{{ entry.period }}</span>
      <h3>{{ entry.company }}</h3>
      <p class="timeline-item__role">
        {{ entry.role }}
      </p>
      <ul>
        <li
          v-for="(highlight, i) in entry.highlights"
          :key="i"
        >
          {{ highlight }}
        </li>
      </ul>
    </div>
    <div
      v-if="entry.image"
      class="timeline-item__media"
    >
      <img
        :src="entry.image"
        :alt="entry.imageAlt ?? entry.company"
        loading="lazy"
      >
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
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.timeline-item__card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 16px 32px rgba(124, 58, 237, 0.15);
}

.timeline-item--right .timeline-item__card {
  grid-column: 3;
}

/* Image sits in the column opposite the card. */
.timeline-item__media {
  grid-column: 3;
  align-self: center;
}

.timeline-item--right .timeline-item__media {
  grid-column: 1;
}

.timeline-item__media img {
  display: block;
  width: 100%;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: 0 12px 28px rgba(27, 27, 47, 0.1);
  object-fit: cover;
}

/* Keep the marker, card and image on the same grid row so the image always
   aligns with its paragraph (grid auto-placement would otherwise push the
   image on right-side rows down into a new row). */
@media (min-width: 769px) {
  .timeline-item__marker,
  .timeline-item__card,
  .timeline-item__media {
    grid-row: 1;
  }
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

  .timeline-item__media,
  .timeline-item--right .timeline-item__media {
    grid-column: 2;
    margin-top: 16px;
  }
}
</style>
