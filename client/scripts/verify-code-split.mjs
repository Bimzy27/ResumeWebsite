// One-off manual verification (not part of the e2e suite): drives the REAL
// production build served by `vite preview` and asserts the code-split
// behaviour end to end:
//   1. Desktop: the lazy three/tresjs chunk is fetched and the hero canvas,
//      device canvas, and bookshelf canvas all mount.
//   2. Mobile viewport: the lazy chunk is never fetched and no canvas mounts.
// Run with: node scripts/verify-code-split.mjs (expects preview on :4173)
import { chromium } from '@playwright/test'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:4173'

function trackChunks(page, requests) {
  page.on('request', (req) => {
    const url = req.url()
    if (url.endsWith('.js')) requests.push(url.split('/').pop())
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
  await page.locator('#device').scrollIntoViewIfNeeded()
  await page.waitForSelector('#device canvas', { timeout: 20000 })
  await page.waitForSelector('#bookshelf canvas', { timeout: 20000 })
  const tres = js.filter((n) => n.startsWith('tres-'))
  const hero = js.filter((n) => n.startsWith('HeroSceneCanvas-'))
  console.log('desktop JS chunks fetched:', [...new Set(js)].join(', '))
  if (tres.length === 0 || hero.length === 0) {
    console.error('FAIL: desktop did not fetch the lazy 3D chunks')
    failed = true
  } else {
    console.log('PASS: desktop mounted all 3 canvases via lazy chunks')
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
  const lazy = js.filter(
    (n) => n.startsWith('tres-') || n.includes('SceneCanvas-'),
  )
  console.log('mobile JS chunks fetched:', [...new Set(js)].join(', '))
  if (canvases !== 0 || lazy.length !== 0) {
    console.error(`FAIL: mobile mounted ${canvases} scene canvases, lazy chunks: ${lazy.join(', ')}`)
    failed = true
  } else {
    console.log('PASS: mobile fetched no 3D chunks and mounted no scene canvas')
  }
  await page.close()
}

await browser.close()
process.exit(failed ? 1 : 0)
