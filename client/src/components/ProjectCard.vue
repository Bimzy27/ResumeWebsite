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
              d="M66.5 7.7c-.8-2.9-3-5.1-5.9-5.9C55.5.5 34 .5 34 .5S12.5.5 7.4 1.8C4.5 2.6 2.3 4.8 1.5 7.7.2 12.8.2 24 .2