# Mobile Experience Specification

## Purpose

Define how the site presents and behaves on phone-sized viewports: no horizontal overflow, readable typography, adequate touch targets, per-section layout adaptations, a presentable fallback where the 3D scene is disabled, and a shared breakpoint strategy.
Verified by the mobile-chromium Playwright project (`client/e2e/mobile.spec.ts`).

## Requirements

### Requirement: No horizontal overflow on phone viewports
The site SHALL render without horizontal page scrolling at phone viewport widths (360px through 430px).
Content that is intentionally wider than the viewport (such as the swipeable project track) MUST scroll inside its own container, never the page body.

#### Scenario: Page body never scrolls horizontally
- **WHEN** the site is loaded at a 360px wide viewport and scrolled from top to bottom
- **THEN** the document has no horizontal scrollbar and no element extends the page width beyond the viewport

#### Scenario: Wide interactive content scrolls internally
- **WHEN** a visitor at a phone viewport reaches the projects section
- **THEN** project cards are swipeable within the section's own track without causing page-level horizontal scroll

### Requirement: 3D scene has a presentable fallback
On viewports 900px wide or narrower, the 3D avatar and desk scene SHALL be hidden and the affected sections MUST still present complete, intentional layouts rather than empty space.

#### Scenario: Hero renders without the 3D scene
- **WHEN** the site is loaded at a phone viewport
- **THEN** the hero section fills its space with the text content and background styling, with no large empty region where the 3D scene would be

### Requirement: Typography is readable on phones
Text SHALL remain readable at phone viewports: body text at no less than 14px effective size, headings scaled down proportionally without truncation or overlap, and no text clipped by its container.

#### Scenario: Headings fit the viewport
- **WHEN** the site is viewed at a 360px wide viewport
- **THEN** every section heading wraps or scales to fit without overflowing its container or overlapping adjacent content

### Requirement: Touch targets are adequately sized
Interactive elements (navigation links, buttons, project card actions, carousel controls, social links) SHALL present a touch target of at least 44x44 CSS pixels on phone viewports, either through their own size or through padding.

#### Scenario: Header navigation is tappable
- **WHEN** a visitor at a phone viewport taps a header navigation link
- **THEN** the link activates reliably and its tappable area is at least 44px tall

#### Scenario: Card and carousel controls are tappable
- **WHEN** a visitor at a phone viewport uses project card actions or recommendation carousel controls
- **THEN** each control activates on the first tap without requiring precision aiming

### Requirement: Sections adapt to a single-column phone layout
Each section SHALL present a layout designed for narrow viewports rather than a compressed desktop layout.
The experience timeline MUST collapse to a single column with the line and markers on the left.
The recommendations carousel MUST show one recommendation at a time with swipe or control navigation.
The contact section's social links MUST wrap without overflowing.
The header navigation MUST fit within the viewport width without wrapping onto the page content.

#### Scenario: Timeline collapses to one column
- **WHEN** the experience timeline is viewed at a phone viewport
- **THEN** entries stack in a single column with the timeline line and markers aligned on the left edge

#### Scenario: Header fits a narrow viewport
- **WHEN** the site is loaded at a 360px wide viewport
- **THEN** the header shows its navigation within the viewport width without overlapping or clipping links

#### Scenario: Contact section stacks cleanly
- **WHEN** the contact section is viewed at a phone viewport
- **THEN** the form fields and social links stack vertically and wrap without horizontal overflow

### Requirement: Consistent breakpoint strategy
The site SHALL use a shared, documented set of breakpoints for phone, tablet, and desktop layouts rather than per-component ad hoc values, so that sections transition between layouts at the same widths.

#### Scenario: Sections transition at shared widths
- **WHEN** the viewport is resized across the defined phone and tablet breakpoints
- **THEN** all sections switch layouts at the shared breakpoint values with no intermediate width where mixed desktop and mobile layouts appear
