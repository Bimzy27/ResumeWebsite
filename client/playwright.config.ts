import { defineConfig, devices } from '@playwright/test'

// E2E tests drive the real site in a browser. They run against the Vite dev
// server, which Playwright starts automatically (and reuses if one is already
// running locally). Behaviour is identical to the production build for the
// interactions these tests cover, and the dev server is faster to spin up.
// The port is overridable (E2E_PORT) so the suite can run when another dev
// server already occupies the default, and the webServer command binds it
// with --strictPort so Playwright never silently reuses or health-checks a
// different app that happens to listen on the expected port.
const PORT = Number(process.env.E2E_PORT ?? 5173)
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  // Run tests in files in parallel.
  fullyParallel: true,
  // Fail the build on CI if test.only was left in the source.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL,
    // Capture a trace when a test fails on retry, for debugging.
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Desktop specs assert wide layouts (pinned project scrolling, one-row
      // header); the phone project runs its own spec instead.
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: 'mobile-chromium',
      // Pixel 7 emulation (touch, mobile UA, device scale factor) but at
      // 360px width, the strictest common phone viewport the mobile spec
      // is written against.
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 740 } },
      testMatch: /mobile\.spec\.ts/,
    },
  ],

  // Start the dev server before running tests.
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
