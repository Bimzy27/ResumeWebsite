# device-section Delta

## MODIFIED Requirements

### Requirement: Device section placement

The site SHALL present a Device section directly underneath the projects section, introducing the PC Branden builds on.
On viewports wider than the 900px scene cutoff, the Device and Bookshelf sections SHALL share one horizontal row, with the Device section as the left column.

#### Scenario: Section order

- **WHEN** the site is loaded
- **THEN** the Device section renders after the projects section and before the Bookshelf section in the DOM

#### Scenario: Side-by-side row on desktop

- **WHEN** the site is viewed at a viewport wider than 900px
- **THEN** the Device section renders in the left half of a shared row with the Bookshelf section on its right

#### Scenario: Stacked below the scene cutoff

- **WHEN** the site is viewed at a viewport 900px wide or narrower
- **THEN** the Device section renders full-width above the Bookshelf section

### Requirement: 3D PC model with spec sheet

The Device section SHALL render a 3D model of the PC (using the site's TresJS/Three.js stack) above a spec sheet listing every part of the build (CPU, GPU, memory, motherboard, storage, cooling, PSU, case).
Until the real model and specs are supplied, a proxy model and placeholder specs with stable part ids MAY be used.

#### Scenario: Desktop rendering

- **WHEN** a visitor with WebGL support views the section at a viewport wider than 900px
- **THEN** the 3D PC model renders in a section-scoped canvas above the full spec sheet within the section's column
