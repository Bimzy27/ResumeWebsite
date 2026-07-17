<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping } from 'three'
import DeviceModel from './DeviceModel.vue'

// The heavy half of the device section: TresCanvas, lights, camera, and the
// PC model. Split out of DeviceSection.vue so that everything touching
// three/@tresjs/core lives in a lazily loaded chunk - DeviceSection only
// async-imports this component once its useSectionScene gates pass.

defineProps<{
  // The currently highlighted part; forwarded to DeviceModel.
  activeId: string | null
}>()

const emit = defineEmits<{
  // Pointer entered/left a part mesh. null on leave.
  hover: [partId: string | null]
  // A part mesh was clicked.
  select: [partId: string]
}>()

// Reference DeviceModel explicitly so noUnusedLocals is satisfied.
// (vue-tsc sometimes fails to detect template-only usage inside TresCanvas.)
void DeviceModel
</script>

<template>
  <TresCanvas
    alpha
    :clear-alpha="0"
    :tone-mapping="NoToneMapping"
  >
    <TresPerspectiveCamera
      :position="[1.55, 0.85, 2.1]"
      :fov="40"
      :look-at="[0, 0, 0]"
    />
    <TresAmbientLight :intensity="0.85" />
    <TresDirectionalLight
      :position="[-3, 5, 4]"
      :intensity="1.1"
    />
    <TresDirectionalLight
      :position="[3, 2, -1]"
      :intensity="0.35"
      color="#7c3aed"
    />
    <DeviceModel
      :active-id="activeId"
      @hover="emit('hover', $event)"
      @select="emit('select', $event)"
    />
  </TresCanvas>
</template>
