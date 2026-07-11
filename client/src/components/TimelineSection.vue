<script setup lang="ts">
import { useApiResource } from '../composables/useApi'
import { fallbackExperience } from '../data/fallback'
import type { ExperienceEntry } from '../types'
import TimelineItem from './TimelineItem.vue'

const { data: experience } = useApiResource<ExperienceEntry[]>('/experience', fallbackExperience)
</script>

<template>
  <section
    id="experience"
    class="timeline-section"
  >
    <div class="container">
      <p class="section-eyebrow">
        Career Timeline
      </p>
      <h2 class="section-title">
        Where I've worked
      </h2>
      <p class="section-intro">
        Eight years across enterprise web platforms and award-winning game studios.
      </p>

      <div class="timeline">
        <div class="timeline__line" />
        <TimelineItem
          v-for="(entry, index) in experience"
          :key="entry.id"
          :entry="entry"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline-section {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.timeline {
  position: relative;
  margin-top: 48px;
}

.timeline__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: var(--color-border);
  transform: translateX(-1px);
}

@media (max-width: 768px) {
  .timeline__line {
    left: 9px;
  }
}
</style>
