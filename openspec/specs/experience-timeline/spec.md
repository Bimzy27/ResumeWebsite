# Experience Timeline Specification

## Purpose

Present the owner's career history as a chronological timeline, showing each role's employer, title, dates, and key achievements.

## Requirements

### Requirement: Career Timeline

The system SHALL render career history (anchor `#experience`) as a vertical timeline, with one item per experience entry in the order provided.

#### Scenario: Rendering the timeline

- **WHEN** the experience section renders
- **THEN** each experience entry appears as a timeline item along a connecting line

### Requirement: Experience Entry Details

The system SHALL show, for each experience entry, the company, role, period, a list of highlights, and an optional company image.

#### Scenario: Displaying an entry

- **WHEN** a timeline item renders
- **THEN** it shows the company name, role, and period
- **AND** lists the entry's highlights
- **AND** displays the company image when one is provided
