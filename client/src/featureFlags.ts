// Temporary feature flags. Each flag is the single switch for its feature:
// the app template, header nav, and e2e specs all read from here, so
// restoring a feature is a one-line flip back to true.

// Temporarily hides the Device section (the 3D PC build and its spec sheet):
// the page row and, were there one, the header nav link. Components, data, and
// e2e specs stay in the tree; the specs skip themselves while this is false.
export const SHOW_DEVICE = false

// The same switch for the Bookshelf section. Kept separate from SHOW_DEVICE so
// either section can be shown without the other.
export const SHOW_BOOKSHELF = true
