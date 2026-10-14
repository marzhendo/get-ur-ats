import { describe, it } from 'node:test'
import assert from 'node:assert'
import { migrateCVState } from '../lib/store'

describe('Store v1 to v2 Migration Logic', () => {
  it('should migrate v1 data without loss and inject v2 defaults', () => {
    const legacyV1State = {
      locale: 'en',
      data: {
        personal: {
          name: 'Legacy User',
          city: 'Bandung',
          phone: '0812345',
          email: 'legacy@example.com',
          linkedin: '',
          portfolio: '',
        },
        summary: 'Legacy summary text.',
        education: {
          institution: 'ITB',
          degree: 'Informatics',
          gpa: '3.9',
          period: '2016-2020',
          coursework: 'Databases',
          activities: 'Student Council',
        },
        experience: [
          {
            id: 'old-exp-1',
            company: 'Startup Indonesia',
            title: 'Junior Engineer',
            period: '2020-2022',
            bullets: ['Built features'],
          },
        ],
        additional: {
          technicalSkills: ['Go', 'Docker'],
          softSkills: ['Communication'],
          certifications: ['Old text cert 1', 'Old text cert 2'],
          achievements: ['Hackathon finalist'],
        },
      },
    }

    // Migrate from version 1 (or undefined version)
    const migrated = migrateCVState(legacyV1State, 1)

    // Verify v2 fields exist
    assert.strictEqual(migrated.data.mode, 'ats', 'Default mode should be ats')
    assert.deepStrictEqual(migrated.data.organizations, [], 'Organizations should default to []')
    assert.deepStrictEqual(migrated.data.certifications, [], 'New structured certs should default to []')

    // Verify v1 legacy data is completely intact (non-destructive)
    assert.strictEqual(migrated.data.personal.name, 'Legacy User')
    assert.strictEqual(migrated.data.education.activities, 'Student Council')
    assert.strictEqual(migrated.data.experience.length, 1)
    assert.strictEqual(migrated.data.experience[0].company, 'Startup Indonesia')
    assert.deepStrictEqual(migrated.data.additional.certifications, ['Old text cert 1', 'Old text cert 2'])
  })

  it('should return initialData safely when persisted state is corrupted', () => {
    const corruptedState = null
    const result = migrateCVState(corruptedState, 0)
    assert.strictEqual(result.data.mode, 'ats')
    assert.strictEqual(result.data.personal.name, '')
    assert.strictEqual(result.locale, 'en')
  })
})
