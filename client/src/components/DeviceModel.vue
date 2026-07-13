<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'

// Proxy 3D model of Branden's PC, built from Three primitives.
// PLACEHOLDER GEOMETRY: Branden will provide a real GLB of his PC in a
// follow-up task; this proxy keeps the section's layout, interactions, and
// part-highlighting working until then. Each interactive mesh carries a
// partId matching an entry in data/device.ts, so swapping the proxy for the
// real model only requires naming the model's meshes with the same ids.

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
// One entry per mesh; a part may span several meshes (e.g. two RAM sticks).
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
// PSU bottom-rear, AIO radiator along the top, storage low on the front.
const partMeshInits: PartMeshInit[] = [
  {
    partId: 'case',
    geometry: new THREE.BoxGeometry(0.6, 1.2, 1.15),
    material: standardMat('#a78bfa', { transparent: true, opacity: 0.12 }),
    position: [0, 0, 0],
    pointerEvents: 'none',
  },
  // Front intake fans - decorative, but they belong to the case part.
  {
    partId: 'case',
    geometry: new THREE.CylinderGeometry(0.16, 0.16, 0.05, 24),
    material: standardMat('#494957'),
    position: [0, 0.18, 0.53],
    rotation: [Math.PI / 2, 0, 0],
  },
  {
    partId: 'case',
    geometry: new THREE.CylinderGeometry(0.16, 0.16, 0.05, 24),
    material: standardMat('#494957'),
    position: [0, -0.2, 0.53],
    rotation: [Math.PI / 2, 0, 0],
  },
  {
    partId: 'motherboard',
    geometry: new THREE.BoxGeometry(0.03, 0.85, 0.8),
    material: standardMat('#31435c'),
    position: [-0.26, 0.05, -0.05],
  },
  // CPU block (IHS) mounted on the motherboard - highlighted as the CPU part.
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
    partId: 'gpu',
    geometry: new THREE.BoxGeometry(0.24, 0.14, 0.62),
    material: standardMat('#4a4a63'),
    position: [-0.08, -0.06, 0.02],
  },
  {
    partId: 'storage',
    geometry: new THREE.BoxGeometry(0.1, 0.035, 0.22),
    material: standardMat('#556070'),
    position: [-0.19, -0.24, 0.3],
  },
  {
    partId: 'cooling',
    geometry: new THREE.BoxGeometry(0.42, 0.06, 0.9),
    material: standardMat('#40404e'),
    position: [-0.02, 0.53, -0.05],
  },
  {
    partId: 'psu',
    geometry: new THREE.BoxGeometry(0.5, 0.2, 0.34),
    material: standardMat('#2e2e3a'),
    position: [0, -0.47, -0.35],
  },
]

const HIGHLIGHT = new THREE.Color('#7c3aed')
const partMeshes: PartMeshDef[] = partMeshInits.map((init) => {
  init.material.emissive = HIGHLIGHT.clone()
  init.material.emissiveIntensity = 0
  return {
    ...init,
    onClick: () => emit('select', init.partId),
    onEnter: () => emit('hover', init.partId),
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
  for (const def of partMeshes) {
    const target = def.partId === props.activeId ? 0.6 : 0
    const current = def.material.emissiveIntensity
    def.material.emissiveIntensity = current + (target - current) * Math.min(1, delta * 12)
  }
})

onUnmounted(() => {
  for (const def of partMeshes) {
    def.geometry.dispose()
    def.material.dispose()
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
