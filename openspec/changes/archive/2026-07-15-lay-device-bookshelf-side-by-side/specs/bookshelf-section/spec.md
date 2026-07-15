# bookshelf-section Delta

## MODIFIED Requirements

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
