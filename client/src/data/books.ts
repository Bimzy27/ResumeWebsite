import type { Book } from '../types'

// Branden's real top five books, in the order he presents them in his
// "Top 5 Books" video. Cover colors approximate each real cover for the
// proxy 3D books.
// Branden's Amazon Associates tracking tag (Store ID). Every purchase link
// carries it so book clicks earn referral commission.
const ASSOCIATES_TAG = 'brandenimmerz-20'

// Direct Amazon product links (ISBN-10 ASINs) with the Associates tag.
function amazonBook(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${ASSOCIATES_TAG}`
}

export const books: Book[] = [
  {
    id: 'cracking-the-coding-interview',
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    coverColor: '#3fa66b',
    amazonUrl: amazonBook('0984782850'),
  },
  {
    id: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    coverColor: '#26323f',
    amazonUrl: amazonBook('0132350882'),
  },
  {
    id: 'clean-architecture',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    coverColor: '#2a4a7b',
    amazonUrl: amazonBook('0134494164'),
  },
  {
    id: 'ddia',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    coverColor: '#b0432e',
    amazonUrl: amazonBook('1449373321'),
  },
  {
    id: 'pragmatic-programmer',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    coverColor: '#3f434c',
    amazonUrl: amazonBook('0135957052'),
  },
]
