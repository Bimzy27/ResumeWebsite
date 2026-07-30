import { test, expect } from '@playwright/test'
import { SHOW_DEVICE, SHOW_BOOKSHELF } from '../src/featureFlags'

// Covers the `device-section` and `bookshelf-section` capability specs.
// Desktop project only (the mobile fallback behaviour is asserted in
// mobile.spec.ts under the mobile-chromium project).
//
// Each group is gated on its section's own hide flag: while a section does not
// render, its specs would fail on a missing #device/#bookshelf. The flags are
// independent, so the bookshelf keeps its coverage while the device is hidden.

test.describe('Device section', () => {
  test.skip(!SHOW_DEVICE, 'device section temporarily hidden (src/featureFlags.ts)')

  test('renders below the projects section with the full spec sheet', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const device = page.locator('#device')
    await expect(device).toBeAttached()

    // Sits underneath the projects section in the page flow.
    const order = await page.evaluate(() => {
      const projects = document.querySelector('#projects')!
      const device = document.querySelector('#device')!
      // DOCUMENT_POSITION_FOLLOWING (4): device comes after projects.
      return projects.compareDocumentPosition(device) & Node.DOCUMENT_POSITION_FOLLOWING
    })
    expect(order, '#device follows #projects in the DOM').toBeTruthy()

    // Every part of the build is listed with its spec.
    await device.scrollIntoViewIfNeeded()
    for (const label of ['CPU', 'GPU', 'Memory', 'Motherboard', 'Storage', 'Cooling', 'PSU', 'Case']) {
      await expect(device.locator('.device__spec-label', { hasText: label })).toBeVisible()
    }
  })

  test('mounts the 3D scene and highlights a part when its spec is hovered', async ({ page }) => {
    // 'networkidle' is unreliable here: under parallel workers the Vite dev
    // server keeps connections busy and goto times out. Wait on the actual
    // readiness signal (the mounted canvas) instead.
    await page.goto('/#device', { waitUntil: 'domcontentloaded' })
    await page.locator('#device').scrollIntoViewIfNeeded()

    // The section-scoped 3D canvas mounts once the section is in view.
    await expect(page.locator('#device canvas')).toHaveCount(1, { timeout: 15000 })

    // Hovering a spec row marks it active (the same state drives the 3D
    // part's emissive highlight).
    const cpuRow = page.locator('.device__spec-link').filter({ hasText: 'CPU' }).first()
    await cpuRow.hover()
    await expect(cpuRow).toHaveClass(/device__spec-link--active/)
  })

  test('clicking a spec link leaves nothing pinned', async ({ page }) => {
    await page.goto('/#device', { waitUntil: 'domcontentloaded' })
    await page.locator('#device').scrollIntoViewIfNeeded()

    // Regression: the rows are Amazon links, but clicking one also used to
    // pin that part. Pinning stops the model's rotation and holds the
    // highlight, so following a link left the build frozen and still lit up
    // when the visitor returned from the new tab.
    const row = page.locator('.device__spec-link').filter({ hasText: 'CPU' }).first()
    await row.evaluate((el) => {
      // A real click so the app's handlers run, minus the navigation - the
      // href points off-site and tests should not depend on the network.
      el.addEventListener('click', (event) => event.preventDefault(), { once: true })
      ;(el as HTMLElement).click()
    })

    // Move off the row so only a pin could still be holding it active.
    await page.mouse.move(0, 0)
    await expect(page.locator('.device__spec-link--active')).toHaveCount(0)
  })

  test('every part is reachable as an Amazon link opening in a new tab', async ({ page }) => {
    await page.goto('/#device', { waitUntil: 'domcontentloaded' })
    const device = page.locator('#device')
    await device.scrollIntoViewIfNeeded()

    // Search results link rather than a direct product page: parts don't
    // have a hand-verified ASIN the way the books do (see data/device.ts).
    const links = device.locator('.device__spec-link')
    await expect(links).toHaveCount(8)

    // One batched read rather than per-link auto-waiting assertions; see the
    // bookshelf equivalent below for why this page needs it.
    const attrs = await links.evaluateAll((nodes) =>
      nodes.map((n) => ({
        href: n.getAttribute('href'),
        target: n.getAttribute('target'),
        rel: n.getAttribute('rel'),
      })),
    )

    for (const [i, attr] of attrs.entries()) {
      expect(attr.href, `part ${i} href`).toMatch(
        /^https:\/\/www\.amazon\.com\/s\?k=.+&tag=brandenimmerz-20$/,
      )
      expect(attr.target, `part ${i} target`).toBe('_blank')
      expect(attr.rel, `part ${i} rel`).toMatch(/noopener/)
    }
  })

  test('places the spec sheet beside the 3D model on desktop', async ({ page }) => {
    await page.goto('/#device', { waitUntil: 'domcontentloaded' })
    await page.locator('#device').scrollIntoViewIfNeeded()
    await expect(page.locator('#device canvas')).toHaveCount(1, { timeout: 15000 })

    const sceneBox = await page.locator('.device__scene').boundingBox()
    const specsBox = await page.locator('.device__specs').boundingBox()
    expect(sceneBox).not.toBeNull()
    expect(specsBox).not.toBeNull()

    // Same row: tops line up and the scene column ends where the specs
    // column starts, with no vertical stacking between them.
    expect(Math.abs(sceneBox!.y - specsBox!.y)).toBeLessThanOrEqual(1)
    expect(sceneBox!.x + sceneBox!.width).toBeLessThanOrEqual(specsBox!.x + 1)
  })
})

test.describe('Device and bookshelf layout', () => {
  // Only meaningful when both sections are on the page.
  test.skip(
    !SHOW_DEVICE || !SHOW_BOOKSHELF,
    'needs both sections visible (src/featureFlags.ts)',
  )

  test('the sections stack vertically: device above bookshelf', async ({ page }) => {
    await page.goto('/#device', { waitUntil: 'domcontentloaded' })

    const deviceBox = await page.locator('#device').boundingBox()
    const bookshelfBox = await page.locator('#bookshelf').boundingBox()
    expect(deviceBox).not.toBeNull()
    expect(bookshelfBox).not.toBeNull()

    // Full-width stacked sections: bookshelf starts at or below where device
    // ends, not beside it, and both span the same width.
    expect(bookshelfBox!.y).toBeGreaterThanOrEqual(deviceBox!.y + deviceBox!.height - 1)
    expect(Math.round(deviceBox!.width)).toBe(Math.round(bookshelfBox!.width))
  })
})

test.describe('Bookshelf section', () => {
  test.skip(!SHOW_BOOKSHELF, 'bookshelf section temporarily hidden (src/featureFlags.ts)')

  test('renders after the preceding section in the DOM with the 3D carousel', async ({ page }) => {
    // See the device 3D test above for why this avoids 'networkidle'.
    await page.goto('/#bookshelf', { waitUntil: 'domcontentloaded' })

    const bookshelf = page.locator('#bookshelf')
    await expect(bookshelf).toBeAttached()
    await bookshelf.scrollIntoViewIfNeeded()

    // Follows the device section when it is shown, and the projects section
    // when it is not (see src/featureFlags.ts).
    const precedingId = SHOW_DEVICE ? '#device' : '#projects'
    const order = await page.evaluate((id) => {
      const preceding = document.querySelector(id)!
      const bookshelf = document.querySelector('#bookshelf')!
      return preceding.compareDocumentPosition(bookshelf) & Node.DOCUMENT_POSITION_FOLLOWING
    }, precedingId)
    expect(order, `#bookshelf follows ${precedingId} in the DOM`).toBeTruthy()

    await expect(bookshelf.locator('canvas')).toHaveCount(1, { timeout: 15000 })
  })

  test('every book is reachable as an Amazon link opening in a new tab', async ({ page }) => {
    await page.goto('/#bookshelf', { waitUntil: 'domcontentloaded' })

    // With the 3D carousel mounted the book list stays in the accessibility
    // tree (visually hidden) so books remain reachable without WebGL
    // pointer-picking; each entry is a real link to Amazon in a new tab.
    const links = page.locator('.bookshelf__list .bookshelf__book')
    await expect(links).toHaveCount(12)

    // Read every link in ONE round-trip instead of asserting per-link. The
    // 3D sections on this page keep the main thread busy while their models
    // load, and 36 individually auto-waiting assertions spent most of the
    // 30s budget queueing behind that work. The list is static (rendered
    // from bundled data) and the count above already waited for it, so a
    // single settled read checks exactly the same things without the churn.
    const attrs = await links.evaluateAll((nodes) =>
      nodes.map((n) => ({
        href: n.getAttribute('href'),
        target: n.getAttribute('target'),
        rel: n.getAttribute('rel'),
      })),
    )

    for (const [i, attr] of attrs.entries()) {
      // Direct product page (/dp/<ASIN>) carrying the Associates tag so
      // clicks earn referral commission. Amazon .com or .com.au (see
      // data/books.ts).
      expect(attr.href, `book ${i} href`).toMatch(
        /^https:\/\/www\.amazon\.com(\.au)?\/dp\/[A-Z0-9]{10}\?tag=brandenimmerz-20$/i,
      )
      expect(attr.target, `book ${i} target`).toBe('_blank')
      expect(attr.rel, `book ${i} rel`).toMatch(/noopener/)
    }
  })
})
