import { test, expect } from '@playwright/test'

// Guards the Vercel Web Analytics integration: inject() in main.ts must add
// the SDK script tag on page load. The tag is asserted by its data attribute,
// not by a successful network load, so the test stays offline-safe.
test.describe('Web analytics', () => {
  test('injects the Vercel analytics SDK script on load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const sdkScript = page.locator('script[data-sdkn="@vercel/analytics"]')
    await expect(sdkScript).toHaveCount(1)
    await expect(sdkScript).toHaveAttribute('data-sdkv', /^\d+\.\d+\.\d+/)
  })
})
