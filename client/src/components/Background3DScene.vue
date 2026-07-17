<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'

// Lightweight gate for the hero desk scene. All Three.js/TresJS code lives in
// HeroSceneCanvas.vue, loaded async only once the gates below pass - so the
// heavy 3D chunk stays off the critical rendering path and is never fetched
// on phones or WebGL-less browsers, where the canvas would not mount anyway.
const HeroSceneCanvas = defineAsyncComponent(() => import('./HeroSceneCanvas.vue'))

const props = defineProps<{ progress?: number }>()

const webglSupported = ref(false)

// Mirrors the CSS scene cutoff (see breakpoints in style.css). Without this
// gate the canvas would still mount inside its display:none box on phones,
// downloading the desk model and rendering to an invisible surface.
const wideEnough = ref(false)
let sceneQuery: MediaQueryList | null = null
const onSceneQueryChange = (e: MediaQueryListEvent) => {
  wideEnough.value = e.matches
}

onMounted(() => {
  const canvas = document.createElement('canvas')
  webglSupported.value = !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  sceneQuery = window.matchMedia('(min-width: 901px)')
  wideEnough.value = sceneQuery.matches
  sceneQuery.addEventListener('change', onSceneQueryChange)
})

onUnmounted(() => {
  sceneQuery?.removeEventListener('change', onSceneQueryChange)
})
</script>

<template>
  <div
    class="bg3d"
    aria-hidden="true"
  >
    <HeroSceneCanvas
      v-if="webglSupported && wideEnough"
      :progress="props.progress"
    />
  </div>
</template>

<style scoped>
.bg3d {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* scene cutoff, see breakpoints in style.css. Belt and braces with the
   wideEnough mount gate above. */
@media (max-width: 900px) {
  .bg3d {
    display: none;
  }
}
</style>
