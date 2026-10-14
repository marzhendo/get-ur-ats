// types/cv.ts
export type CVMode = 'ats' | 'standard'

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate?: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface CVPhoto {
  dataUrl: string
  width: number
  height: number
  updatedAt: number
}

export interface OrganizationEntry {
  id: string
  organization: string
  role: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  bullets: string[]
}

export interface PersonalInfo {
  name: string
  city: string
  phone: string
  email: string
  linkedin: string
  portfolio: string
}

export interface Education {
  institution: string
  degree: string
  gpa: string
  period: string
  coursework: string
  activities: string
}

export interface ExperienceEntry {
  id: string
  title: string
  company: string
  period: string
  bullets: string[]
}

export interface AdditionalInfo {
  certifications: string[]
  achievements: string[]
  technicalSkills: string[]
  softSkills: string[]
}

export interface CVData {
  mode: CVMode
  personal: PersonalInfo
  summary: string
  education: Education
  experience: ExperienceEntry[]
  organizations: OrganizationEntry[]
  certifications: Certification[]
  additional: AdditionalInfo
}

