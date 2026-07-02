# End-to-end tests

Playwright tests that drive the built site in a real browser and check behaviour.
Each spec file maps to an OpenSpec capability under `openspec/specs/`.

| Spec file | Capability |
| --- | --- |
| `navigation.spec.ts` | `site-navigation` |
| `hero.spec.ts` | `hero-section` |
| `contact.spec.ts` | `contact-section` |
| `projects.spec.ts` | `projects-showcase` |
| `content.spec.ts` | `content-architecture` |

## Running

From the `client/` directory:

```bash
npm run test:e2e          # run the whole suite (headless)
npm run test:e2e:ui       # open the interactive Playwright UI
npm run test:e2e:report   # open the HTML report from the last run
```

Playwright starts the Vite dev server automatically (and reuses one if it is
already running), so no separate `npm run dev` is needed.

The first time on a new machine, install the browser once:

```bash
npx playwright install chromium
```

## Notes

- Tests navigate with `waitUntil: 'domcontentloaded'` and rely on Playwright's
  web-first assertions to wait for elements. This avoids blocking on the large
  3D `.glb` asset, which would otherwise delay the `load` event.
- The 3D scene itself is intentionally not asserted pixel-by-pixel; tests check
  observable DOM consequences instead, which keeps them stable.
