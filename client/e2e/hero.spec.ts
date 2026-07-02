import { test, expect } from '@playwright/test'

// Covers the `hero-section` capability spec.
test.describe('Hero section', () => {
  test('introduces the owner with headline and summary', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const hero = page.locator('#top')
    await expect(hero.getByText('Senior Software Engineer').first()).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Branden Immerzeel')
    await expect(hero.locator('.hero__summary')).toContainText('Full-Stack Software Engineer')
  })

  test('primary calls to action link to experience and contact', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('link', { name: 'View my experience' })).toHaveAttribute(
      'href',
      '#experience',
    )
    await expect(page.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact')
  })

  test('shows a recommendations carousel that can advance', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const recs = page.locator('.recs')
    await expect(recs).toBeVisible()

    // It's a carousel: more than one selectable recommendation.
    expect(await recs.getByRole('tab').count()).toBeGreaterThan(1)

    // The active recommendation shows a quote and the recommender's name.
    await expect(recs.locator('.recs__quote')).toBeVisible()
    await expect(recs.locator('.recs__name')).toBeVisible()

    // Advancing to the next recommendation changes the displayed quote.
    const quote = recs.locator('.recs__quote')
    const before = await quote.textContent()
    await recs.getByRole('button', { name: 'Next recommendation' }).click()
    await expect(quote).not.toHaveText(before ?? '')
  })
})
