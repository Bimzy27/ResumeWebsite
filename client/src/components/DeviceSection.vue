<script setup lang="ts">
import { ref, computed } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping } from 'three'
import { deviceParts } from '../data/device'
import { useSectionScene } from '../composables/useSectionScene'
import DeviceModel from './DeviceModel.vue'

// Device section: a 3D proxy of Branden's PC next to its spec sheet.
// Hovering a spec row highlights the matching part in the 3D model, and
// hovering/clicking a part in the model highlights its spec row. On phones
// (and without WebGL) the 3D canvas never mounts and the spec sheet stands
// alone - same "scene" cutoff as the hero desk scene, see style.css.

const sectionRef = ref<HTMLElement | null>(null)
const { show3D } = useSectionScene(sectionRef)

// Reference DeviceModel explicitly so noUnusedLocals is satisfied.
// (vue-tsc sometimes fails to detect template-only usage inside TresCanvas.)
void DeviceModel

// Hover is transient; clicking a 3D part (or a spec row) pins the highlight
// until something else is pinned or the same thing is clicked again.
const hoveredId = ref<string | null>(null)
const pinnedId = ref<string | null>(null)

const activeId = computed(() => hoveredId.value ?? pinnedId.value)

function togglePin(partId: string) {
  pinnedId.value = pinnedId.value === partId ? null : partId
}
</script>

<template>
  <section
    id="device"
    ref="sectionRef"
  >
    <div class="container">
      <p class="section-eyebrow">
        Device
      </p>
      <h2 class="section-title">
        The machine I build on
      </h2>
      <p class="section-intro">
        My daily driver for development and gaming. Hover or tap a spec to see the part light up
        in the build.
      </p>

      <div class="device">
        <div
          v-if="show3D"
          class="device__scene"
          :class="{ 'device__scene--hovering': hoveredId }"
          aria-hidden="true"
        >
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
              @hover="hoveredId = $event"
              @select="togglePin($event)"
            />
          </TresCanvas>
        </div>

        <ul class="device__specs">
          <li
            v-for="part in deviceParts"
            :key="part.id"
            class="device__spec"
            :class="{ 'device__spec--active': activeId === part.id }"
            @mouseenter="hoveredId = part.id"
            @mouseleave="hoveredId = null"
            @click="togglePin(part.id)"
          >
            <span class="device__spec-label">{{ part.label }}</span>
            <span class="device__spec-value">{{ part.spec }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.device {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 40px;
  align-items: center;
  margin-top: 32px;
}

.device__scene {
  height: 440px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(ellipse at 50% 40%, rgba(124, 58, 237, 0.08), transparent 70%),
    var(--color-surface);
  overflow: hidden;
}

.device__scene--hovering {
  cursor: pointer;
}

.device__specs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.device__spec {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.device__spec--active {
  border-color: var(--color-primary);
  box-shadow: 0 10px 22px rgba(124, 58, 237, 0.22);
  transform: translateX(4px);
}

.device__spec-label {
  flex: 0 0 110px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.device__spec-value {
  color: var(--color-text);
  font-size: 0.95rem;
}

/* scene cutoff, see breakpoints in style.css. Below 901px the canvas never
   mounts (useSectionScene gate) and the spec sheet takes the full width. */
@media (max-width: 900px) {
  .device {
    grid-template-columns: 1fr;
  }
}
</style>
