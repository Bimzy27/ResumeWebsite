# Tasks: improve-mobile-layout-ux

## 1. Mobile audit

- [x] 1.1 Start the Vite dev server and capture full-page screenshots at 360x740, 390x844, and 430x932 using Playwright, plus reference shots at 768px and 900px for the breakpoint work
- [x] 1.2 Run DOM checks at each phone viewport: document scrollWidth vs clientWidth after full scroll, and bounding boxes of all interactive elements (nav links, buttons, card actions, carousel controls, social links)
- [x] 1.3 Walk each section (header, hero, skills, tech stack, projects, timeline, recommendations, contact, footer) at 360px and record every defect: overflow, clipped or overlapping text, cramped spacing, undersized touch targets, empty regions from the hidden 3D scene
- [x] 1.4 Write the defect list into the change directory as audit-findings.md, mapping each defect to the spec requirement it violates

## 2. Shared breakpoints

- [x] 2.1 Document the breakpoint set (phone 480px, tablet 768px, scene cutoff 900px) in a comment block in client/src/style.css and add a global horizontal-overflow guard if the audit shows one is needed (guard deliberately omitted: the only overflow had a single structural cause in the header, and a blanket overflow-x: hidden would mask future regressions from the E2E test and risks breaking the sticky header)
- [x] 2.2 Align every component's media queries to the shared values (AppHeader's 640px was the only outlier, replaced by the 768px two-row header; all queries now use 480/768/900-901)

## 3. Section fixes

- [x] 3.1 Fix hero and background at phone widths: kept the CSS glow on phones (only the 3D canvas is disabled, and it no longer mounts at all below 901px), trimmed hero padding at the phone breakpoint
- [x] 3.2 Fix header navigation: two-row header (logo row, full-width nav row) at the tablet breakpoint, links padded to 44px-plus tap areas, logo hit area padded
- [x] 3.3 Fix skills and tech stack sections: stacking was already correct per audit; tech card names raised from 10.9px to 12.8px at the phone breakpoint
- [x] 3.4 Fix projects section swipe track: card basis narrowed so ~31px of the next card peeks at 360px (was ~6px), mandatory scroll snap, card action buttons 44px tall in the touch range
- [x] 3.5 Fix experience timeline single-column layout: audited and verified already correct at 360px, no change needed
- [x] 3.6 Fix recommendations carousel: controls moved below the card as a horizontal row on phones with 44px arrows; dots get 19px padded hit areas as secondary controls (the arrows are the full-size equivalent control); author line raised to 14px
- [x] 3.7 Fix contact section and footer: social and resume buttons 44px in the touch range, email link hit area padded to 44px; footer verified fine
- [x] 3.8 Fix any remaining defects from audit-findings.md: F8 (sticky header covering anchored sections) fixed with scroll-margin-top on id sections; all ten findings addressed

## 4. Mobile E2E coverage

- [x] 4.1 Add a mobile-chromium project to client/playwright.config.ts using a phone device descriptor, scoped so existing desktop specs keep running only on the desktop project (Pixel 7 emulation at 360x740; desktop project ignores mobile.spec.ts)
- [x] 4.2 Write e2e/mobile.spec.ts covering the spec scenarios: eight tests covering overflow-while-scrolling, 3D canvas not mounting plus glow fallback, header fit, 44px touch targets, timeline single column, projects peek and internal scrolling, carousel controls, and anchor offset below the sticky header
- [x] 4.3 Run the full Playwright suite (desktop and mobile projects): 27/27 passing, no flakiness across repeat runs; vue-tsc build also clean

## 5. Verification

- [x] 5.1 Re-capture the audit screenshots at all three phone viewports and confirm every defect in audit-findings.md is resolved: zero overflow samples and zero undersized primary targets at 360/390/430px; all ten findings marked fixed
- [x] 5.2 Verify desktop is unchanged: 1440px before/after screenshots match except the carousel dots' spacing (an intended consequence of their padded hit areas); all 19 desktop E2E tests pass
- [x] 5.3 Manual pass on a real phone: functionally tested by Branden on 2026-07-07, looks good
