# Design: improve-mobile-layout-ux

## Context

The portfolio is a single-page Vue 3 + Vite site with a TresJS 3D scene, deployed as a static client on Vercel.
Mobile handling today is ad hoc: components each define their own breakpoints (480px in TechStackSection, 640px in AppHeader, 768px in ContactSection/ProjectsSection/Timeline, 900px for the 3D scene cutoff in Background3DScene/ScrollyStage, 901px min-width in HeroSection/SkillsSection).
The 3D scene is simply hidden below 900px.
There is an existing Playwright E2E suite (`client/e2e/`) that runs only a Desktop Chrome project.
No one has systematically looked at the site on a phone, so the actual defect list is unknown until the audit runs.

## Goals / Non-Goals

**Goals:**

- Produce a concrete, evidence-based defect list from viewing the real site at phone viewports.
- Fix layout and UX defects so the site meets the `mobile-experience` spec.
- Consolidate breakpoints into a shared, named set used by all components.
- Add a Playwright mobile viewport project so regressions are caught automatically.

**Non-Goals:**

- No redesign of the desktop experience; desktop layouts and existing section specs are unchanged.
- No mobile version of the 3D scene; hiding it below the breakpoint remains the strategy (performance and battery on phones argue for this).
- No hamburger menu or navigation redesign unless the audit shows the current nav cannot fit; prefer adapting the existing nav.
- No content changes; `client/src/data/fallback.ts` stays untouched.

## Decisions

### Audit-first workflow, driven by real rendering

The audit runs before any fix is written, using Playwright against the Vite dev server at phone viewports (360x740 as the strict case, 390x844 as the common case, 430x932 as the large case).
Full-page and per-section screenshots plus DOM checks (scrollWidth vs clientWidth, bounding boxes of interactive elements) produce the defect list.
Alternative considered: fixing sections one by one from code reading alone.
Rejected because CSS interactions (transforms, pinned scrolling in the projects section, 3D fallback) are only trustworthy when rendered; this also matches the house rule of reproducing issues end-to-end before fixing.

### Shared breakpoints as CSS custom properties plus documented constants

Define the breakpoint set once: `phone` at max-width 480px, `tablet` at max-width 768px, and the existing `scene` cutoff at 900px kept as-is because it is tied to 3D performance rather than layout.
Media queries cannot read CSS custom properties, so the values live as documented constants in a comment block in `client/src/style.css` and each component uses the same literal values with a reference comment.
Alternative considered: a CSS preprocessor or PostCSS custom-media plugin to get named media queries.
Rejected as a new build dependency for three values; the documented-constant convention is simpler and the E2E breakpoint test enforces consistency better than tooling would.

### Keep per-component scoped styles, no global mobile stylesheet

Fixes land in each component's own `<style>` block, following the existing convention of scoped component styles.
A single global mobile stylesheet was rejected: it would split a component's layout logic across two files and rot as components change.
Only genuinely global rules (e.g. `overflow-x` guard on the body, base font sizing) go in `style.css`.

### Mobile E2E as a second Playwright project

Add a `mobile-chromium` project to `client/playwright.config.ts` using Playwright's `devices['Pixel 7']` descriptor (or similar), plus a dedicated `mobile.spec.ts` covering the spec scenarios: no horizontal overflow after full scroll, hero renders without the 3D scene, touch target sizes, timeline single column, header fit.
Existing desktop specs keep running under the desktop project only, via project-level `testMatch`/`testIgnore`, so desktop assertions that assume wide layouts do not fail on mobile.
Alternative considered: running the whole existing suite in both projects.
Rejected because several existing tests assert desktop-specific layout (pinned project scrolling) and would need forked assertions, adding noise without adding coverage.

### Touch target sizing via padding, not visual growth

Where controls are visually small (nav links, carousel dots, card actions), meet the 44px target by expanding padding or using a pseudo-element hit area, keeping the visual design unchanged.

## Risks / Trade-offs

- [Audit finds a structural problem, e.g. the pinned projects scroll fundamentally conflicts with touch scrolling] → The projects section already has a below-768px swipe-track mode; extend that mode rather than redesigning the pinned behavior. If a redesign is truly needed, stop and raise it before implementing.
- [Breakpoint consolidation shifts layouts at widths between old and new values, changing tablet rendering] → The audit screenshots include 768px and 900px widths before and after, so any tablet regression is visible and reviewed, not accidental.
- [Playwright device emulation differs from real phones (no real touch physics, different font rendering)] → Emulation is sufficient for layout and hit-area assertions, which is what the spec covers; a manual pass on a real phone is a final task checkpoint.
- [Hidden 3D scene below 900px means tablets in portrait also lose it] → Accepted; the 900px cutoff is a deliberate performance decision and out of scope to revisit.

## Open Questions

- None blocking. If the audit reveals the header nav cannot fit at 360px even with tightened spacing, the fallback decision (horizontal scroll of nav vs. reduced link set vs. hamburger) will be made at that point and noted in tasks.
