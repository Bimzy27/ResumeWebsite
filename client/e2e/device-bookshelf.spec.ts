import { test, expect } from '@playwright/test'

// Covers the `device-section` and `bookshelf-section` capability specs.
// Desktop project only (the mobile fallback behaviour is asserted in
// mobile.spec.ts under the mobile-chromium project).

test.describe('Device section', () => {
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
    await page.goto('/#device', { waitUntil: 'networkidle' })

    // The section-scoped 3D canvas mounts once the section is in view.
    await expect(page.locator('#device canvas')).toHaveCount(1)

    // Hovering a spec row marks it active (the same state drives the 3D
    // part's emissive highlight).
    const cpuRow = page.locator('.device__spec').filter({ hasText: 'CPU' }).first()
    await cpuRow.hover()
    await expect(cpuRow).toHaveClass(/device__spec--active/)
  })
})

test.describe('Device and bookshelf row', () => {
  test('the sections sit side by side on desktop: device left, bookshelf right', async ({ page }) => {
    await page.goto('/#device', { waitUntil: 'domcontentloaded' })

    const deviceBox = await page.locator('#device').boundingBox()
    const bookshelfBox = await page.locator('#bookshelf').boundingBox()
    expect(deviceBox).not.toBeNull()
    expect(bookshelfBox).not.toBeNull()

    // Same horizontal row: the tops line up (grid row) and the device column
    // ends where the bookshelf column starts, with no vertical stacking.
    expect(Math.abs(deviceBox!.y - bookshelfBox!.y)).toBeLessThanOrEqual(1)
    expect(deviceBox!.x + deviceBox!.width).toBeLessThanOrEqual(bookshelfBox!.x + 1)
  })
})

test.describe('Bookshelf section', () => {
  test('renders after the device section in the DOM with the 3D carousel', async ({ page }) => {
    await page.goto('/#bookshelf', { waitUntil: 'networkidle' })

    const bookshelf = page.locator('#bookshelf')
    await expect(bookshelf).toBeAttached()

    const order = await page.evaluate(() => {
      const device = document.querySelector('#device')!
      const bookshelf = document.querySelector('#bookshelf')!
      return device.compareDocumentPosition(bookshelf) & Node.DOCUMENT_POSITION_FOLLOWING
    })
    expect(order, '#bookshelf follows #device in the DOM').toBeTruthy()

    await expect(bookshelf.locator('canvas')).toHaveCount(1)
  })

  test('every book is reachable as an Amazon link opening in a new tab', async ({ page }) => {
    await page.goto('/#bookshelf', { waitUntil: 'domcontentloaded' })

    // With the 3D carousel mounted the book list stays in the accessibility
    // tree (visually hidden) so books remain reachable without WebGL
    // pointer-picking; each entry is a real link to Amazon in a new tab.
    const links = page.locator('.bookshelf__list .bookshelf__book')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(5)

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      // Direct product page (/dp/<ASIN>) carrying the Associates tag so
      // clicks earn referral commission.
      await expect(link).toHaveAttribute(
        'href',
        /^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}\?tag=brandenimmerz-20$/i,
      )
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
  })
})
