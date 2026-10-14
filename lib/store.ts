import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  CVData, 
  CVMode, 
  Certification, 
  OrganizationEntry, 
  PersonalInfo, 
  Education, 
  ExperienceEntry, 
  AdditionalInfo 
} from '@/types/cv'
import type { Locale } from '@/lib/i18n'

interface CVStore {
  data: CVData
  locale: Locale
  setLocale: (locale: Locale) => void
  setMode: (mode: CVMode) => void
  updatePersonal: (patch: Partial<PersonalInfo>) => void
  updateSummary: (summary: string) => void
  updateEducation: (patch: Partial<Education>) => void
  addExperience: (entry: ExperienceEntry) => void
  updateExperience: (id: string, patch: Partial<ExperienceEntry>) => void
  removeExperience: (id: string) => void
  addOrganization: (entry: OrganizationEntry) => void
  updateOrganization: (id: string, patch: Partial<OrganizationEntry>) => void
  removeOrganization: (id: string) => void
  addCertification: (cert: Certification) => void
  updateCertification: (id: string, patch: Partial<Certification>) => void
  removeCertification: (id: string) => void
  updateAdditional: (patch: Partial<AdditionalInfo>) => void
}

export const initialData: CVData = {
  mode: 'ats',
  personal: { name: '', city: '', phone: '', email: '', linkedin: '', portfolio: '' },
  summary: '',
  education: { institution: '', degree: '', gpa: '', period: '', coursework: '', activities: '' },
  experience: [],
  organizations: [],
  certifications: [],
  additional: { certifications: [], achievements: [], technicalSkills: [], softSkills: [] }
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      data: initialData,
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      setMode: (mode) =>
        set((state) => ({ data: { ...state.data, mode } })),
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
      addOrganization: (entry) =>
        set((state) => ({ 
          data: { ...state.data, organizations: [...(state.data.organizations || []), entry] } 
        })),
      updateOrganization: (id, patch) =>
        set((state) => ({
          data: {
            ...state.data,
            organizations: (state.data.organizations || []).map((org) => 
              org.id === id ? { ...org, ...patch } : org
            ),
          },
        })),
      removeOrganization: (id) =>
        set((state) => ({
          data: { 
            ...state.data, 
            organizations: (state.data.organizations || []).filter((org) => org.id !== id) 
          },
        })),
      addCertification: (cert) =>
        set((state) => ({ 
          data: { ...state.data, certifications: [...(state.data.certifications || []), cert] } 
        })),
      updateCertification: (id, patch) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: (state.data.certifications || []).map((c) => 
              c.id === id ? { ...c, ...patch } : c
            ),
          },
        })),
      removeCertification: (id) =>
        set((state) => ({
          data: { 
            ...state.data, 
            certifications: (state.data.certifications || []).filter((c) => c.id !== id) 
          },
        })),
      updateAdditional: (patch) =>
        set((state) => ({ data: { ...state.data, additional: { ...state.data.additional, ...patch } } })),
    }),
    {
      name: 'ats-cv-builder-v1',
      version: 2,
      migrate: (persistedState: unknown, version: number) =>
        migrateCVState(persistedState, version),
    }
  )
)

export function migrateCVState(persistedState: unknown, version: number) {
  try {
    const state = (persistedState || {}) as { data?: Partial<CVData>; locale?: Locale }
    if (!version || version < 2) {
      const oldData = state.data || {}
      const migratedData: CVData = {
        ...initialData,
        ...oldData,
        mode: oldData.mode || 'ats',
        personal: { ...initialData.personal, ...(oldData.personal || {}) },
        education: { ...initialData.education, ...(oldData.education || {}) },
        experience: Array.isArray(oldData.experience) ? oldData.experience : [],
        organizations: Array.isArray(oldData.organizations) ? oldData.organizations : [],
        certifications: Array.isArray(oldData.certifications) ? oldData.certifications : [],
        additional: {
          ...initialData.additional,
          ...(oldData.additional || {}),
          certifications: Array.isArray(oldData.additional?.certifications)
            ? oldData.additional.certifications
            : [],
          achievements: Array.isArray(oldData.additional?.achievements)
            ? oldData.additional.achievements
            : [],
          technicalSkills: Array.isArray(oldData.additional?.technicalSkills)
            ? oldData.additional.technicalSkills
            : [],
          softSkills: Array.isArray(oldData.additional?.softSkills)
            ? oldData.additional.softSkills
            : [],
        },
      }
      return {
        ...state,
        locale: state.locale || 'en',
        data: migratedData,
      }
    }
    return state as CVStore
  } catch (e) {
    console.error('Migration failed, fallback to initial state:', e)
    return {
      data: initialData,
      locale: 'en',
    } as CVStore
  }
}

