# bookshelf-section Specification

## Purpose
TBD - created by archiving change add-device-bookshelf-sections. Update Purpose after archive.
## Requirements
### Requirement: Bookshelf section placement

The site SHALL present a Bookshelf section after the Device section, showing the books Branden has read.
On viewports wider than the 900px scene cutoff, the Bookshelf section SHALL render as the right column of the horizontal row it shares with the Device section.

#### Scenario: Section order

- **WHEN** the site is loaded
- **THEN** the Bookshelf section renders after the Device section and before the contact section in the DOM

#### Scenario: Side-by-side row on desktop

- **WHEN** the site is viewed at a viewport wider than 900px
- **THEN** the Bookshelf section renders in the right half of a shared row with the Device section on its left

#### Scenario: Stacked below the scene cutoff

- **WHEN** the site is viewed at a viewport 900px wide or narrower
- **THEN** the Bookshelf section renders full-width below the Device section

### Requirement: Rotating 3D book carousel
The Bookshelf section SHALL render the books as a rotating 3D carousel (using the site's TresJS/Three.js stack).
The carousel rotates continuously, pauses while a book is hovered, and visually emphasises the hovered book.
Until the real reading list and bookshelf model are supplied, proxy book geometry and placeholder titles MAY be used.

#### Scenario: Desktop rendering
- **WHEN** a visitor with WebGL support views the section at a viewport wider than 900px
- **THEN** the rotating book carousel renders in a section-scoped canvas

#### Scenario: Hover pauses the carousel
- **WHEN** the visitor hovers a book
- **THEN** the carousel eases to a stop and the hovered book is emphasised

### Requirement: Books link to their purchase pages
Every book SHALL be clickable and open its Amazon purchase link in a new tab.
Purchase links are direct Amazon product pages carrying Branden's Associates tag so clicks earn referral commission.
The full book list MUST also exist as real anchor links so books stay reachable by keyboard and assistive technology when the canvas is mounted.

#### Scenario: Clicking a 3D book
- **WHEN** the visitor clicks a book in the carousel
- **THEN** the book's Amazon link opens in a new tab with `noopener`

#### Scenario: Accessible link list
- **WHEN** the 3D carousel is mounted
- **THEN** the book list remains in the accessibility tree as anchor links to Amazon (visually hidden)

### Requirement: Non-3D fallback
On viewports 900px or narrower, or without WebGL, the section SHALL NOT mount its canvas and MUST render the books as a visible grid of purchase links with touch-friendly targets.

#### Scenario: Phone layout
- **WHEN** the site is viewed at a phone viewport
- **THEN** no canvas mounts inside the Bookshelf section and each book renders as a visible Amazon link

