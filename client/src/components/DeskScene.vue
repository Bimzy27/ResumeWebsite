<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as THREE from 'three'

import sceneUrl    from '../assets/models/DeskScene.glb'
import headUrl     from '../assets/models/AvatarHead.glb'

// ── scene objects (null until loaded) ─────────────────────────────────────────
// `propsScene` is a single GLB exported directly from AvatarRigged.blend
// (desk, chair, monitor, keyboard+mouse, mug, notepad, plant, and the avatar
// body) — every object keeps the position/rotation/scale it has in Blender,
// so none of it needs to be re-specified here. Only the head is loaded
// separately, since it needs its own pivot group for cursor-tracking.
const props = defineProps<{ progress?: number }>()

const propsScene    = shallowRef<THREE.Group | null>(null)
const headPivot     = shallowRef<THREE.Group | null>(null)  // wraps the head, pivoting at the neck

// ── props fade (desk/chair/monitor/etc hidden at close-up, revealed on scroll) ──
// Everything in `propsScene` EXCEPT the avatar's own body/armature/head should
// be invisible at progress 0 (hero close-up — only torso/head should show)
// and fade up to fully opaque by progress 1 (skills wide shot). Walk the
// loaded scene graph once, clone materials for anything outside the excluded
// names so they can be made transparent without affecting shared materials,
// and collect them for per-frame opacity updates.
// 'Body' gets its own gradient treatment below (setupBodyFade) instead of
// this uniform on/off fade, so it's excluded here too.
const FADE_EXCLUDE = new Set(['Armature', 'Body', 'Head', 'Sun', 'InspectCam'])

function isExcludedFromFade(obj: THREE.Object3D): boolean {
  let cur: THREE.Object3D | null = obj
  while (cur) {
    if (FADE_EXCLUDE.has(cur.name)) return true
    cur = cur.parent
  }
  return false
}

const fadeMaterials: THREE.Material[] = []

function setupPropsFade(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh || isExcludedFromFade(mesh)) return

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const cloned = mats.map((m) => {
      const c = m.clone()
      c.transparent = true
      return c
    })
    mesh.material = cloned.length === 1 ? cloned[0] : cloned
    fadeMaterials.push(...cloned)
  })
}

// ── body gradient fade (torso fades out just below the shoulders at close-up,
//    fully visible by the wide shot) ──────────────────────────────────────────
// Unlike the props above, the torso shouldn't blink fully transparent — the
// head/shoulders need to stay solid in the close-up while everything below
// softly fades away. Boundaries pinpointed by raycasting the actual CLOSEUP
// camera (from Background3DScene.vue) against the rigged Body mesh in
// Blender, at the exact screen rows the user marked: fully transparent
// at/below the line on the chest (y=0.573). The opaque boundary was
// originally the collar line itself (y=0.743), but that made the transition
// too narrow/abrupt — raised it to y=0.86 so the gradient runs over a longer
// stretch and reads as a soft fade instead of a visible edge.
const BODY_FADE_START_Y = 0.86  // at/above this, fully opaque even at progress 0
const BODY_FADE_END_Y = 0.573   // at/below this, fully transparent at progress 0
const bodyShaders: { uniforms: { uProgress: { value: number } } }[] = []

function setupBodyFade(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh || mesh.name !== 'Body') return

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const m of mats) {
      const mat = m as THREE.MeshStandardMaterial
      mat.transparent = true
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uProgress = { value: 0 }
        shader.uniforms.uFadeStartY = { value: BODY_FADE_START_Y }
        shader.uniforms.uFadeEndY = { value: BODY_FADE_END_Y }

        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nvarying float vWorldY;')
          .replace(
            '#include <skinning_vertex>',
            '#include <skinning_vertex>\n  vWorldY = (modelMatrix * vec4(transformed, 1.0)).y;',
          )

        shader.fragmentShader = shader.fragmentShader
          .replace(
            '#include <common>',
            '#include <common>\nvarying float vWorldY;\nuniform float uProgress;\nuniform float uFadeStartY;\nuniform float uFadeEndY;',
          )
          .replace(
            '#include <dithering_fragment>',
            `#include <dithering_fragment>
  float gradAlpha = smoothstep(uFadeEndY, uFadeStartY, vWorldY);
  gl_FragColor.a *= mix(gradAlpha, 1.0, uProgress);`,
          )

        bodyShaders.push(shader as unknown as { uniforms: { uProgress: { value: number } } })
      }
      // onBeforeCompile only re-runs if the program cache key changes; this
      // material is unique to the Body mesh so a stable custom key is fine.
      mat.customProgramCacheKey = () => 'body-gradient-fade'
    }
  })
}

// ── head rotation pivot ────────────────────────────────────────────────────
// The head is now a standalone mesh (no rig). The head GLB already carries
// its correct absolute position baked into its root node (from its placement
// in the Blender scene). To rotate it toward the cursor without it swinging
// from that baked origin, it's nested under a Group anchored at the base of
// the skull (the neck joint, measured in Blender). The mesh's local offset
// inside that group must exactly CANCEL the pivot's translation — i.e. it's
// the negative of the pivot point — so the baked position is the only thing
// left contributing to the final world position (nothing shifts at rest).
const HEAD_PIVOT  = new THREE.Vector3(-0.0393, 0.8872, -0.7947)
const HEAD_OFFSET = HEAD_PIVOT.clone().negate()

// ── cursor state ──────────────────────────────────────────────────────────────
const cursor     = { x: 0, y: 0 }
const headTarget  = { x: 0, y: 0 }
const headCurrent = { x: 0, y: 0 }

function onMouseMove(e: MouseEvent) {
  cursor.x = (e.clientX / window.innerWidth)  * 2 - 1
  cursor.y = (e.clientY / window.innerHeight) * 2 - 1
}

// ── loader helper ─────────────────────────────────────────────────────────────
// DeskScene.glb is Draco-compressed (geometry) to keep it under GitHub's
// 100MB file limit, so the GLTFLoader needs a DRACOLoader pointed at the
// decoder files (self-hosted under public/draco/, copied from
// three/examples/jsm/libs/draco/gltf/ — no external CDN dependency).
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

function loadGLTF(url: string) {
  return new Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }>(
    (resolve, reject) => gltfLoader.load(url, resolve as any, undefined, reject),
  )
}

// ── load everything on mount ──────────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener('mousemove', onMouseMove)

  const [sc, hd] = await Promise.all([
    loadGLTF(sceneUrl),
    loadGLTF(headUrl),
  ])

  // Wrap the head mesh in a pivot group anchored at the neck joint.
  hd.scene.position.copy(HEAD_OFFSET)
  const pivot = new THREE.Group()
  pivot.position.copy(HEAD_PIVOT)
  pivot.add(hd.scene)

  setupPropsFade(sc.scene)
  setupBodyFade(sc.scene)

  // Assign to reactive refs so the template renders them
  propsScene.value = sc.scene
  headPivot.value  = pivot
})

onUnmounted(() => window.removeEventListener('mousemove', onMouseMove))

// ── per-frame loop ────────────────────────────────────────────────────────────
const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  // Head tracking — smooth lerp toward cursor-derived target
  if (headPivot.value) {
    headTarget.y =  cursor.x *  0.30   // yaw  ± ~17°
    headTarget.x =  cursor.y *  0.18   // pitch ± ~10°  (cursor up = head looks up)

    const s = 1 - Math.pow(0.05, delta)
    headCurrent.x += (headTarget.x - headCurrent.x) * s
    headCurrent.y += (headTarget.y - headCurrent.y) * s

    headPivot.value.rotation.x = headCurrent.x
    headPivot.value.rotation.y = headCurrent.y
  }

  // Props fade — invisible at the hero close-up, fully revealed by the time
  // the camera reaches the skills wide shot. Driven by the same eased scroll
  // progress as the camera lerp in Background3DScene.vue, so the reveal and
  // the zoom-out read as one continuous motion.
  const t = Math.min(1, Math.max(0, props.progress ?? 0))
  for (const mat of fadeMaterials) {
    ;(mat as THREE.Material & { opacity: number }).opacity = t
  }
  for (const shader of bodyShaders) {
    shader.uniforms.uProgress.value = t
  }
})
</script>

<template>
  <!--
    Scene layout (Three.js Y-up), matched to the reference illustration:
    avatar seated left, monitor right with its back to the camera, notepad +
    mug front-centre, plant on the desk's far-right corner.

    Desk, chair, monitor, keyboard+mouse, mug, notepad, plant, and the avatar
    body all come from one GLB exported directly from AvatarRigged.blend, so
    their relative position/rotation/scale need no re-authoring here — moving
    something in Blender and re-exporting is enough to update the layout.
  -->

  <!-- Desk, chair, monitor, keyboard, mug, notepad, plant, body -->
  <primitive v-if="propsScene"    :object="propsScene" />

  <!-- Avatar head: standalone mesh, no rig — wrapped in a pivot Group (see
       script) so it can rotate toward the cursor from the neck joint. -->
  <primitive v-if="headPivot"     :object="headPivot" />
</template>
