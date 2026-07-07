# Mobile audit findings

Audited 2026-07-07 against the Vite dev server with Playwright device emulation.
Viewports: 360x740, 390x844, 430x932 (phone), 768x1024 and 900x1000 (breakpoint references), 1440x900 (desktop baseline).
Method: full-page and per-section screenshots, scrollWidth/clientWidth sampling while scrolling, bounding boxes of all interactive elements, computed font sizes of text nodes.
Raw data and screenshots: scratchpad `audit-before/` and `sections-360/` (session-local).

## Defects

### F1: Header nav overflows the page below ~425px viewport width

- Evidence: document scrollWidth is 424px at both 360px and 390px viewports (100% of scroll samples). `nav.header__nav` right edge sits at 424px. "Contact" is fully off-screen, "Projects" is clipped, and the logo wraps to two lines.
- Spec: No horizontal overflow on phone viewports; Sections adapt (header fits a narrow viewport).
- Fix direction: two-row header (logo row, nav row) at the tablet breakpoint and below.

### F2: Header nav links have 16px-tall touch targets

- Evidence: each nav link measures ~34-73px wide by 16px tall at 360px.
- Spec: Touch targets are adequately sized.
- Fix direction: padding on the links to reach at least 44px effective height.

### F3: Recommendations carousel controls are far below touch size

- Evidence: prev/next arrows are 32x32; the nine dots are 7x7 (9x9 active).
- Spec: Touch targets are adequately sized.
- Fix direction: 44px arrows on phone; dots get padded hit areas (~26px) and remain secondary to the arrows, which provide an equivalent full-size control for every slide (WCAG 2.5.8 equivalent-target reasoning). The vertical left rail also steals ~44px of card width at 360px; move the controls below the card on phones.

### F4: Assorted controls just below the 44px target

- Evidence: project card buttons 35-37px tall; contact social and resume buttons 42px; contact email link 20px tall.
- Spec: Touch targets are adequately sized.
- Fix direction: bump button heights to 44px and pad the email link.

### F5: Projects swipe track hides 5 of 6 projects with no affordance

- Evidence: at 360px the card basis is min(85vw, 340px) = 306px; with 24px rail padding and 24px gap the next card peeks only ~6px (10px at 390px). The section shows what looks like a single static card; nothing signals that more projects exist.
- Spec: Wide interactive content scrolls internally; Sections adapt to a single-column phone layout.
- Fix direction: narrower card basis so the next card peeks ~30-40px, plus mandatory scroll snap on phones.

### F6: Hero loses all background styling on phones

- Evidence: `.scrolly__bg` (purple glow plus 3D scene) is display:none at max-width 900px, leaving a flat white hero; combined with 120px hero padding-top, the top screen reads as empty.
- Spec: 3D scene has a presentable fallback.
- Fix direction: keep the CSS glow (it costs nothing) while hiding only the 3D canvas; trim hero top padding on phones.

### F7: 3D scene still initializes on phones despite being hidden

- Evidence: Background3DScene gates TresCanvas only on WebGL support; on phones the canvas mounts inside a display:none box, downloading the GLB and rendering to an invisible surface.
- Spec: 3D scene has a presentable fallback (the fallback should not pay the scene's cost).
- Fix direction: gate the canvas on a reactive (min-width: 901px) media query as well.

### F8: Sticky header covers section tops on anchor navigation

- Evidence: no element sets scroll-margin-top; tapping a nav link lands the section eyebrow underneath the translucent sticky header (visible in every per-section screenshot).
- Spec: Sections adapt (header does not overlap content); also a desktop bug, worth fixing globally.
- Fix direction: scroll-margin-top on [id] sections sized to the header height.

### F9: Tech card names render at 10.9px

- Evidence: `span.tech-card__name` computes to 10.88px across 28 cards; recommendation author lines compute to 12.8px.
- Spec: Typography is readable on phones.
- Fix direction: raise tech card names to at least 12.8px on phones; nudge the recommendation author line. Uppercase eyebrow labels and skill tags (12.5-13.6px with letter-spacing) are intentional caption styling and are left as is.

### F10: Ad hoc breakpoint set

- Evidence: components switch layouts at 480, 640, 768, 900, and 901px with no shared definition.
- Spec: Consistent breakpoint strategy.
- Fix direction: consolidate to phone 480px, tablet 768px, scene cutoff 900px, documented in style.css.

## Verified fine (no action)

- Timeline collapses correctly to a single left-aligned column at 360px.
- Skills, tech stack, contact, and footer stack cleanly with no overflow.
- 430px viewport has no horizontal overflow (the header fits above ~425px).
- No console errors at any audited viewport.
- Body and quote text is 14px+; heading clamps behave well at 360px.

## Resolution status

Updated as fixes land; see tasks.md.

- F1: fixed (two-row header at the tablet breakpoint; re-audit shows zero overflow samples at 360/390/430px)
- F2: fixed (nav links are 44px-plus tall)
- F3: fixed (44px arrows below the card on phones; dots have 19px padded hit areas as secondary controls with the arrows as the full-size equivalent)
- F4: fixed (project buttons, social buttons, resume button 44px in the touch range; email link hit area padded)
- F5: fixed (~31px next-card peek at 360px plus mandatory scroll snap)
- F6: fixed (CSS glow kept on phones; hero padding trimmed at the phone breakpoint)
- F7: fixed (TresCanvas no longer mounts below 901px, via a reactive media query gate)
- F8: fixed (scroll-margin-top on id sections, sized per header height)
- F9: fixed (tech card names 12.8px and recommendation author line 14px on phones)
- F10: fixed (all media queries now use the documented 480/768/900-901 set)
