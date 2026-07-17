import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from '@tresjs/core'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(templateCompilerOptions)],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    // The entry chunk stays small (~120 kB): the 3D scenes are code-split
    // behind async components (see *SceneCanvas.vue) so Three.js/TresJS load
    // lazily, and never on phones. The one chunk over Vite's default 500 kB
    // limit is that lazy three/tresjs chunk (~840 kB minified, ~225 kB gzip),
    // which is dominated by the single `three` module and cannot be split
    // further. Raise the limit just above it so the warning stays meaningful:
    // it will still fire if a heavy dependency sneaks back into the entry
    // chunk or the 3D chunk grows materially.
    chunkSizeWarningLimit: 900,
  },
})
