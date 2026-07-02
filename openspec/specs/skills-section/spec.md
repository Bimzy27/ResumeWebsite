# Skills Section Specification

## Purpose

Summarise the owner's core technical skills and professional strengths in a scannable format.

## Requirements

### Requirement: Skill Tags

The system SHALL render the owner's skills (anchor `#skills`) as a set of individual tags.

#### Scenario: Displaying skills

- **WHEN** the skills section renders
- **THEN** each skill in the profile's skill list is shown as its own tag

### Requirement: Strength Cards

The system SHALL present the owner's professional strengths as cards, each with a title and a description, cycling through a fixed set of accent colours.

#### Scenario: Displaying a strength

- **WHEN** the skills section renders
- **THEN** each strength is shown as a card containing its title and description
- **AND** cards are assigned accent colours in rotation so adjacent cards are visually distinct
