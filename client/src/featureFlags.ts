// Temporary feature flags. Each flag is the single switch for its feature:
// the app template, header nav, and e2e specs all read from here, so
// restoring a feature is a one-line flip back to true.

// Temporarily hides the Device and Bookshelf sections (the page row and the
// header nav links). Components, data, and e2e specs stay in the tree; the
// specs skip themselves while this is false.
export const SHOW_DEVICE_BOOKSHELF = false
