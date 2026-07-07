import { test, expect, type Page } from '@playwright/test'

// Covers the `mobile-experience` capability spec. Runs only under the
// mobile-chromium project (Pixel 7 emulation at 360x740, see
// playwright.config.ts); the desktop project ignores this file.

// Scroll through the whole page so scroll-linked layouts settle and lazy
// content loads before measuring.
async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    const doc = document.documentElement
    for (let y = 0; y <= doc.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
  })
}

test.describe('Mobile experience', () => {
  test('page never scrolls horizontally at 360px', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // Sample overflow while scrolling, not just at the top: pinned and
    // animated sections can introduce overflow only mid-page.
    const overflows = await page.evaluate(async () => {
      const doc = document.documentElement
      const bad: number[] = []
      for (let y = 0; y <= doc.scrollHeight; y += window.innerHeight / 2) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
        if (doc.scrollWidth > doc.clientWidth) bad.push(y)
      }
      return bad
    })
    expect(overflows, `horizontal overflow at scroll offsets: ${overflows.join(', ')}`).toEqual([])
  })

  test('hero renders without the 3D scene but keeps its background glow', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // The 3D canvas must not even mount on phones (battery/data cost of an
    // invisible WebGL scene), while the CSS glow stays as the fallback.
    await expect(page.locator('.bg3d canvas')).toHaveCount(0)
    await expect(page.locator('.scrolly__glow')).toBeAttached()

    const heroName = page.locator('.hero__name')
    await expect(heroName).toBeVisible()
    // Hero content starts within the first viewport instead of leaving an
    // empty band where the desktop 3D layout budgeted its whitespace.
    const box = await heroName.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBeLessThan(400)
  })

  test('header shows all navigation links inside the viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const viewportWidth = page.viewportSize()!.width
    for (const label of ['About', 'Skills', 'Experience', 'Projects', 'Contact']) {
      const link = page.locator('.header__nav').getByRole('link', { name: label })
      await expect(link).toBeVisible()
      const box = await link.boundingBox()
      expect(box, label).not.toBeNull()
      expect(box!.x, `${label} starts inside the viewport`).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width, `${label} ends inside the viewport`).toBeLessThanOrEqual(viewportWidth)
    }
  })

  test('interactive elements meet the 44px touch target', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await scrollThroughPage(page)

    // The carousel dots are exempt: they are a secondary control with padded
    // (19px) hit areas, and the 44px prev/next arrows reach every slide
    // (WCAG 2.5.8 equivalent-target reasoning, see audit-findings.md F3).
    const undersized = await page.evaluate(() => {
      const bad: string[] = []
      for (const el of document.querySelectorAll<HTMLElement>(
        'a, button:not(.recs__dot), input, textarea',
      )) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        if (r.height < 43.5) {
          bad.push(`${el.tagName.toLowerCase()}.${el.className} "${(el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`)
        }
      }
      return bad
    })
    expect(undersized, `touch targets under 44px:\n${undersized.join('\n')}`).toEqual([])
  })

  test('timeline collapses to a single left-aligned column', async ({ page }) => {
    await page.goto('/#experience', { waitUntil: 'networkidle' })

    const line = page.locator('.timeline__line')
    await expect(line).toBeVisible()
    const lineBox = await line.boundingBox()
    expect(lineBox).not.toBeNull()
    // Line hugs the left edge (24px container padding plus the 9px offset).
    expect(lineBox!.x).toBeLessThan(48)

    // Every card sits entirely right of the line: one column, no alternating
    // desktop layout.
    const cards = page.locator('.timeline-item__card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const box = await cards.nth(i).boundingBox()
      expect(box, `card ${i}`).not.toBeNull()
      expect(box!.x, `card ${i} sits right of the timeline line`).toBeGreaterThan(lineBox!.x)
    }
  })

  test('projects track swipes internally and shows a peek of the next card', async ({ page }) => {
    await page.goto('/#projects', { waitUntil: 'networkidle' })

    const cards = page.locator('.projects__track > *')
    const count = await cards.count()
    expect(count).toBeGreaterThan(1)

    // The second card peeks into the viewport, signalling there are more
    // projects to swipe to.
    const viewportWidth = page.viewportSize()!.width
    const second = await cards.nth(1).boundingBox()
    expect(second).not.toBeNull()
    expect(second!.x, 'second card starts off-screen').toBeGreaterThan(viewportWidth - 60)
    expect(second!.x, 'second card peeks into view').toBeLessThan(viewportWidth)

    // Scrolling the track moves cards without any page-level horizontal
    // scroll.
    await page.locator('.projects__viewport').evaluate((el) => {
      el.scrollLeft = 300
    })
    await expect.poll(() => page.locator('.projects__viewport').evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
    expect(await page.evaluate(() => window.scrollX)).toBe(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })

  test('recommendations carousel shows one quote with tappable controls', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    await expect(page.locator('.recs__card')).toHaveCount(1)

    const next = page.locator('.recs__arrow--next')
    const box = await next.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThanOrEqual(43.5)
    expect(box!.height).toBeGreaterThanOrEqual(43.5)

    const firstAuthor = await page.locator('.recs__name').textContent()
    await next.click()
    await expect(page.locator('.recs__name')).not.toHaveText(firstAuthor ?? '')
  })

  test('anchor navigation lands sections below the sticky header', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    await page.locator('.header__nav').getByRole('link', { name: 'Contact' }).click()
    const eyebrow = page.locator('#contact .section-eyebrow')
    await expect(eyebrow).toBeVisible()
    const headerBottom = await page.locator('header.header').evaluate((el) => el.getBoundingClientRect().bottom)
    const box = await eyebrow.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y, 'section heading clears the sticky header').toBeGreaterThanOrEqual(headerBottom)
  })
})
