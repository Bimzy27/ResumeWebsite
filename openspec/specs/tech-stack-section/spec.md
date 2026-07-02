# Tech Stack Section Specification

## Purpose

Showcase the tools and technologies the owner works with, grouped into labelled categories with recognisable brand icons that link to each tool's documentation.

## Requirements

### Requirement: Categorised Tech Grid

The system SHALL display technologies grouped into labelled categories, laid out as a fixed set of rows in a deliberate display order.

#### Scenario: Rendering categories

- **WHEN** the tech stack section renders
- **THEN** technologies are grouped under their category labels
- **AND** the categories appear in the predefined row order, with AI Tooling first

### Requirement: Brand Icons With Fallback

The system SHALL render each technology with a brand icon, sourcing it from a locally hosted asset when provided and otherwise from the Simple Icons CDN, and SHALL fall back to a text monogram when no icon slug exists.

#### Scenario: Icon available

- **WHEN** a technology has a local icon or a Simple Icons slug
- **THEN** its icon is rendered from the local asset if present, otherwise from the CDN with any configured colour override

#### Scenario: No icon available

- **WHEN** a technology has no icon slug
- **THEN** a short text monogram is rendered instead of a broken image

### Requirement: Documentation Links

The system SHALL render each technology as a link that opens the tool's official documentation in a new tab.

#### Scenario: Opening documentation

- **WHEN** the visitor activates a technology card
- **THEN** the tool's documentation URL opens in a new browser tab
