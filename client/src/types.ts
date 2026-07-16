export interface ContactInfo {
  email: string
  phone: string
  location: string
  linkedIn: string
}

export interface Strength {
  title: string
  description: string
}

export interface EducationEntry {
  degree: string
  institution: string
  period: string
}

export interface Profile {
  name: string
  title: string
  summary: string
  contact: ContactInfo
  skills: string[]
  strengths: Strength[]
  education: EducationEntry[]
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  period: string
  highlights: string[]
  image?: string
  imageAlt?: string
}

export interface ProjectLinks {
  repo?: string
  demo?: string
}

export interface ProjectAction {
  label: string
  url: string
  variant?: 'primary' | 'secondary'
}

export interface ProjectMedia {
  // 'youtube' = click-to-play video embed, 'playstore' = Google Play block,
  // 'youtube-channel' = channel link block, 'image' = static screenshot.
  type: 'youtube' | 'playstore' | 'youtube-channel' | 'image'
  videoId?: string
  url?: string
  handle?: string
  src?: string
  alt?: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  media?: ProjectMedia
  actions?: ProjectAction[]
  links?: ProjectLinks
}

export interface DevicePart {
  id: string
  // Short part label shown in the specs list (e.g. "CPU", "GPU").
  label: string
  // The actual spec line for this part.
  spec: string
}

export interface Book {
  id: string
  title: string
  author: string
  // Cover color for the proxy 3D book (hex string, e.g. '#7c3aed').
  coverColor: string
  // Purchase link: a direct Amazon product page. Gains Branden's Associates
  // tag once his affiliate account exists (see data/books.ts).
  amazonUrl: string
}

export interface RecommendationEntry {
  id: string
  name: string
  title: string
  relationship: string
  quote: string
  linkedIn: string
}

export interface ContactSubmission {
  name: string
  email: string
  message: string
}

export interface ContactResponse {
  success: boolean
  message: string
}
