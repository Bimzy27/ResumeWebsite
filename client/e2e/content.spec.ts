import { test, expect } from '@playwright/test'
import { SHOW_DEVICE_BOOKSHELF } from '../src/featureFlags'

// Covers the `content-architecture` capability spec: the deployed site renders
// entirely from bundled data with no backend.
test.describe('Content architecture', () => {
  test('all main sections render from bundled data', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const sectionIds = ['#top', '#skills', '#experience', '#projects', '#contact']
    if (SHOW_DEVICE_BOOKSHELF) sectionIds.splice(4, 0, '#device', '#bookshelf')
    for (const id of sectionIds) {
      await expect(page.locator(id)).toBeVisible()
    }

    if (!SHOW_DEVICE_BOOKSHELF) {
      // The hidden sections must not render at all, not just be off-screen.
      await expect(page.locator('#device')).toHaveCount(0)
      await expect(page.locator('#bookshelf')).toHaveCount(0)
    }

    // Experience timeline renders the bundled entries.
    await expect(page.locator('#experience')).toContainText('WiseTech Global')
    // Skills render the bundled skill list.
    await expect(page.locator('#skills')).toContainText('TypeScript')
  })

  test('makes no request to a backend API', async ({ page }) => {
    const apiCalls: string[] = []
    page.on('request', (req) => {
      const url = req.url()
      if (/\/api\//.test(url) || /localhost:5080/.test(url)) {
        apiCalls.push(url)
      }
    })

    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Give any (unexpected) on-mount fetches a chance to fire.
    await page.waitForTimeout(500)

    expect(apiCalls).toEqual([])
  })
})
