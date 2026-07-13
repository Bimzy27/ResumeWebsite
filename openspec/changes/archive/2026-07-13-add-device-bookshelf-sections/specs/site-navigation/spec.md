# Spec: site-navigation

## MODIFIED Requirements

### Requirement: In-Page Section Navigation

The system SHALL provide navigation links that scroll the page to the About, Skills, Experience, Projects, Device, Bookshelf, and Contact sections via their anchors.

#### Scenario: Navigating to a section

- **WHEN** the visitor activates a navigation link (e.g. "Projects")
- **THEN** the page scrolls to the corresponding section anchor (e.g. `#projects`)

#### Scenario: Navigating to the new sections

- **WHEN** the visitor activates the "Device" or "Bookshelf" link
- **THEN** the page scrolls to `#device` or `#bookshelf` respectively
