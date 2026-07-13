# Proposal: add-device-bookshelf-sections

## Why

The portfolio currently ends its personal story at the projects section.
Two new sections - the PC Branden builds on and the books he has read - add personality and depth, and both suit the site's existing 3D identity (the TresJS avatar/desk scene).
The bookshelf additionally opens a monetisation path: each book links to its Amazon page, ready for affiliate links.

## What Changes

- Add a Device section directly underneath the projects section: a 3D model of Branden's PC alongside its spec sheet, with hover/click highlighting that links each spec to its part in the model.
- Add a Bookshelf section underneath the Device section: a rotating 3D carousel of the books Branden has read; clicking a book opens its Amazon purchase link in a new tab.
- Both sections render through the same 3D stack as the existing scene (TresJS + Three.js) and reuse its WebGL/viewport gating: no canvas on phones or without WebGL, with complete non-3D fallbacks.
- The PC model, the real book list, and affiliate links arrive in follow-up tasks; proxy geometry and placeholder data ship now with stable ids so swapping them in is data-only.
- Header navigation gains Device and Bookshelf links; the desktop and mobile E2E suites cover the new sections.

## Capabilities

### New Capabilities

- `device-section`: The Device section: 3D PC model, spec sheet, and part highlighting.
- `bookshelf-section`: The Bookshelf section: rotating 3D book carousel with purchase links and its non-3D fallback.

### Modified Capabilities

- `site-navigation`: The header gains Device and Bookshelf anchor links.

## Impact

- `client/src/App.vue`: two new sections mounted after ProjectsSection.
- `client/src/components/`: DeviceSection, DeviceModel, BookshelfSection, BookCarousel.
- `client/src/composables/useSectionScene.ts`: shared gate for section-scoped 3D scenes.
- `client/src/data/device.ts`, `client/src/data/books.ts`: placeholder content, swapped later.
- `client/src/types.ts`: DevicePart and Book types.
- `client/e2e/`: new device-bookshelf spec; navigation/content/mobile suites extended.
- No backend, no new dependencies.
