# Immersive Visuals Specification

## Purpose

Provide the site's signature visual atmosphere: a scroll-driven 3D scene behind the hero and skills sections, a decorative cursor trail, and an ambient background glow, while degrading gracefully on small screens and for reduced-motion visitors.

## Requirements

### Requirement: Scroll-Driven 3D Scene

The system SHALL pin a 3D desk scene behind the hero and skills sections and drive its camera from a close-up to a wide shot based on scroll progress through the hero section.

#### Scenario: Scrolling through the hero

- **WHEN** the visitor scrolls through the hero section on a large screen
- **THEN** the pinned 3D scene's camera animates from a tight close-up toward the full wide desk shot as scroll progress advances from 0 to 1
- **AND** the scene stays pinned behind the skills section once fully zoomed out

### Requirement: Ambient Background Glow

The system SHALL render an ambient radial glow behind the 3D scene so that it shows through wherever the scene canvas is transparent.

#### Scenario: Glow visible behind the scene

- **WHEN** the hero renders on a large screen
- **THEN** a blurred radial glow is visible behind the 3D avatar, tapering to transparent toward the bottom

### Requirement: Cursor Trail

The system SHALL render a decorative cursor trail that follows the visitor's pointer.

#### Scenario: Moving the pointer

- **WHEN** the visitor moves their pointer across the page
- **THEN** a decorative trail follows the cursor

### Requirement: Graceful Degradation

The system SHALL disable the pinned 3D scene on small screens so that content remains readable and performant.

#### Scenario: Small screen

- **WHEN** the viewport is narrow (small screen)
- **THEN** the pinned 3D background is not rendered and sections stack normally
