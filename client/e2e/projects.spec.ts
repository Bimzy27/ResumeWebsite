import { test, expect } from '@playwright/test'

// Covers the `projects-showcase` capability spec.
test.describe('Projects showcase', () => {
  test('renders all project cards with their titles', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const cards = page.locator('#projects article.project-card')
    await expect(cards).toHaveCount(6)

    for (const title of [
      'Agentic Project Tracker',
      'AI tool for test discovery and execution',
      'This Portfolio Website',
      'Slime Slayer',
      'BimzyDev YouTube Channel',
      'Runes of Time',
    ]) {
      await expect(page.locator('#projects').getByText(title, { exact: true })).toBeVisible()
    }
  })

  test('project actions link out to their targets', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const projects = page.locator('#projects')
    await expect(
      projects.getByRole('link', { name: 'Get it on Google Play' }),
    ).toHaveAttribute('href', /play\.google\.com/)
    await expect(projects.getByRole('link', { name: 'Play on itch.io' })).toHaveAttribute(
      'href',
      /itch\.io/,
    )
  })

  test('remains usable with reduced motion (native scroll fallback)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // With reduced motion the section is not pinned, but every card is still present.
    await expect(page.locator('#projects article.project-card')).toHaveCount(6)
  })

  // Regression: the pinned scroll-linked slide must work at every desktop
  // viewport height, including tall windows (it was once disabled above a
  // height threshold, which silently removed the effect).
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 1280, height: 1200 },
  ]) {
    test(`scrolling the page slides the cards when pinned (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto('/', { waitUntil: 'domcontentloaded' })

      const projects = page.locator('#projects')
      await expect(projects.locator('article.project-card')).toHaveCount(6)
      await expect(projects).toHaveClass(/projects--pinned/)

      // Scroll to the section top, then further down the page: the card track
      // must translate horizontally in step with the vertical scroll.
      const projTop = await projects.evaluate(
        (el) => el.getBoundingClientRect().top + window.scrollY,
      )
      await page.evaluate((y) => window.scrollTo(0, y + 300), projTop)

      // The track transform is applied by a scroll handler through
      // requestAnimationFrame, so under parallel-worker load it can lag the
      // scroll by several seconds. Match the 15s allowance the suite already
      // grants other heavy waits (e.g. 3D canvas mounts) instead of the 5s
      // poll default.
      await expect
        .poll(
          async () => {
            const transform = await page
              .locator('.projects__track')
              .evaluate((el) => getComputedStyle(el).transform)
            // matrix(1, 0, 0, 1, tx, ty) -> tx
            const tx = Number(transform.match(/matrix\([^)]*\)/)?.[0].split(',')[4] ?? 0)
            return tx
          },
          { timeout: 15_000 },
        )
        .toBeLessThan(-250)
    })
  }

  // Regression: while pinned, the rail's position is driven purely by the
  // track's transform. It used to be `overflow: hidden`, which still makes it a
  // scroll container the browser can scroll on its own (moving focus to an
  // off-screen card, restoring scroll on reload, resizing up from the native
  // row). Nothing ever undid that, so the rail stayed permanently offset and
  // the first cards became unreachable. It must always rest flush left.
  test('pinned rail stays flush left after focus moves to an off-screen card', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const projects = page.locator('#projects')
    const cards = projects.locator('article.project-card')
    await expect(cards).toHaveCount(6)
    await expect(projects).toHaveClass(/projects--pinned/)

    const viewport = page.locator('.projects__viewport')
    // Rects are read inside the page rather than via boundingBox(), which
    // scrolls the element into view and would itself move the pin.
    const railGeometry = () =>
      page.evaluate(() => {
        const rail = document.querySelector('.projects__viewport')!.getBoundingClientRect()
        const items = document.querySelectorAll('#projects article.project-card')
        const first = items[0].getBoundingClientRect()
        const last = items[items.length - 1].getBoundingClientRect()
        return {
          firstCardOffset: first.left - rail.left,
          lastCardFullyVisible: last.left >= rail.left - 1 && last.right <= rail.right + 1,
        }
      })

    // Focusing the last card must move the page, revealing the card, and must
    // never scroll the rail container itself.
    await cards.last().getByRole('link').first().focus()
    await expect
      .poll(async () => (await railGeometry()).lastCardFullyVisible, { timeout: 15_000 })
      .toBe(true)
    expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(0)

    // Back at the top of the section the rail is flush left again.
    const projTop = await projects.evaluate((el) => el.getBoundingClientRect().top + window.scrollY)
    await page.evaluate((y) => window.scrollTo(0, y), projTop)
    await expect
      .poll(async () => (await railGeometry()).firstCardOffset, { timeout: 15_000 })
      .toBeCloseTo(0, 0)
    expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(0)
  })
})
