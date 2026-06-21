<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping } from 'three'
import DeskScene from './DeskScene.vue'

const props = defineProps<{ progress?: number }>()

const webglSupported = ref(false)

onMounted(() => {
  const canvas = document.createElement('canvas')
  webglSupported.value = !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
})

// Reference DeskScene explicitly so noUnusedLocals is satisfied.
// (vue-tsc sometimes fails to detect template-only usage of async-loaded scenes.)
void DeskScene

// Scroll-driven camera: progress 0 = hero close-up (torso/head). progress 1 =
// skills wide shot (full desk). The avatar/desk stay weighted to the LEFT in
// both states — text content sits on the right for both Hero and Skills (see
// ScrollyStage.vue for how progress is computed from scroll).
const CLOSEUP = {
  pos: [0.0, 1.35, 2.28] as [number, number, number],
  lookAt: [0.65, 1.45, -0.75] as [number, number, number],
  fov: 26,
}
const WIDE = {
  pos: [-0.6, 0.85, 2.7] as [number, number, number],
  lookAt: [0.65, 0.55, -0.3] as [number, number, number],
  fov: 46,
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Smoothstep-ish easing so the transition isn't perfectly linear.
const eased = computed(() => {
  const t = Math.min(1, Math.max(0, props.progress ?? 0))
  return t * t * (3 - 2 * t)
})

const cameraPos = computed((): [number, number, number] => {
  const t = eased.value
  return [
    lerp(CLOSEUP.pos[0], WIDE.pos[0], t),
    lerp(CLOSEUP.pos[1], WIDE.pos[1], t),
    lerp(CLOSEUP.pos[2], WIDE.pos[2], t),
  ]
})

const cameraLookAt = computed((): [number, number, number] => {
  const t = eased.value
  return [
    lerp(CLOSEUP.lookAt[0], WIDE.lookAt[0], t),
    lerp(CLOSEUP.lookAt[1], WIDE.lookAt[1], t),
    lerp(CLOSEUP.lookAt[2], WIDE.lookAt[2], t),
  ]
})

const cameraFov = computed(() => lerp(CLOSEUP.fov, WIDE.fov, eased.value))
</script>

<template>
  <div class="bg3d" aria-hidden="true">
    <TresCanvas
      v-if="webglSupported"
      alpha
      :clear-alpha="0"
      :tone-mapping="NoToneMapping"
    >
      <TresPerspectiveCamera
        :position="cameraPos"
        :fov="cameraFov"
        :look-at="cameraLookAt"
      />

      <!-- TresCanvas defaults to ACESFilmicToneMapping. That filmic curve is
           what produced the orange tint on the beard/mustache: confirmed by
           reproducing it in Blender under the equivalent AgX view transform,
           then showing it vanishes under a plain Standard (linear-to-sRGB,
           no filmic curve) transform — same texture, same lights, only the
           tonemapping differed. The anti-aliased blend pixels between the
           dark beard color and skin tone sit at a hue/luminance combo that
           filmic curves push toward orange. Explicitly disabling tone
           mapping above removes the curve at the source. Light intensities
           kept modest since NoToneMapping won't compress highlights the way
           ACES did — tune to taste if anything looks blown out. -->
      <TresAmbientLight :intensity="0.8" />
      <TresDirectionalLight :position="[-3, 5, 4]"  :intensity="1.1" />
      <TresDirectionalLight :position="[3, 2, -1]" :intensity="0.3" color="#7c3aed" />
      <TresDirectionalLight :position="[0, 3, -4]"  :intensity="0.2" color="#a78bfa" />

      <DeskScene :progress="eased" />
    </TresCanvas>
  </div>
</template>

<style scoped>
.bg3d {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 900px) {
  .bg3d {
    display: none;
  }
}
</style>
