import { test, expect } from '@playwright/test'

// Covers the `projects-showcase` capability spec.
test.describe('Projects showcase', () => {
  test('renders all project cards with their titles', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const cards = page.locator('#projects article.project-card')
    await expect(cards).toHaveCount(5)

    for (const title of [
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
    await expect(page.locator('#projects article.project-card')).toHaveCount(5)
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
      await expect(projects.locator('article.project-card')).toHaveCount(5)
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
})
