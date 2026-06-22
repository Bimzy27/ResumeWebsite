<script setup lang="ts">
import { useApiResource } from '../composables/useApi'
import { fallbackProfile } from '../data/fallback'
import type { Profile } from '../types'

const { data: profile } = useApiResource<Profile>('/profile', fallbackProfile)
</script>

<template>
  <section id="top" class="hero">
    <div class="container hero__inner">
      <p class="section-eyebrow">Senior Full-Stack Software Engineer</p>
      <h1 class="hero__name">
        Hi, I'm <span class="hero__highlight">{{ profile.name }}</span>
      </h1>
      <p class="hero__summary">{{ profile.summary }}</p>
      <div class="hero__actions">
        <a href="#experience" class="btn btn-primary">View my experience</a>
        <a href="#contact" class="btn btn-secondary">Get in touch</a>
      </div>
      <ul class="hero__meta">
        <li>{{ profile.contact.location }}</li>
        <li><a :href="`mailto:${profile.contact.email}`">{{ profile.contact.email }}</a></li>
        <li><a :href="profile.contact.linkedIn" target="_blank" rel="noopener">LinkedIn</a></li>
      </ul>
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
    /* Full-viewport height so nothing from the next (sticky-pinned) section
       can peek into view before the user actually starts scrolling. */
    min-height: 100vh;
    /* Cap the usable width on ultra-wide monitors so the right-anchored text
       column stays a sensible distance from the literal browser edge instead
       of being flush against it. */
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
    /* Wide enough that "Hi, I'm Branden Immerzeel" stays on one line at the
       heading's clamped font size, instead of wrapping "Immerzeel" down. */
    max-width: 820px;
    text-align: left;
  }
}

.hero__name {
  font-size: clamp(2.4rem, 6vw, 4rem);
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

.hero__meta {
  list-style: none;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding: 0;
  margin: 24px 0 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.hero__meta a {
  color: var(--color-text-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
}

.hero__meta a:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
</style>
