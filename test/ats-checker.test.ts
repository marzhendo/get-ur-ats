import { describe, it } from 'node:test'
import assert from 'node:assert'
import { checkATS } from '../lib/ats-checker'
import type { CVData } from '../types/cv'

function createBaseCV(patch: Partial<CVData> = {}): CVData {
  return {
    mode: 'ats',
    personal: {
      name: 'John Doe',
      city: 'Jakarta',
      phone: '+62812345678',
      email: 'john@example.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      portfolio: 'https://johndoe.dev',
    },
    summary: 'A short summary of professional experience and technical skills.',
    education: {
      institution: 'University of Indonesia',
      degree: 'B.S. Computer Science',
      period: '2018 - 2022',
      gpa: '3.8',
      coursework: '',
      activities: '',
    },
    experience: [
      {
        id: '1',
        company: 'Tech Corp',
        title: 'Software Engineer',
        period: '2022 - Present',
        bullets: ['Built scalable web applications and APIs in TypeScript.'],
      },
    ],
    organizations: [],
    certifications: [],
    additional: {
      technicalSkills: ['TypeScript', 'React'],
      softSkills: ['Teamwork'],
      certifications: [],
      achievements: [],
    },
    ...patch,
  }
}

describe('ATS Checker Logic', () => {
  it('should pass with 100 score for a clean standard CV', () => {
    const cv = createBaseCV()
    const result = checkATS(cv)
    assert.strictEqual(result.passed, true)
    assert.strictEqual(result.score >= 80, true)
  })

  it('should emit warning in Standard Mode (FR-X2)', () => {
    const cv = createBaseCV({ mode: 'standard' })
    const result = checkATS(cv)
    const hasStandardWarning = result.warnings.some((w) =>
      w.includes('Standard Mode is active')
    )
    assert.strictEqual(hasStandardWarning, true)
  })

  it('should validate organization entries for required name and role', () => {
    const cv = createBaseCV({
      organizations: [
        {
          id: 'o1',
          organization: '',
          role: 'President',
          startDate: '2021',
          endDate: '2022',
          isCurrent: false,
          bullets: ['Organized events'],
        },
      ],
    })
    const result = checkATS(cv)
    const hasOrgWarning = result.warnings.some((w) =>
      w.includes('Organization entry 1 is missing required organization name or role')
    )
    assert.strictEqual(hasOrgWarning, true)
  })

  it('should validate certification URLs for https requirement', () => {
    const cv = createBaseCV({
      certifications: [
        {
          id: 'c1',
          name: 'Cert A',
          issuer: 'Issuer A',
          url: 'http://insecure.com',
        },
      ],
    })
    const result = checkATS(cv)
    const hasUrlWarning = result.warnings.some((w) =>
      w.includes('invalid or insecure URL')
    )
    assert.strictEqual(hasUrlWarning, true)
  })

  it('should warn when estimated page count exceeds 2 pages (OD-21)', () => {
    // Generate many experience bullets to simulate a 3+ page CV
    const longExperience = Array.from({ length: 12 }, (_, i) => ({
      id: `exp-${i}`,
      company: `Big Enterprise Corporation #${i + 1}`,
      title: `Senior Principal Architect & Lead Infrastructure Software Systems Engineer #${i + 1}`,
      period: '2020 - 2024',
      bullets: [
        'Spearheaded enterprise infrastructure modernization across distributed cloud platforms.',
        'Architected high-throughput data pipelines processing millions of events daily.',
        'Mentored junior and mid-level engineering teams on clean code standards and automated CI/CD testing.',
        'Implemented distributed consensus algorithms and high-availability disaster recovery topologies.',
      ],
    }))

    const cv = createBaseCV({ experience: longExperience })
    const result = checkATS(cv)
    const hasLengthWarning = result.warnings.some((w) =>
      w.includes('CV length exceeds 2 pages')
    )
    assert.strictEqual(hasLengthWarning, true)
  })
})
