# Tasks: add-device-bookshelf-sections

## 1. Data and types

- [x] 1.1 Add `DevicePart` and `Book` types to `client/src/types.ts`
- [x] 1.2 Add placeholder device specs in `client/src/data/device.ts` (marked for replacement)
- [x] 1.3 Add placeholder book list in `client/src/data/books.ts` with Amazon search links (marked for replacement by affiliate links)

## 2. Shared 3D gating

- [x] 2.1 Add `useSectionScene` composable: WebGL probe + 901px scene cutoff + lazy mount via IntersectionObserver

## 3. Device section

- [x] 3.1 Build `DeviceModel.vue`: proxy PC from Three primitives, part ids matching the spec data, auto-rotation, emissive highlight
- [x] 3.2 Build `DeviceSection.vue`: canvas + interactive spec sheet with two-way hover/click highlighting and a specs-only phone layout

## 4. Bookshelf section

- [x] 4.1 Build `BookCarousel.vue`: ring of proxy books with generated cover textures, spin that pauses on hover, click opens the Amazon link
- [x] 4.2 Build `BookshelfSection.vue`: canvas plus the book list as real links (visible fallback on phones/no-WebGL, visually hidden on desktop for accessibility)

## 5. Integration

- [x] 5.1 Mount both sections after ProjectsSection in `App.vue`
- [x] 5.2 Add Device and Bookshelf links to the header navigation

## 6. Tests

- [x] 6.1 New `device-bookshelf.spec.ts` desktop coverage (order, spec sheet, canvas mount, highlight, link attributes)
- [x] 6.2 Extend content/navigation/mobile suites for the new sections and links
