<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'

import cpuCoolerUrl from '../assets/models/CPU_Cooler.glb'
import graphicsCardUrl from '../assets/models/Graphics_Card.glb'
import motherboardUrl from '../assets/models/Motherboard.glb'
import rgbFanUrl from '../assets/models/RGB_Fan.glb'

// 3D model of Branden's PC: real GLB models for the cooler, GPU, motherboard
// and case fans (see src/assets/models/), everything else still a Three
// primitive proxy pending real models. Each interactive mesh carries a
// partId matching an entry in data/device.ts, so the highlight/hover/click
// wiring below treats loaded and procedural meshes identically once a
// loaded model's mesh has been unpacked into a PartMeshDef (see loadPartModel).

const props = defineProps<{
  // The currently highlighted part (hovered in the specs list or in the 3D
  // scene itself); its meshes get an emissive glow. Auto-rotation pauses
  // while a part is active so the highlight can actually be inspected.
  activeId: string | null
}>()

const emit = defineEmits<{
  // Pointer entered/left a part mesh. null on leave.
  hover: [partId: string | null]
  // A part mesh was clicked.
  select: [partId: string]
}>()

// ── proxy meshes ──────────────────────────────────────────────────────────
// One entry per mesh; a part may span several meshes (e.g. two RAM sticks,
// or the two loaded case fans).
interface PartMeshDef {
  partId: string
  geometry: THREE.BufferGeometry
  material: THREE.MeshStandardMaterial
  position: [number, number, number]
  rotation?: [number, number, number]
  // 'none' excludes a mesh from pointer raycasting (@pmndrs/pointer-events).
  // Used by the glass case: it encloses every internal part, so as the
  // nearest ray hit it would otherwise swallow all hover/click interaction
  // meant for the components behind it.
  pointerEvents?: 'none'
  // Stable handler references, created once when partMeshes is built.
  // Inline template handlers get a new function identity on every re-render,
  // and Tres' patchProp adds a listener per identity without removing the
  // old one - with the per-frame rotation re-render that stacks listeners
  // fast (one click would toggle the pin dozens of times). Stable references
  // are only patched once.
  onClick: () => void
  onEnter: () => void
}

type PartMeshInit = Omit<PartMeshDef, 'onClick' | 'onEnter'>

function standardMat(color: string, opts: { transparent?: boolean; opacity?: number } = {}) {
  const transparent = opts.transparent ?? false
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.25,
    transparent,
    opacity: opts.opacity ?? 1,
    // The glass case must not write depth, or it would occlude the internals
    // it is supposed to reveal (draw-order dependent artifacts).
    depthWrite: !transparent,
  })
}

// Case interior layout (Three.js Y-up, camera looks from +z in the section):
// motherboard stands against the left interior wall, GPU horizontal mid-case,
// PSU bottom-rear, cooler on the CPU, storage low on the front.
const partMeshInits: PartMeshInit[] = [
  {
    partId: 'case',
    geometry: new THREE.BoxGeometry(0.6, 1.2, 1.15),
    material: standardMat('#a78bfa', { transparent: true, opacity: 0.12 }),
    position: [0, 0, 0],
    pointerEvents: 'none',
  },
  {
    partId: 'cpu',
    geometry: new THREE.BoxGeometry(0.05, 0.15, 0.15),
    material: standardMat('#d9d9e0'),
    position: [-0.22, 0.26, -0.16],
  },
  // Two RAM sticks next to the CPU.
  {
    partId: 'ram',
    geometry: new THREE.BoxGeometry(0.05, 0.3, 0.025),
    material: standardMat('#7c3aed'),
    position: [-0.22, 0.24, 0.1],
  },
  {
    partId: 'ram',
    geometry: new THREE.BoxGeometry(0.05, 0.3, 0.025),
    material: standardMat('#7c3aed'),
    position: [-0.22, 0.24, 0.16],
  },
  {
    partId: 'storage',
    geometry: new THREE.BoxGeometry(0.1, 0.035, 0.22),
    material: standardMat('#556070'),
    position: [-0.19, -0.24, 0.3],
  },
  {
    partId: 'psu',
    geometry: new THREE.BoxGeometry(0.5, 0.2, 0.34),
    material: standardMat('#2e2e3a'),
    position: [0, -0.47, -0.35],
  },
]

const HIGHLIGHT = new THREE.Color('#7c3aed')

function withHighlight(material: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  material.emissive = HIGHLIGHT.clone()
  material.emissiveIntensity = 0
  return material
}

// partMeshes starts with the procedural parts so the scene isn't empty while
// the GLB models below are still loading, then gains the loaded parts once
// each resolves (see loadPartModel/onMounted) via a wholesale reassignment,
// which is enough to trigger the template's re-render.
// shallowRef, not ref: a deep ref would run Vue's UnwrapRef over the
// three.js material/geometry instances, and MeshStandardMaterial's
// self-referential WebGPU node fields don't survive that transform (see
// DeskScene.vue, which avoids the same trap for its loaded THREE.Group).
const partMeshes = shallowRef<PartMeshDef[]>(
  partMeshInits.map((init) => ({
    ...init,
    material: withHighlight(init.material),
    onClick: () => emit('select', init.partId),
    onEnter: () => emit('hover', init.partId),
  })),
)

// ── loaded GLB parts ────────────────────────────────────────────────────────
// The models are exported at real-world (Blender) scale, nowhere near the
// compact case's proxy units, and each has a single mesh not centered on its
// own origin. centerAndFit re-centers the geometry on its own bounding box
// and uniformly scales it so the given native axis (measured before any
// display-time `rotation`) matches targetSize, then the mesh is placed like
// any other part via `position`/`rotation`.
const gltfLoader = new GLTFLoader()

function loadGLTF(url: string) {
  return new Promise<THREE.Group>((resolve, reject) => {
    gltfLoader.load(url, (gltf) => resolve(gltf.scene), undefined, reject)
  })
}

function findFirstMesh(root: THREE.Object3D): THREE.Mesh {
  let found: THREE.Mesh | null = null
  root.traverse((obj) => {
    if (!found && (obj as THREE.Mesh).isMesh) found = obj as THREE.Mesh
  })
  if (!found) throw new Error('GLB scene has no mesh')
  return found
}

function centerAndFit(geometry: THREE.BufferGeometry, axis: 'x' | 'y' | 'z', targetSize: number) {
  geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  const center = new THREE.Vector3()
  box.getCenter(center)
  geometry.translate(-center.x, -center.y, -center.z)
  const size = new THREE.Vector3()
  box.getSize(size)
  const scale = targetSize / size[axis]
  geometry.scale(scale, scale, scale)
}

interface LoadedPartSpec {
  partId: string
  url: string
  // Native axis (pre-rotation) used to calibrate the uniform scale.
  fitAxis: 'x' | 'y' | 'z'
  fitSize: number
  position: [number, number, number]
  rotation?: [number, number, number]
}

// Bounding boxes measured from each source GLB (see gltf-transform inspect):
// CPU_Cooler ~1.38x1.90x1.05, Graphics_Card ~1.90x1.19x0.48,
// Motherboard ~1.63x1.90x0.35, RGB_Fan ~1.90x1.90x0.83 (X/Y/Z). Target sizes
// and positions below are fitted to the same case slots the box proxies
// used to occupy - unverified against a live render, so treat as a starting
// point for further adjustment once seen in the browser.
const LOADED_PARTS: LoadedPartSpec[] = [
  {
    // Tower cooler standing on the CPU; native Y (tallest) is already the
    // model's own "up" axis, so no rotation.
    partId: 'cooling',
    url: cpuCoolerUrl,
    fitAxis: 'y',
    fitSize: 0.25,
    position: [-0.22, 0.46, -0.16],
  },
  {
    // Card's long edge (native X) runs front-to-back in the case, so it's
    // rotated 90° around Y to point along world Z.
    partId: 'gpu',
    url: graphicsCardUrl,
    fitAxis: 'x',
    fitSize: 0.62,
    position: [-0.08, -0.06, 0.02],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    // Flat panel; native Y is its height, rotated 90° around Y so its native
    // Z (thickness) becomes the world-X thin edge standing against the left
    // interior wall, matching where the motherboard proxy sat.
    partId: 'motherboard',
    url: motherboardUrl,
    fitAxis: 'y',
    fitSize: 0.85,
    position: [-0.26, 0.05, -0.05],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    // Front intake fans - two instances of the same model, same slots the
    // decorative proxy cylinders used to occupy. Native face is already in
    // the X/Y plane (thickness along Z), matching the desired forward-facing
    // orientation, so no rotation.
    partId: 'case',
    url: rgbFanUrl,
    fitAxis: 'y',
    fitSize: 0.32,
    position: [0, 0.18, 0.53],
  },
  {
    partId: 'case',
    url: rgbFanUrl,
    fitAxis: 'y',
    fitSize: 0.32,
    position: [0, -0.2, 0.53],
  },
]

let cancelled = false

async function loadPartModel(spec: LoadedPartSpec): Promise<void> {
  const scene = await loadGLTF(spec.url)
  if (cancelled) return

  const mesh = findFirstMesh(scene)
  const geometry = mesh.geometry
  centerAndFit(geometry, spec.fitAxis, spec.fitSize)
  // Each source model has exactly one material (see gltf-transform inspect),
  // but Mesh.material is typed as Material | Material[]; narrow before the
  // cast the same way DeskScene.vue does.
  const rawMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
  const material = withHighlight(rawMaterial as THREE.MeshStandardMaterial)

  partMeshes.value = [
    ...partMeshes.value,
    {
      partId: spec.partId,
      geometry,
      material,
      position: spec.position,
      rotation: spec.rotation,
      onClick: () => emit('select', spec.partId),
      onEnter: () => emit('hover', spec.partId),
    },
  ]
}

onMounted(() => {
  for (const spec of LOADED_PARTS) {
    loadPartModel(spec).catch((err) => console.error(`Failed to load ${spec.url}`, err))
  }
})

// ── interaction ───────────────────────────────────────────────────────────
function onLeave() {
  emit('hover', null)
}

// ── per-frame: auto-rotate + highlight fade ───────────────────────────────
// Rotation is exposed as a reactive prop binding (same pattern as the camera
// lerp in Background3DScene.vue) rather than a template ref on the group,
// so the component never depends on Tres ref-unwrapping internals.
const rotationY = ref(Math.PI / 7)

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  if (!props.activeId) {
    rotationY.value = (rotationY.value + delta * 0.35) % (Math.PI * 2)
  }
  // Ease each part's glow toward its target so highlights fade in/out
  // instead of popping.
  for (const def of partMeshes.value) {
    const target = def.partId === props.activeId ? 0.6 : 0
    const current = def.material.emissiveIntensity
    def.material.emissiveIntensity = current + (target - current) * Math.min(1, delta * 12)
  }
})

// Every texture slot MeshStandardMaterial might carry, deduped so a texture
// reused across slots (common in glTF exports) is only disposed once.
function disposeMaterial(material: THREE.MeshStandardMaterial) {
  const maps = new Set(
    [material.map, material.emissiveMap, material.metalnessMap, material.roughnessMap, material.normalMap].filter(
      (m): m is THREE.Texture => !!m,
    ),
  )
  for (const map of maps) map.dispose()
  material.dispose()
}

onUnmounted(() => {
  cancelled = true
  for (const def of partMeshes.value) {
    def.geometry.dispose()
    disposeMaterial(def.material)
  }
})
</script>

<template>
  <TresGroup :rotation="[0, rotationY, 0]">
    <TresMesh
      v-for="(def, index) in partMeshes"
      :key="index"
      :geometry="def.geometry"
      :material="def.material"
      :position="def.position"
      :rotation="def.rotation ?? [0, 0, 0]"
      :pointer-events="def.pointerEvents"
      @click="def.onClick"
      @pointerenter="def.onEnter"
      @pointerleave="onLeave"
    />
  </TresGroup>
</template>
