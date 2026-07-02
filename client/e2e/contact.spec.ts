import { test, expect } from '@playwright/test'

// Covers the `contact-section` capability spec.
test.describe('Contact section', () => {
  test('shows email as a mailto link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const email = page.locator('.contact__details').getByRole('link', {
      name: 'branden.immerzeel@gmail.com',
    })
    await expect(email).toHaveAttribute('href', 'mailto:branden.immerzeel@gmail.com')
  })

  test('shows a withheld phone as plain text with no dial link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const phoneItem = page.locator('.contact__details li', { hasText: 'Phone' })
    await expect(phoneItem).toContainText('Upon request')
    await expect(phoneItem.locator('a[href^="tel:"]')).toHaveCount(0)
  })

  test('social and professional links open in a new tab with noopener', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    for (const host of ['linkedin.com', 'github.com', 'leetcode.com', 'youtube.com']) {
      const link = page.locator(`.contact__social a[href*="${host}"]`).first()
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
  })

  test('resume link opens the PDF in a new tab', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const resume = page.locator('.resume-btn')
    await expect(resume).toHaveAttribute('href', '/Branden-Immerzeel-Resume.pdf')
    await expect(resume).toHaveAttribute('target', '_blank')
  })

  test('falls back to initials when the headshot fails to load', async ({ page }) => {
    // Force the headshot request to fail so the fallback path is exercised.
    await page.route('**/profile-photo.jpg', (route) => route.abort())
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const fallback = page.locator('.contact__avatar--fallback')
    await expect(fallback).toBeVisible()
    await expect(fallback).toHaveText('BI')
  })
})
