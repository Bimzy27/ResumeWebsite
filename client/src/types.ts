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
  handle?