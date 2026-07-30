import type { Book } from '../types'

// Books Branden wants to showcase on the shelf, in the order he gave them.
// coverColor approximates each real cover for the spine/back faces and the
// 2D fallback list swatch; coverImage is the real Amazon cover art applied
// to the 3D book's front face (see public/book-covers/, fetched from
// Amazon's product image CDN and spot-checked against each title).
// Branden's Amazon Associates tracking tag (Store ID), shared across the .com
// and .com.au marketplaces - same tag works on both. Every purchase link
// carries it so book clicks earn referral commission.
const ASSOCIATES_TAG = 'brandenimmerz-20'

// Direct Amazon product links (ASINs) with the Associates tag. Domain
// defaults to .com.au (Branden's storefront) since that's what he linked for
// all but one book; pass 'com' for titles only available on the US listing.
function amazonBook(asin: string, domain: 'com' | 'com.au' = 'com.au'): string {
  return `https://www.amazon.${domain}/dp/${asin}?tag=${ASSOCIATES_TAG}`
}

export const books: Book[] = [
  {
    id: 'sql-all-in-one-dummies',
    title: 'SQL All-in-One For Dummies',
    author: 'Allen G. Taylor & Richard Blum',
    coverColor: '#f5c518',
    coverImage: '/book-covers/sql-all-in-one-dummies.jpg',
    amazonUrl: amazonBook('1394242298'),
  },
  {
    id: 'ddia',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    coverColor: '#b0432e',
    coverImage: '/book-covers/ddia.jpg',
    amazonUrl: amazonBook('1449373321'),
  },
  {
    id: 'pragmatic-programmer',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    coverColor: '#3f434c',
    coverImage: '/book-covers/pragmatic-programmer.jpg',
    amazonUrl: amazonBook('0135957052'),
  },
  {
    id: 'clean-architecture',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    coverColor: '#2a4a7b',
    coverImage: '/book-covers/clean-architecture.jpg',
    amazonUrl: amazonBook('0134494164'),
  },
  {
    id: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    coverColor: '#26323f',
    coverImage: '/book-covers/clean-code.jpg',
    amazonUrl: amazonBook('0132350882'),
  },
  {
    id: 'design-patterns-gof',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson & John Vlissides',
    coverColor: '#8a3a3a',
    coverImage: '/book-covers/design-patterns-gof.jpg',
    amazonUrl: amazonBook('0201633612'),
  },
  {
    id: 'cracking-the-coding-interview',
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    coverColor: '#3fa66b',
    coverImage: '/book-covers/cracking-the-coding-interview.jpg',
    amazonUrl: amazonBook('0984782850'),
  },
  {
    id: 'ostep',
    title: 'Operating Systems: Three Easy Pieces',
    author: 'Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
    coverColor: '#e8e2d0',
    coverImage: '/book-covers/ostep.jpg',
    amazonUrl: amazonBook('198508659X'),
  },
  {
    id: 'lean-startup',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    coverColor: '#e8622c',
    coverImage: '/book-covers/lean-startup.jpg',
    amazonUrl: amazonBook('0307887898'),
  },
  {
    id: 'grokking-algorithms',
    title: 'Grokking Algorithms',
    author: 'Aditya Y. Bhargava',
    coverColor: '#1f9e89',
    coverImage: '/book-covers/grokking-algorithms.jpg',
    amazonUrl: amazonBook('1617292230'),
  },
  {
    id: 'ai-robotics-10-lessons',
    title: '10 Short Lessons in Artificial Intelligence and Robotics',
    author: 'Peter J. Bentley',
    coverColor: '#3b6ea5',
    coverImage: '/book-covers/ai-robotics-10-lessons.jpg',
    amazonUrl: amazonBook('1789292166'),
  },
  {
    id: 'istqb-foundations',
    title: 'Foundations of Software Testing: ISTQB Certification',
    author: 'Dorothy Graham, Rex Black, Erik van Veenendaal & Isabel Evans',
    coverColor: '#1f4e79',
    coverImage: '/book-covers/istqb-foundations.jpg',
    amazonUrl: amazonBook('1844803554', 'com'),
  },
]
