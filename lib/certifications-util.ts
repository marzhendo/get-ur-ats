import type { Certification } from '@/types/cv'

export function sortCertifications(certs: Certification[]): Certification[] {
  return [...certs].sort((a, b) => {
    const dateA = a.issueDate ? a.issueDate.trim() : ''
    const dateB = b.issueDate ? b.issueDate.trim() : ''

    if (dateA && dateB) {
      return dateB.localeCompare(dateA)
    }
    if (dateA && !dateB) return -1
    if (!dateA && dateB) return 1
    return 0
  })
}

export function isValidHttpsUrl(urlString?: string): boolean {
  if (!urlString || !urlString.trim()) return true
  try {
    const url = new URL(urlString.trim())
    return url.protocol === 'https:'
  } catch {
    return false
  }
}
