<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '../types'

defineProps<{ project: Project }>()

// Lazy YouTube: show the thumbnail until the visitor clicks, then swap in the
// iframe with autoplay. Keeps the page light (no third-party iframes on load).
const playing = ref(false)
</script>

<template>
  <article class="project-card">
    <!-- Click-to-play YouTube embed -->
    <div v-if="project.media?.type === 'youtube'" class="project-card__media">
      <iframe
        v-if="playing"
        class="project-card__iframe"
        :src="`https://www.youtube-nocookie.com/embed/${project.media.videoId}?autoplay=1&rel=0`"
        :title="`${project.title} video`"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <button
        v-else
        type="button"
        class="project-card__play"
        :aria-label="`Play ${project.title} video`"
        @click="playing = true"
      >
        <img
          class="project-card__thumb"
          :src="`https://img.youtube.com/vi/${project.media.videoId}/hqdefault.jpg`"
          :alt="project.title"
          loading="lazy"
        />
        <span class="project-card__play-icon" aria-hidden="true">
          <svg viewBox="0 0 68 48">
            <path
              class="yt-shell"
              d="M66.5 7.7c-.8-2.9-3-5.1-5.9-5.9C55.5.5 34 .5 34 .5S12.5.5 7.4 1.8C4.5 2.6 2.3 4.8 1.5 7.7.2 12.8.2 24 .2 24s0 11.2 1.3 16.3c.8 2.9 3 5.1 5.9 5.9C13.5 47.5 34 47.5 34 47.5s21.5 0 26.6-1.3c2.9-.8 5.1-3 5.9-5.9C67.8 35.2 67.8 24 67.8 24s0-11.2-1.3-16.3z"
            />
            <path d="M27 34l18-10-18-10z" fill="#fff" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Static screenshot (optionally linked) -->
    <component
      :is="project.media?.url ? 'a' : 'div'"
      v-else-if="project.media?.type === 'image'"
      class="project-card__media project-card__media--image"
      :href="project.media.url"
      :target="project.media.url ? '_blank' : undefined"
      :rel="project.media.url ? 'noopener' : undefined"
    >
      <img
        class="project-card__thumb"
        :src="project.media.src"
        :alt="project.media.alt ?? project.title"
        loading="lazy"
      />
    </component>

    <!-- Google Play block -->
    <a
      v-else-if="project.media?.type === 'playstore'"
      class="project-card__media project-card__media--play"
      :href="project.media.url"
      target="_blank"
      rel="noopener"
      :aria-label="`${project.title} on Google Play`"
    >
      <span class="store-badge">
        <svg class="store-badge__icon" viewBox="0 0 512 512" aria-hidden="true">
          <path fill="#00d3ff" d="M48 32 322 256 48 480c-9-5-16-15-16-28V60c0-13 7-23 16-28z" />
          <path fill="#00f076" d="M48 32c4-2 9-3 14-2l254 146-60 60z" />
          <path fill="#ff3a44" d="M256 256l60 60L62 462c-5 1-10 0-14-2z" />
          <path fill="#ffc800" d="M316 196l84 48c18 10 18 34 0 44l-84 48-60-60z" />
        </svg>
        <span class="store-badge__text">
          <small>GET IT ON</small>
          <strong>Google Play</strong>
        </span>
      </span>
    </a>

    <!-- YouTube channel block -->
    <a
      v-else-if="project.media?.type === 'youtube-channel'"
      class="project-card__media project-card__media--channel"
      :href="project.media.url"
      target="_blank"
      rel="noopener"
      :aria-label="`${project.title} on YouTube`"
    >
      <span class="channel-play" aria-hidden="true">
        <svg viewBox="0 0 68 48">
          <path
            fill="#ff0000"
            d="M66.5 7.7c-.8-2.9-3-5.1-5.9-5.9C55.5.5 34 .5 34 .5S12.5.5 7.4 1.8C4.5 2.6 2.3 4.8 1.5 7.7.2 12.8.2 24 .2 24s0 11.2 1.3 16.3c.8 2.9 3 5.1 5.9 5.9C13.5 47.5 34 47.5 34 47.5s21.5 0 26.6-1.3c2.9-.8 5.1-3 5.9-5.9C67.8 35.2 67.8 24 67.8 24s0-11.2-1.3-16.3z"
          />
          <path d="M27 34l18-10-18-10z" fill="#fff" />
        </svg>
      </span>
      <span class="channel-handle">{{ project.media.handle }}</span>
    </a>

    <div class="project-card__body">
      <h3>{{ project.title }}</h3>
      <p>{{ project.description }}</p>
      <div class="project-card__tags">
        <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
      </div>
      <div v-if="project.actions?.length" class="project-card__actions">
        <a
          v-for="action in project.actions"
          :key="action.url"
          :href="action.url"
          target="_blank"
          rel="noopener"
          class="proj-btn"
          :class="action.variant === 'primary' ? 'proj-btn--primary' : 'proj-btn--secondary'"
        >
          {{ action.label }}
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(27, 27, 47, 0.08);
}

/* Media area — consistent 16:9 banner across every card. */
.project-card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: none;
  padding: 0;
  text-decoration: none;
}

.project-card__iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.project-card__play {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  cursor: pointer;
  background: #000;
}

.project-card__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease, filter 0.25s ease;
}

.project-card__play:hover .project-card__thumb {
  transform: scale(1.04);
  filter: brightness(0.9);
}

.project-card__media--image:hover .project-card__thumb {
  transform: scale(1.04);
}

.project-card__play-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-card__play-icon svg {
  width: 68px;
  height: 48px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.yt-shell {
  fill: #ff0000;
  transition: fill 0.2s ease;
}

.project-card__play:hover .yt-shell {
  fill: #f00;
  opacity: 1;
}

/* Google Play block: vibrant, playful gradient to echo the game. */
.project-card__media--play {
  background: linear-gradient(135deg, #ff6b4a, #f9ca24 35%, #22a6b3 70%, #be2edd);
}

.store-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 22px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.82);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  transition: transform 0.16s ease;
}

.project-card__media--play:hover .store-badge {
  transform: translateY(-2px) scale(1.03);
}

.store-badge__icon {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
}

.store-badge__text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  color: #fff;
  text-align: left;
}

.store-badge__text small {
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.store-badge__text strong {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
}

/* YouTube channel block. */
.project-card__media--channel {
  flex-direction: column;
  gap: 14px;
  background: radial-gradient(circle at 50% 35%, #ff4d4d 0%, #c4302b 60%, #8c1a16 100%);
}

.channel-play svg {
  width: 84px;
  height: 60px;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
  transition: transform 0.18s ease;
}

.project-card__media--channel:hover .channel-play svg {
  transform: scale(1.06);
}

.channel-handle {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  color: #fff;
  letter-spacing: 0.01em;
}

.project-card__body {
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.project-card__body h3 {
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

.project-card__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-top: auto;
  padding-top: 4px;
}

.proj-btn {
  display: inline-flex;
  align-items: center;
  padding: 9px 16px;
  border-radius: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.proj-btn:hover {
  transform: translateY(-2px);
}

.proj-btn--primary {
  background: var(--gradient-hero);
  color: #fff;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.28);
}

.proj-btn--primary:hover {
  filter: brightness(1.05);
}

.proj-btn--secondary {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
</style>
