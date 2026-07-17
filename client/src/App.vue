<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import CursorTrail from './components/CursorTrail.vue'
import ScrollyStage from './components/ScrollyStage.vue'
import TechStackSection from './components/TechStackSection.vue'
import TimelineSection from './components/TimelineSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import DeviceSection from './components/DeviceSection.vue'
import BookshelfSection from './components/BookshelfSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'
import { SHOW_DEVICE_BOOKSHELF } from './featureFlags'
</script>

<template>
  <CursorTrail />
  <AppHeader />
  <main>
    <ScrollyStage />
    <TechStackSection />
    <TimelineSection />
    <ProjectsSection />
    <div
      v-if="SHOW_DEVICE_BOOKSHELF"
      class="device-bookshelf"
    >
      <DeviceSection />
      <BookshelfSection />
    </div>
    <ContactSection />
  </main>
  <AppFooter />
</template>

<style scoped>
/* Device and Bookshelf share one horizontal row on desktop: device on the
   left, bookshelf on the right. Each section keeps its own .container, whose
   24px side padding doubles as the gutter between the columns. Default grid
   stretch equalises the column heights; BookshelfSection stretches its scene
   to fill the slack (see its styles). */
.device-bookshelf {
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

/* scene cutoff, see breakpoints in style.css. At and below 900px the
   section-scoped canvases never mount and the sections stack full-width,
   device first, exactly as before the row existed. */
@media (max-width: 900px) {
  .device-bookshelf {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
