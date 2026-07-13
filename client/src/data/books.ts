import type { Book } from '../types'

// Books shown on the Bookshelf section's rotating carousel.
// PLACEHOLDER DATA: Branden will supply the real reading list (and affiliate
// purchase links) in a follow-up task; swap these entries then. amazonUrl is
// a plain Amazon search link until affiliate links exist.
function amazonSearch(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
}

export const books: Book[] = [
  {
    id: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    coverColor: '#3d6ea5',
    amazonUrl: amazonSearch('Clean Code Robert Martin'),
  },
  {
    id: 'pragmatic-programmer',
    title: 'The Pragmatic Programmer',
    author: 'Hunt & Thomas',
    coverColor: '#2f2f3e',
    amazonUrl: amazonSearch('The Pragmatic Programmer'),
  },
  {
    id: 'ddia',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    coverColor: '#b0533a',
    amazonUrl: amazonSearch('Designing Data-Intensive Applications'),
  },
  {
    id: 'refactoring',
    title: 'Refactoring',
    author: 'Martin Fowler',
    coverColor: '#5b3d8f',
    amazonUrl: amazonSearch('Refactoring Martin Fowler'),
  },
  {
    id: 'phoenix-project',
    title: 'The Phoenix Project',
    author: 'Gene Kim',
    coverColor: '#1f6f5c',
    amazonUrl: amazonSearch('The Phoenix Project Gene Kim'),
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverColor: '#c9a13b',
    amazonUrl: amazonSearch('Atomic Habits James Clear'),
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverColor: '#8a3b4a',
    amazonUrl: amazonSearch('Deep Work Cal Newport'),
  },
  {
    id: 'mythical-man-month',
    title: 'The Mythical Man-Month',
    author: 'Frederick P. Brooks Jr.',
    coverColor: '#46628a',
    amazonUrl: amazonSearch('The Mythical Man-Month'),
  },
]
