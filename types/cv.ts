// types/cv.ts
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
  personal: PersonalInfo
  summary: string
  education: Education
  experience: ExperienceEntry[]
  additional: AdditionalInfo
}
