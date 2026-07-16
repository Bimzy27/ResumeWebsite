import { test, expect } from '@playwright/test'

// The device and bookshelf sections are intentionally hidden in production:
// their content is incomplete and was released early by accident (see
// App.vue). This spec guards the hidden state; the full `device-section` and
// `bookshelf-section` capability coverage returns with the sections.

test.describe('Device and bookshelf sections stay hidden', () => {
  test('neither section nor its nav link renders', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#device')).toHaveCount(0)
    await expect(page.locator('#bookshelf')).toHaveCount(0)

    const nav = page.locator('.header__nav')
    await expect(nav.getByRole('link', { name: 'Device' })).toHaveCount(0)
    await expect(nav.getByRole('link', { name: 'Bookshelf' })).toHaveCount(0)
  })
})
