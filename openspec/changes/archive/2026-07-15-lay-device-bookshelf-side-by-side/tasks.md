# Tasks: lay-device-bookshelf-side-by-side

## 1. Layout

- [x] 1.1 Wrap DeviceSection and BookshelfSection in a two-column row in App.vue (device left, bookshelf right, stacking at the 900px scene cutoff)
- [x] 1.2 Switch DeviceSection's internal layout to a single column: scene above spec sheet
- [x] 1.3 Stretch the Bookshelf scene to fill its column height so the row balances

## 2. Verification

- [x] 2.1 Extend the desktop E2E suite to assert the sections sit side by side (device left of bookshelf)
- [x] 2.2 Confirm the phone fallback still stacks and mounts no canvases (existing mobile suite)
- [x] 2.3 Run the full quality gate (lint, tests) to green
