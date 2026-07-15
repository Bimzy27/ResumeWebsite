# Proposal: lay-device-bookshelf-side-by-side

## Why

The Device and Bookshelf sections currently stack as two full-width sections, which makes the tail of the page long and leaves both 3D scenes surrounded by unused horizontal space on desktop.
Placing them side by side in one horizontal band tightens the page flow and presents the two personal showcases as a single unit.

## What Changes

- On desktop (viewports wider than the 900px scene cutoff), the Device and Bookshelf sections render side by side in the same horizontal row: Device in the left column, Bookshelf in the right column.
- The Device section's internal layout becomes a single column (3D scene above the spec sheet) since it now occupies half the page width.
- The Bookshelf scene stretches vertically so the two columns visually balance.
- On viewports 900px or narrower the sections stack vertically exactly as before (Device first), so the phone fallback behaviour is unchanged.
- DOM order is unchanged (projects, device, bookshelf, contact), so anchors and existing ordering assertions keep holding.

## Capabilities

### Modified Capabilities

- `device-section`: placement changes from "full-width section under projects" to "left column of a shared horizontal row"; the desktop scene renders above the spec sheet instead of next to it.
- `bookshelf-section`: placement changes from "full-width section under Device" to "right column of the same horizontal row".

## Impact

- `client/src/App.vue`: wraps the two sections in a two-column row.
- `client/src/components/DeviceSection.vue`: internal grid becomes single-column.
- `client/src/components/BookshelfSection.vue`: scene stretches to fill the column height.
- `client/e2e/device-bookshelf.spec.ts`: asserts the side-by-side layout on desktop.
