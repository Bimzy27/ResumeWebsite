<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'

import pedestalUrl from '../assets/models/Pedestal.glb'

// The pedestal the book carousel stands on, split into its own component on
// purpose: BookCarousel re-renders every frame (its group's rotation is
// animated), and a <primitive> living in that template gets its `object`
// prop re-patched by Tres on every one of those renders, which tanks the
// frame rate badly enough to starve the main thread. Both props below are
// constants at the call site, so this child renders once and the parent's
// per-frame churn never reaches it.

const props = defineProps<{
  // Width the model is scaled to, matching the ring the books sit on.
  diameter: number
  // World Y its top face should meet (the books' bottom edge).
  topY: number
}>()

const model = shallowRef<THREE.Object3D | null>(null)
let cancelled = false

// The model carries its own Blender scale and an arbitrary origin, so it is
// measured after loading rather than fitted with hard-coded numbers: scaled
// to `diameter`, then centred on the ring's axis and dropped so its top face
// lands on `topY`. Measuring keeps this correct if it is re-exported at a
// different size or origin.
function fit(object: THREE.Object3D) {
  const bounds = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()
  bounds.getSize(size)
  object.scale.setScalar(props.diameter / size.x)

  const scaled = new THREE.Box3().setFromObject(object)
  const centre = new THREE.Vector3()
  scaled.getCenter(centre)
  object.position.x -= centre.x
  object.position.z -= centre.z
  object.position.y += props.topY - scaled.max.y
}

onMounted(() => {
  new GLTFLoader().load(
    pedestalUrl,
    (gltf) => {
      if (cancelled) return
      fit(gltf.scene)
      model.value = gltf.scene
    },
    undefined,
    (err) => console.error(`Failed to load ${pedestalUrl}`, err),
  )
})

// Textures are deduped so one reused across several slots (common in glTF
// exports) is only disposed once.
onUnmounted(() => {
  cancelled = true
  if (!model.value) return
  const textures = new Set<THREE.Texture>()
  model.value.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.geometry.dispose()
    for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      const std = mat as THREE.MeshStandardMaterial
      for (const map of [std.map, std.emissiveMap, std.metalnessMap, std.roughnessMap, std.normalMap]) {
        if (map) textures.add(map)
      }
      std.dispose()
    }
  })
  for (const texture of textures) texture.dispose()
})
</script>

<template>
  <primitive
    v-if="model"
    :object="model"
  />
</template>
