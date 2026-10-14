import type { ExperienceEntry, OrganizationEntry } from '@/types/cv'

const MONTH_MAP: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', mei: '05', may: '05',
  jun: '06', jul: '07', agu: '08', aug: '08', sep: '09', okt: '10',
  oct: '10', nov: '11', des: '12', dec: '12'
}

/**
 * Extracts a comparable YYYYMM number from a date or period fragment.
 * Returns 999999 if the fragment indicates current/present.
 */
function parseDateScore(text?: string, isCurrent?: boolean): { startScore: number; endScore: number; isPresent: boolean } {
  if (isCurrent) {
    return { startScore: 0, endScore: 999999, isPresent: true }
  }

  if (!text) {
    return { startScore: 0, endScore: 0, isPresent: false }
  }

  const lower = text.toLowerCase()
  const isPresent = lower.includes('present') || lower.includes('sekarang')

  // Find 4-digit years
  const yearMatches = [...lower.matchAll(/\b(19\d\d|20\d\d)\b/g)].map(m => parseInt(m[1], 10))

  if (yearMatches.length === 0) {
    return {
      startScore: 0,
      endScore: isPresent ? 999999 : 0,
      isPresent
    }
  }

  // Parse months if available
  const words = lower.split(/[^a-z0-9]+/)
  const foundMonths: string[] = []
  for (const w of words) {
    const prefix = w.slice(0, 3)
    if (MONTH_MAP[prefix]) {
      foundMonths.push(MONTH_MAP[prefix])
    }
  }

  if (isPresent) {
    const startYear = yearMatches[0]
    const startMonth = foundMonths[0] || '01'
    return {
      startScore: startYear * 100 + parseInt(startMonth, 10),
      endScore: 999999,
      isPresent: true
    }
  }

  if (yearMatches.length >= 2) {
    const startYear = yearMatches[0]
    const endYear = yearMatches[1]
    const startMonth = foundMonths[0] || '01'
    const endMonth = foundMonths[1] || '12'
    return {
      startScore: startYear * 100 + parseInt(startMonth, 10),
      endScore: endYear * 100 + parseInt(endMonth, 10),
      isPresent: false
    }
  }

  // Only one year found
  const year = yearMatches[0]
  const month = foundMonths[0] || '01'
  const score = year * 100 + parseInt(month, 10)
  return {
    startScore: score,
    endScore: score,
    isPresent: false
  }
}

/**
 * Sorts Organization entries according to OD-26 Opsi A:
 * Newest end date first; current/present entries at the very top;
 * tie broken by newest start date.
 */
export function sortOrganizations(orgs: OrganizationEntry[]): OrganizationEntry[] {
  return [...orgs].sort((a, b) => {
    // If structured startDate/endDate are available, use them
    let scoreA: { startScore: number; endScore: number; isPresent: boolean }
    let scoreB: { startScore: number; endScore: number; isPresent: boolean }

    if (a.isCurrent || a.startDate || a.endDate) {
      const isPresA = Boolean(a.isCurrent)
      const startNumA = a.startDate ? parseInt(a.startDate.replace('-', ''), 10) : 0
      const endNumA = isPresA ? 999999 : (a.endDate ? parseInt(a.endDate.replace('-', ''), 10) : startNumA)
      scoreA = { startScore: startNumA, endScore: endNumA, isPresent: isPresA }
    } else {
      scoreA = parseDateScore('', false)
    }

    if (b.isCurrent || b.startDate || b.endDate) {
      const isPresB = Boolean(b.isCurrent)
      const startNumB = b.startDate ? parseInt(b.startDate.replace('-', ''), 10) : 0
      const endNumB = isPresB ? 999999 : (b.endDate ? parseInt(b.endDate.replace('-', ''), 10) : startNumB)
      scoreB = { startScore: startNumB, endScore: endNumB, isPresent: isPresB }
    } else {
      scoreB = parseDateScore('', false)
    }

    // 1. Current / Present entries first
    if (scoreA.isPresent && !scoreB.isPresent) return -1
    if (!scoreA.isPresent && scoreB.isPresent) return 1

    // 2. End date newest first
    if (scoreB.endScore !== scoreA.endScore) {
      return scoreB.endScore - scoreA.endScore
    }

    // 3. Start date newest first
    if (scoreB.startScore !== scoreA.startScore) {
      return scoreB.startScore - scoreA.startScore
    }

    return 0
  })
}

/**
 * Sorts Experience entries according to OD-26 Opsi A:
 * Newest end date first; current/present entries at the top;
 * tie broken by newest start date.
 */
export function sortExperiences(experiences: ExperienceEntry[]): ExperienceEntry[] {
  return [...experiences].sort((a, b) => {
    const scoreA = parseDateScore(a.period)
    const scoreB = parseDateScore(b.period)

    // 1. Present entries first
    if (scoreA.isPresent && !scoreB.isPresent) return -1
    if (!scoreA.isPresent && scoreB.isPresent) return 1

    // 2. End date newest first
    if (scoreB.endScore !== scoreA.endScore) {
      return scoreB.endScore - scoreA.endScore
    }

    // 3. Start date newest first
    if (scoreB.startScore !== scoreA.startScore) {
      return scoreB.startScore - scoreA.startScore
    }

    return 0
  })
}

/**
 * Helper to format organization period display string
 */
export function formatOrganizationPeriod(org: OrganizationEntry, isIdLocale: boolean): string {
  if (org.isCurrent) {
    const start = org.startDate || ''
    const presText = isIdLocale ? 'Sekarang' : 'Present'
    return start ? `${start} - ${presText}` : presText
  }
  if (org.startDate && org.endDate) {
    return `${org.startDate} - ${org.endDate}`
  }
  if (org.startDate) {
    return org.startDate
  }
  if (org.endDate) {
    return org.endDate
  }
  return ''
}
