import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CVPhoto } from '@/types/cv'

interface PhotoStore {
  photo: CVPhoto | null
  setPhoto: (photo: CVPhoto) => void
  clearPhoto: () => void
}

export const usePhotoStore = create<PhotoStore>()(
  persist(
    (set) => ({
      photo: null,
      setPhoto: (photo) => {
        try {
          set({ photo })
        } catch (e) {
          console.error('Failed to set photo in store:', e)
        }
      },
      clearPhoto: () => {
        try {
          set({ photo: null })
        } catch (e) {
          console.error('Failed to clear photo in store:', e)
        }
      },
    }),
    {
      name: 'ats-cv-photo-v1',
    }
  )
)
