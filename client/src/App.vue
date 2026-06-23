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
    <ContactSection />
  </main>
  <AppFooter />
</template>
