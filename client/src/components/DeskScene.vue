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
// Everything in `propsScene` EXCEPT the avatar's own body/armature should be
// invisible at progress 0 (hero close-up — only torso/head should show) and
// fade up to fully opaque by progress 1 (skills wide shot). Walk the loaded
// scene graph once, clone materials for anything outside the excluded names
// so they can be made transparent without affecting shared materials, and
// collect them for per-frame opacity updates.
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
