import { test, expect } from '@playwright/test'

// Covers the `site-navigation` capability spec.
test.describe('Site navigation', () => {
  test('header shows the owner identity and stays pinned while scrolling', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const header = page.locator('header.header')
    await expect(header).toBeVisible()
    await expect(page.locator('.header__logo')).toHaveText('Branden Immerzeel')

    // Sticky: after scrolling well down the page, the header remains at the top.
    await page.evaluate(() => window.scrollTo(0, 1200))
    const box = await header.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBeLessThan(5)
  })

  test('navigation links target the section anchors', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const nav = page.locator('.header__nav')
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#top')
    await expect(nav.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
    await expect(nav.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#experience')
    await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
    await expect(nav.getByRole('link', { name: 'Device' })).toHaveAttribute('href', '#device')
    await expect(nav.getByRole('link', { name: 'Bookshelf' })).toHaveAttribute('href', '#bookshelf')
    await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })

  test('clicking the logo returns to the true top of the page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await page.evaluate(() => window.scrollTo(0, 1500))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500)

    await page.locator('.header__logo').click()

    // Smooth scroll settles back to the very top. The animation is rAF-driven and the page
    // renders WebGL scenes, so under parallel-worker CPU contention it can take well over
    // 5s; allow a generous window (the asserted end state is unchanged).
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 15000 }).toBe(0)
  })

  test('footer shows the current year and build attribution', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const footer = page.locator('footer.footer')
    const year = new Date().getFullYear().toString()
    await expect(footer).toContainText(`© ${year} Branden Immerzeel`)
    await expect(footer).toContainText('Built with Vue 3 & TypeScript')
  })
})
