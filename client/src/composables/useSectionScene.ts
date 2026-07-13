import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

// Gate for the section-scoped 3D scenes (Device, Bookshelf). A section's
// TresCanvas only mounts when ALL of these hold:
//
//   1. WebGL is available (same probe as Background3DScene.vue).
//   2. The viewport is wide enough for 3D (min-width: 901px - the shared
//      "scene" cutoff, see breakpoints in style.css). Below that the section
//      renders its non-3D fallback instead, mirroring how the desk scene is
//      disabled on phones.
//   3. The section has scrolled near the viewport at least once
//      (IntersectionObserver). This keeps the extra WebGL contexts from being
//      created for content the visitor may never reach. Once seen it LATCHES
//      on rather than unmounting when scrolled past - tearing WebGL contexts
//      down and recreating them on every scroll-by is more expensive than
//      keeping an idle context alive.
export function useSectionScene(target: Ref<HTMLElement | null>) {
  const webglSupported = ref(false)
  const wideEnough = ref(false)
  const seen = ref(false)

  let sceneQuery: MediaQueryList | null = null
  let observer: IntersectionObserver | null = null

  const onSceneQueryChange = (e: MediaQueryListEvent) => {
    wideEnough.value = e.matches
  }

  onMounted(() => {
    const canvas = document.createElement('canvas')
    webglSupported.value = !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))

    sceneQuery = window.matchMedia('(min-width: 901px)')
    wideEnough.value = sceneQuery.matches
    sceneQuery.addEventListener('change', onSceneQueryChange)

    if (target.value) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            seen.value = true
            // Latched: no further notifications needed.
            observer?.disconnect()
            observer = null
          }
        },
        // Start loading a little before the section enters the viewport so
        // the scene is ready by the time it becomes visible.
        { rootMargin: '256px' },
      )
      observer.observe(target.value)
    } else {
      // No element to observe (should not happen); fail open so the scene
      // still renders rather than silently never mounting.
      seen.value = true
    }
  })

  onUnmounted(() => {
    sceneQuery?.removeEventListener('change', onSceneQueryChange)
    observer?.disconnect()
  })

  const show3D = computed(() => webglSupported.value && wideEnough.value && seen.value)

  return { show3D, wideEnough, webglSupported }
}
