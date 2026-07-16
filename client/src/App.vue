<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import CursorTrail from './components/CursorTrail.vue'
import ScrollyStage from './components/ScrollyStage.vue'
import TechStackSection from './components/TechStackSection.vue'
import TimelineSection from './components/TimelineSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <CursorTrail />
  <AppHeader />
  <main>
    <ScrollyStage />
    <TechStackSection />
    <TimelineSection />
    <ProjectsSection />
    <!-- DeviceSection and BookshelfSection are intentionally not mounted:
         their content is incomplete and was released early by accident. The
         components stay in the tree; develop carries the in-progress work and
         a future release restores them here (with their AppHeader links and
         e2e coverage) once complete. -->
    <ContactSection />
  </main>
  <AppFooter />
</template>

