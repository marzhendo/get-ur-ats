import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CVData, PersonalInfo, Education, ExperienceEntry, AdditionalInfo } from '@/types/cv'

interface CVStore {
  data: CVData
  updatePersonal: (patch: Partial<PersonalInfo>) => void
  updateSummary: (summary: string) => void
  updateEducation: (patch: Partial<Education>) => void
  addExperience: (entry: ExperienceEntry) => void
  updateExperience: (id: string, patch: Partial<ExperienceEntry>) => void
  removeExperience: (id: string) => void
  updateAdditional: (patch: Partial<AdditionalInfo>) => void
}

const initialData: CVData = {
  personal: { name: '', city: '', phone: '', email: '', linkedin: '', portfolio: '' },
  summary: '',
  education: { institution: '', degree: '', gpa: '', period: '', coursework: '', activities: '' },
  experience: [],
  additional: { certifications: [], achievements: [], technicalSkills: [], softSkills: [] }
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      data: initialData,
      updatePersonal: (patch) =>
        set((state) => ({ data: { ...state.data, personal: { ...state.data.personal, ...patch } } })),
      updateSummary: (summary) =>
        set((state) => ({ data: { ...state.data, summary } })),
      updateEducation: (patch) =>
        set((state) => ({ data: { ...state.data, education: { ...state.data.education, ...patch } } })),
      addExperience: (entry) =>
        set((state) => ({ data: { ...state.data, experience: [...state.data.experience, entry] } })),
      updateExperience: (id, patch) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          data: { ...state.data, experience: state.data.experience.filter((e) => e.id !== id) },
        })),
      updateAdditional: (patch) =>
        set((state) => ({ data: { ...state.data, additional: { ...state.data.additional, ...patch } } })),
    }),
    {
      name: 'ats-cv-builder-v1',
    }
  )
)
