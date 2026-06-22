<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { RecommendationEntry } from '../types'

const props = defineProps<{ recommendations: RecommendationEntry[] }>()

const index = ref(0)
const current = computed(() => props.recommendations[index.value])

// Slow enough to actually read a full quote before it advances.
const AUTOPLAY_MS = 14000
let timer = 0

function next() {
  if (props.recommendations.length === 0) return
  index.value = (index.value + 1) % props.recommendations.length
}

function prev() {
  if (props.recommendations.length === 0) return
  index.value = (index.value - 1 + props.recommendations.length) % props.recommendations.length
}

function goTo(i: number) {
  index.value = i
}

function startAutoplay() {
  stopAutoplay()
  if (props.recommendations.length <= 1) return
  timer = window.setInterval(next, AUTOPLAY_MS)
}

function stopAutoplay() {
  if (timer) {
    window.clearInterval(timer)
    timer = 0
  }
}

// Any manual interaction (arrow, dot) resets the autoplay clock so it
// doesn't advance again moments after the user just changed slides.
function manualGoTo(i: number) {
  goTo(i)
  startAutoplay()
}

function manualNext() {
  next()
  startAutoplay()
}

function manualPrev() {
  prev()
  startAutoplay()
}

onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<template>
  <div
    v-if="recommendations.length"
    class="recs"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <p class="recs__eyebrow">What colleagues say</p>

    <div class="recs__row">
      <div class="recs__nav">
        <button type="button" class="recs__arrow recs__arrow--prev" aria-label="Previous recommendation" @click="manualPrev">
          ‹
        </button>
        <div class="recs__dots" role="tablist" aria-label="Choose a recommendation">
          <button
            v-for="(r, i) in recommendations"
            :key="r.id"
            type="button"
            class="recs__dot"
            :class="{ 'is-active': i === index }"
            role="tab"
            :aria-selected="i === index"
            :aria-label="`Recommendation from ${r.name}`"
            @click="manualGoTo(i)"
          />
        </div>
        <button type="button" class="recs__arrow recs__arrow--next" aria-label="Next recommendation" @click="manualNext">
          ›
        </button>
      </div>

      <div class="recs__viewport">
        <Transition name="recs-fade" mode="out-in">
          <blockquote :key="current.id" class="recs__card">
            <p class="recs__quote">&ldquo;{{ current.quote }}&rdquo;</p>
            <footer class="recs__author">
              <span class="recs__name">{{ current.name }}</span>
              <span class="recs__sep" aria-hidden="true">·</span>
              <span class="recs__title">{{ current.title }}</span>
              <span class="recs__relationship">{{ current.relationship }}</span>
            </footer>
          </blockquote>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recs {
  /* The parent .hero__inner already applies a flex `gap` between its
     children; this adds a little extra breathing room on top of that so
     the carousel doesn't feel glued to the contact-info row above it. */
  margin-top: 12px;
  width: 100%;
  max-width: 600px;
}

.recs__eyebrow {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin: 0 0 10px;
}

.recs__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recs__nav {
  /* Prev button, page dots, and next button stacked vertically along the
     left edge. This column keeps its own compact, natural height instead
     of stretching to match the card — only the card grows or shrinks
     with the active quote's length. */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.recs__viewport {
  flex: 1;
  min-width: 0;
}

.recs__card {
  /* No fixed/grid sizing here — the card is free to grow or shrink with
     its own quote's length. */
  margin: 0;
  padding: 18px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.08);
}

.recs__quote {
  margin: 0 0 12px;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--color-text);
}

.recs__author {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.recs__name {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-text);
}

.recs__sep {
  opacity: 0.5;
}

.recs__title {
  flex-basis: 100%;
}

.recs__relationship {
  flex-basis: 100%;
  font-style: italic;
  opacity: 0.85;
}

.recs__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.recs__arrow:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Rotated so "previous"/"next" read as up/down, matching their vertical
   arrangement along the left edge instead of the usual left/right pair. */
.recs__arrow--prev {
  transform: rotate(90deg);
}

.recs__arrow--next {
  transform: rotate(90deg);
}

.recs__dots {
  /* Vertically stacked between the prev/next arrows rather than the usual
     horizontal row below the card. */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}

.recs__dot {
  width: 7px;
  height: 7px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--color-border);
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}

.recs__dot.is-active {
  background: var(--color-primary);
  transform: scale(1.3);
}

.recs-fade-enter-active,
.recs-fade-leave-active {
  transition: opacity 0.25s ease;
}

.recs-fade-enter-from,
.recs-fade-leave-to {
  opacity: 0;
}
</style>
