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
})
