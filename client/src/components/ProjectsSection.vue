<script setup lang="ts">
import { useApiResource } from '../composables/useApi'
import { fallbackProjects } from '../data/fallback'
import type { Project } from '../types'
import ProjectCard from './ProjectCard.vue'

const { data: projects } = useApiResource<Project[]>('/projects', fallbackProjects)
</script>

<template>
  <section id="projects">
    <div class="container">
      <p class="section-eyebrow">Projects</p>
      <h2 class="section-title">Things I've built</h2>
      <p class="section-intro">
        A selection of projects — served straight from the ASP.NET Core API behind this site.
      </p>

      <div class="projects__grid">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 40px;
}
</style>
