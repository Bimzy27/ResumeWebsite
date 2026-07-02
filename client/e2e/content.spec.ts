import { test, expect } from '@playwright/test'

// Covers the `content-architecture` capability spec: the deployed site renders
// entirely from bundled data with no backend.
test.describe('Content architecture', () => {
  test('all main sections render from bundled data', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    for (const id of ['#top', '#skills', '#experience', '#projects', '#contact']) {
      await expect(page.locator(id)).toBeVisible()
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
