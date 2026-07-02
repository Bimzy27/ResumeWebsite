# Projects Showcase Specification

## Purpose

Highlight the owner's notable projects as a row of cards, each with descriptive text, tags, contextual media, and action links, using a pinned horizontal-scroll interaction on capable screens.

## Requirements

### Requirement: Project Cards

The system SHALL render projects (anchor `#projects`) as cards, each showing a title, description, and tags.

#### Scenario: Displaying a project

- **WHEN** the projects section renders
- **THEN** each project appears as a card with its title, description, and tags

### Requirement: Contextual Project Media

The system SHALL render project media according to its type: a click-to-play YouTube video embed, a static image, a Google Play block, or a YouTube channel link block.

#### Scenario: Rendering typed media

- **WHEN** a project defines media of a given type
- **THEN** the card renders the matching media presentation (YouTube embed, image, Google Play block, or channel block)

### Requirement: Project Actions

The system SHALL render each project's action links as buttons that open their target URLs, distinguishing primary from secondary actions.

#### Scenario: Following a project action

- **WHEN** the visitor activates a project action
- **THEN** the action's target URL opens
- **AND** primary and secondary actions are styled distinctly

### Requirement: Pinned Horizontal Scroll

The system SHALL pin the projects section and translate the card track horizontally in step with vertical scroll when the cards overflow the viewport width, and SHALL centre the cards without pinning when they all fit.

#### Scenario: Cards overflow the viewport

- **WHEN** the project cards are wider than the visible area on a capable screen
- **THEN** the section pins to the viewport and the cards slide horizontally as the visitor scrolls vertically, resuming normal vertical scroll once fully revealed

#### Scenario: Cards fit the viewport

- **WHEN** all project cards fit within the visible area
- **THEN** the cards are centred and the section does not pin

### Requirement: Reduced-Motion And Small-Screen Fallback

The system SHALL fall back to a plain native horizontal-scroll row, without pinning, on small screens or when the visitor prefers reduced motion.

#### Scenario: Reduced motion preference

- **WHEN** the visitor's system requests reduced motion, or the screen is small
- **THEN** the projects render as a normal horizontal-scrolling row without the pinned scroll effect
