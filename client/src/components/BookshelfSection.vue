<script setup lang="ts">
import { ref } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping } from 'three'
import { books } from '../data/books'
import { useSectionScene } from '../composables/useSectionScene'
import BookCarousel from './BookCarousel.vue'

// Bookshelf section: a rotating 3D carousel of the books Branden has read.
// Clicking a book opens its Amazon purchase link in a new tab. On phones
// (and without WebGL) the canvas never mounts and the same books render as a
// plain grid of links instead; on desktop that grid doubles as the
// screen-reader/keyboard path (visually hidden), since a WebGL canvas offers
// neither semantics nor focus.

const sectionRef = ref<HTMLElement | null>(null)
const { show3D } = useSectionScene(sectionRef)

// Reference BookCarousel explicitly so noUnusedLocals is satisfied.
// (vue-tsc sometimes fails to detect template-only usage inside TresCanvas.)
void BookCarousel

const hoveredBookId = ref<string | null>(null)
</script>

<template>
  <section
    id="bookshelf"
    ref="sectionRef"
  >
    <div class="container">
      <p class="section-eyebrow">
        Bookshelf
      </p>
      <h2 class="section-title">
        Books I've read
      </h2>
      <p class="section-intro">
        A shelf of the books that shaped how I think and build. Click one to view it on Amazon.
      </p>

      <div
        v-if="show3D"
        class="bookshelf__scene"
        :class="{ 'bookshelf__scene--hovering': hoveredBookId }"
        aria-hidden="true"
      >
        <TresCanvas
          alpha
          :clear-alpha="0"
          :tone-mapping="NoToneMapping"
        >
          <TresPerspectiveCamera
            :position="[0, 0.55, 2.65]"
            :fov="42"
            :look-at="[0, 0.02, 0]"
          />
          <TresAmbientLight :intensity="0.9" />
          <TresDirectionalLight
            :position="[-3, 5, 4]"
            :intensity="1.0"
          />
          <TresDirectionalLight
            :position="[3, 2, -1]"
            :intensity="0.35"
            color="#7c3aed"
          />
          <BookCarousel
            :books="books"
            @hover="hoveredBookId = $event"
          />
        </TresCanvas>
      </div>

      <!-- Non-3D path: the full book list as real links. Visible fallback on
           phones/no-WebGL; visually hidden (but focusable) next to the 3D
           carousel on desktop. -->
      <ul
        class="bookshelf__list"
        :class="{ 'bookshelf__list--sr-only': show3D }"
      >
        <li
          v-for="book in books"
          :key="book.id"
        >
          <a
            class="bookshelf__book"
            :href="book.amazonUrl"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`View ${book.title} by ${book.author} on Amazon`"
          >
            <span
              class="bookshelf__book-swatch"
              :style="{ background: book.coverColor }"
              aria-hidden="true"
            />
            <span class="bookshelf__book-text">
              <span class="bookshelf__book-title">{{ book.title }}</span>
              <span class="bookshelf__book-author">{{ book.author }}</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.bookshelf__scene {
  height: 460px;
  margin-top: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(ellipse at 50% 45%, rgba(124, 58, 237, 0.08), transparent 70%),
    var(--color-surface);
  overflow: hidden;
}

.bookshelf__scene--hovering {
  cursor: pointer;
}

.bookshelf__list {
  list-style: none;
  margin: 32px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

/* Desktop with the 3D carousel mounted: keep the list in the accessibility
   tree (and tab order) but out of the visual layout. Standard visually-hidden
   recipe rather than display:none, which would remove it for everyone. */
.bookshelf__list--sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.bookshelf__book {
  display: flex;
  align-items: center;
  gap: 12px;
  /* 44px+ touch target on phones (see mobile-experience spec). */
  min-height: 56px;
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  text-decoration: none;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.bookshelf__book:hover,
.bookshelf__book:focus-visible {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: 0 10px 22px rgba(124, 58, 237, 0.22);
}

.bookshelf__book-swatch {
  flex: 0 0 14px;
  height: 34px;
  border-radius: 3px;
}

.bookshelf__book-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.bookshelf__book-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--color-text);
}

.bookshelf__book-author {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
