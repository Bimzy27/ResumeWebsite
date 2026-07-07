# Proposal: improve-mobile-layout-ux

## Why

The portfolio was designed desktop-first, and mobile behavior has grown ad hoc: each section carries its own breakpoints (480px, 640px, 768px, 900px) with no shared definition of what a phone visitor should experience.
Recruiters and hiring managers frequently open portfolio links on their phones, so a broken or awkward mobile layout directly undermines the site's purpose.
There is currently no spec and no test coverage for phone viewports, so regressions ship silently.

## What Changes

- Audit every section (header, hero, skills, tech stack, projects, experience timeline, recommendations, contact, footer) at representative phone viewports (roughly 360x740 through 430x932) using a real browser, and catalog concrete layout and UX defects.
- Fix the defects found: horizontal overflow, cramped or overlapping text, touch targets below comfortable size, awkward spacing, and any section whose desktop layout degrades poorly instead of adapting.
- Rationalize the breakpoint strategy so sections share a coherent set of breakpoints instead of each inventing its own.
- Verify the mobile-specific interaction patterns work well on touch: the swipeable project card track, the recommendations carousel, and the timeline's single-column layout.
- Confirm the 3D scene fallback (hidden below 900px) leaves the hero and background presentable rather than empty.
- Add Playwright E2E coverage at a phone viewport so mobile layout regressions are caught, extending the existing E2E suite.

## Capabilities

### New Capabilities

- `mobile-experience`: Defines how the site presents and behaves on phone-sized viewports: no horizontal overflow, readable typography, adequate touch targets, per-section layout adaptations, and the 3D fallback behavior.

### Modified Capabilities

<!-- None. Existing section specs describe desktop behavior that is not changing.
     Phone-viewport requirements are consolidated in the new mobile-experience capability. -->

## Impact

- `client/src/components/*.vue`: responsive CSS adjustments across sections; no content or data changes.
- `client/src/style.css`: possible shared breakpoint variables or base adjustments.
- `client/e2e/`: new Playwright tests running at a phone viewport.
- No backend, no API, no dependency changes. Content in `client/src/data/fallback.ts` is untouched.
