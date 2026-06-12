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
}

export interface ProjectLinks {
  repo?: string
  demo?: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  links: ProjectLinks
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
