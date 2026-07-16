# Site Navigation Specification

## Purpose

Provide a single-page portfolio shell that lets a visitor move between the site's sections and always identify whose portfolio they are viewing.
This capability covers the sticky header, its in-page navigation, the return-to-top behaviour, and the footer.
## Requirements
### Requirement: Sticky Header

The system SHALL present a header that remains fixed to the top of the viewport while the visitor scrolls, showing the owner's name as a logo and a navigation menu.

#### Scenario: Header stays visible while scrolling

- **WHEN** the visitor scrolls down past the top of the page
- **THEN** the header remains pinned to the top of the viewport with a translucent, blurred background

#### Scenario: Header shows owner identity

- **WHEN** the page renders
- **THEN** the header displays "Branden Immerzeel" as a clickable logo

### Requirement: In-Page Section Navigation

The system SHALL provide navigation links that scroll the page to the About, Skills, Experience, Projects, and Contact sections via their anchors.
While the Device and Bookshelf sections are hidden on master (incomplete content released early by accident, see the `device-section` and `bookshelf-section` specs), their navigation links are omitted as well.

#### Scenario: Navigating to a section

- **WHEN** the visitor activates a navigation link (e.g. "Projects")
- **THEN** the page scrolls to the corresponding section anchor (e.g. `#projects`)

#### Scenario: No links to hidden sections

- **WHEN** the page renders while the Device and Bookshelf sections are hidden
- **THEN** the navigation shows no "Device" or "Bookshelf" link

### Requirement: Return To True Top

The system SHALL scroll the window to the absolute top of the page, rather than to the hero's offset beneath the sticky header, when the visitor activates the logo or the "About" link.

#### Scenario: Clicking the logo

- **WHEN** the visitor activates the header logo or the "About" link
- **THEN** the window smoothly scrolls to position 0
- **AND** the URL hash is set to `#top` without an additional jump

### Requirement: Footer

The system SHALL display a footer containing a copyright notice with the current year and a short build attribution.

#### Scenario: Footer year is current

- **WHEN** the page renders
- **THEN** the footer shows the current calendar year alongside "Branden Immerzeel"
- **AND** shows the attribution "Built with Vue 3 & TypeScript"

