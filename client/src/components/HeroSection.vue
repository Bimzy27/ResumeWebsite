<script setup lang="ts">
import { useApiResource } from '../composables/useApi'
import { fallbackProfile, fallbackRecommendations } from '../data/fallback'
import type { Profile, RecommendationEntry } from '../types'
import RecommendationsCarousel from './RecommendationsCarousel.vue'

const { data: profile } = useApiResource<Profile>('/profile', fallbackProfile)
const { data: recommendations } = useApiResource<RecommendationEntry[]>(
  '/recommendations',
  fallbackRecommendations,
)
</script>

<template>
  <section id="top" class="hero">
    <div class="container hero__inner">
      <p class="section-eyebrow">Senior Software Engineer</p>
      <h1 class="hero__name">
        Hi, I'm <span class="hero__highlight">{{ profile.name }}</span>
      </h1>
      <p class="hero__summary">{{ profile.summary }}</p>
      <div class="hero__actions">
        <a href="#experience" class="btn btn-primary">View my experience</a>
        <a href="#contact" class="btn btn-secondary">Get in touch</a>
      </div>

      <div class="hero__spacer" aria-hidden="true"></div>
      <RecommendationsCarousel :recommendations="recommendations" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-top: 120px;
  padding-bottom: 100px;
  min-height: 640px;
  overflow: hidden;
}

@media (min-width: 901px) {
  .hero {
    min-height: 100vh;
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;
  }
}

.hero__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

@media (min-width: 901px) {
  .hero__inner {
    margin-left: auto;
    margin-right: 0;
    max-width: clamp(560px, 42vw, 860px);
    text-align: left;
  }
}

.hero__name {
  font-size: clamp(2.2rem, 4.2vw, 3.2rem);
  font-weight: 700;
}

.hero__highlight {
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__summary {
  max-width: 680px;
  font-size: 1.1rem;
}

.hero__actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 8px;
}

/* Preserves the vertical gap left by the removed location/email meta row, so
   the spacing between the hero actions and the recommendations stays the same. */
.hero__spacer {
  height: 44px;
}
</style>
