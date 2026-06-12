<script setup lang="ts">
import { useApiResource } from '../composables/useApi'
import { fallbackProfile } from '../data/fallback'
import type { Profile } from '../types'

const { data: profile } = useApiResource<Profile>('/profile', fallbackProfile)

const accentClasses = ['accent-violet', 'accent-coral', 'accent-cyan']
</script>

<template>
  <section id="skills">
    <div class="container">
      <p class="section-eyebrow">Skills &amp; Strengths</p>
      <h2 class="section-title">A full-stack toolkit, sharpened across two industries</h2>
      <p class="section-intro">
        From responsive Vue.js front ends to robust C# / .NET back-end services, with the
        engineering discipline that comes from shipping games under tight deadlines.
      </p>

      <div class="skills__tags">
        <span v-for="skill in profile.skills" :key="skill" class="skills__tag">{{ skill }}</span>
      </div>

      <div class="skills__strengths">
        <div
          v-for="(strength, index) in profile.strengths"
          :key="strength.title"
          class="strength-card"
          :class="accentClasses[index % accentClasses.length]"
        >
          <h3>{{ strength.title }}</h3>
          <p>{{ strength.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 32px 0 48px;
}

.skills__tag {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.skills__strengths {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.strength-card {
  padding: 28px;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 4px solid var(--accent-color, var(--color-primary));
}

.strength-card h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.accent-violet {
  --accent-color: var(--color-primary);
}
.accent-coral {
  --accent-color: var(--color-accent);
}
.accent-cyan {
  --accent-color: var(--color-cyan);
}
</style>
