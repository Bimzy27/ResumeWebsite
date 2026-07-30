import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from '@tresjs/core'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(templateCompilerOptions)],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    // The entry chunk stays small (~130 kB): the 3D scenes are code-split
    // behind async components (see *SceneCanvas.vue) so Three.js/TresJS load
    // lazily, and never on phones. The one chunk over Vite's default 500 kB
    // limit is that lazy three/tresjs chunk (~880 kB minified, ~236 kB gzip),
    // which is dominated by the single `three` module and cannot be split
    // further. Raise the limit just above it so the warning stays meaningful:
    // it will still fire if a heavy dependency sneaks back into the entry
    // chunk or the 3D chunk grows materially.
    //
    // Deliberately NO manualChunks for three/tresjs: forcing it into a named
    // chunk makes it a static import of the entry, so phones download the
    // whole ~900 kB bundle they never render (verified with
    // scripts/verify-code-split.mjs). Letting Rollup derive the chunk from
    // the dynamic-import graph is what keeps it off the mobile critical
    // path, at the cost of an incidental chunk name - which is why that
    // script identifies the chunk by size rather than by name.
    chunkSizeWarningLimit: 900,
  },
})
