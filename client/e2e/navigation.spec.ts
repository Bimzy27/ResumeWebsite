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
    await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
    // Device/Bookshelf never get nav links, regardless of whether those
    // sections themselves are shown (see src/featureFlags.ts) - they're
    // reachable by scrolling, not from the header.
    await expect(nav.getByRole('link', { name: 'Device' })).toHaveCount(0)
    await expect(nav.getByRole('link', { name: 'Bookshelf' })).toHaveCount(0)
  })

  test('LinkedIn and YouTube buttons sit in the header, matching the Contact section style', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const social = page.locator('.header__social')
    const linkedin = social.getByRole('link', { name: /linkedin/i })
    const youtube = social.getByRole('link', { name: /youtube/i })

    await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/branden-immerzeel/')
    await expect(linkedin).toHaveAttribute('target', '_blank')
    await expect(linkedin).toHaveAttribute('rel', 'noopener')
    await expect(linkedin).toHaveClass(/icon-btn--linkedin/)

    await expect(youtube).toHaveAttribute('href', 'https://www.youtube.com/@BimzyDev')
    await expect(youtube).toHaveAttribute('target', '_blank')
    await expect(youtube).toHaveAttribute('rel', 'noopener')
    await expect(youtube).toHaveClass(/icon-btn--youtube/)

    // Right corner of the header: to the right of both the logo and the nav.
    const logoBox = await page.locator('.header__logo').boundingBox()
    const navBox = await page.locator('.header__nav').boundingBox()
    const socialBox = await social.boundingBox()
    const containerBox = await page.locator('.header__inner').boundingBox()
    expect(logoBox).not.toBeNull()
    expect(navBox).not.toBeNull()
    expect(socialBox).not.toBeNull()
    expect(containerBox).not.toBeNull()
    expect(socialBox!.x).toBeGreaterThan(logoBox!.x)
    expect(socialBox!.x).toBeGreaterThanOrEqual(navBox!.x)

    // Flush against the row's right edge, mirroring how the logo sits flush
    // against the left edge - the gap on each side should roughly match.
    const leftInset = logoBox!.x - containerBox!.x
    const rightInset = containerBox!.x + containerBox!.width - (socialBox!.x + socialBox!.width)
    expect(Math.abs(rightInset - leftInset)).toBeLessThanOrEqual(1)

    // Centered in the gap between the logo and the social buttons, not
    // hugging the logo: the space before the nav should roughly match the
    // space after it.
    const gapBeforeNav = navBox!.x - (logoBox!.x + logoBox!.width)
    const gapAfterNav = socialBox!.x - (navBox!.x + navBox!.width)
    expect(Math.abs(gapAfterNav - gapBeforeNav)).toBeLessThanOrEqual(1)
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
