// One-off manual verification (not part of the e2e suite): drives the REAL
// production build served by `vite preview` and asserts the code-split
// behaviour end to end:
//   1. Desktop: the lazy three/tresjs chunk is fetched and the hero canvas
//      mounts, along with the device/bookshelf canvases for whichever of those
//      sections the build renders (see src/featureFlags.ts).
//   2. Mobile viewport: the lazy chunk is never fetched and no canvas mounts.
// Run with: node scripts/verify-code-split.mjs (expects preview on :4173)
import { chromium } from '@playwright/test'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:4173'

// The heavy three/tresjs bundle is identified by SIZE, not by name. Its
// chunk name is an incidental Rollup output (it names the chunk after
// whichever module roots it), so adding a three addon to one more component
// has silently renamed it before - `tres-*.js` once became `GLTFLoader-*.js`,
// which would have let this script keep "passing" while checking nothing.
// Anything this large is the 3D bundle by definition; the entry chunk and
// the per-scene chunks are all well under it.
const HEAVY_CHUNK_BYTES = 300_000

function trackChunks(page, requests) {
  page.on('response', async (res) => {
    const url = res.url()
    if (!url.endsWith('.js')) return
    let size = 0
    try {
      size = (await res.body()).length
    } catch {
      // Body already discarded (redirect/abort); size stays 0, so it simply
      // won't count as heavy.
    }
    requests.push({ name: url.split('/').pop(), size })
  })
}

const browser = await chromium.launch()
let failed = false

// Desktop pass
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const js = []
  trackChunks(page, js)
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.bg3d canvas', { timeout: 20000 })
  // The device and bookshelf sections are individually hideable, so assert
  // only on the ones this build actually renders rather than hard-waiting on
  // a canvas that will never appear.
  const optionalSections = []
  for (const id of ['#device', '#bookshelf']) {
    if ((await page.locator(id).count()) > 0) optionalSections.push(id)
  }
  for (const id of optionalSections) {
    await page.locator(id).scrollIntoViewIfNeeded()
    await page.waitForSelector(`${id} canvas`, { timeout: 20000 })
  }
  const heavy = js.filter((c) => c.size >= HEAVY_CHUNK_BYTES)
  const hero = js.filter((c) => c.name.startsWith('HeroSceneCanvas-'))
  console.log('desktop JS chunks fetched:', [...new Set(js.map((c) => c.name))].join(', '))
  if (heavy.length === 0 || hero.length === 0) {
    console.error('FAIL: desktop did not fetch the lazy 3D chunks')
    failed = true
  } else {
    const total = 1 + optionalSections.length
    console.log(
      `PASS: desktop mounted all ${total} canvases via lazy chunks (3D bundle: ${heavy[0].name})`,
    )
  }
  await page.close()
}

// Mobile pass
{
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } })
  const js = []
  trackChunks(page, js)
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  // Scroll through the whole page so section observers fire, then settle.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(3000)
  // Count only scene canvases (same selectors as the e2e mobile spec) - the
  // CursorTrail 2D canvas is always present and is not part of the 3D split.
  const canvases = await page
    .locator('.bg3d canvas, #device canvas, #bookshelf canvas')
    .count()
  const lazy = js.filter((c) => c.size >= HEAVY_CHUNK_BYTES || c.name.includes('SceneCanvas-'))
  console.log('mobile JS chunks fetched:', [...new Set(js.map((c) => c.name))].join(', '))
  if (canvases !== 0 || lazy.length !== 0) {
    const detail = lazy.map((c) => `${c.name} (${Math.round(c.size / 1024)} kB)`).join(', ')
    console.error(`FAIL: mobile mounted ${canvases} scene canvases, lazy chunks: ${detail}`)
    failed = true
  } else {
    console.log('PASS: mobile fetched no 3D chunks and mounted no scene canvas')
  }
  await page.close()
}

await browser.close()
process.exit(failed ? 1 : 0)
