import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  sortOrganizations,
  sortExperiences,
  formatOrganizationPeriod,
} from '../lib/date-sorting'
import type { OrganizationEntry, ExperienceEntry } from '../types/cv'

describe('Date Sorting Logic (OD-26 Opsi A)', () => {
  it('should sort organization entries with Present/Current at top, then newest end date', () => {
    const orgs: OrganizationEntry[] = [
      {
        id: '1',
        organization: 'Past Org A',
        role: 'Member',
        startDate: '2020-01',
        endDate: '2021-06',
        isCurrent: false,
        bullets: [],
      },
      {
        id: '2',
        organization: 'Active Org B',
        role: 'Lead',
        startDate: '2022-01',
        endDate: '',
        isCurrent: true,
        bullets: [],
      },
      {
        id: '3',
        organization: 'Recent Past Org C',
        role: 'Coordinator',
        startDate: '2021-01',
        endDate: '2023-05',
        isCurrent: false,
        bullets: [],
      },
    ]

    const sorted = sortOrganizations(orgs)
    assert.strictEqual(sorted[0].id, '2', 'Currently active entry should be first')
    assert.strictEqual(sorted[1].id, '3', 'Newer end date 2023-05 should be second')
    assert.strictEqual(sorted[2].id, '1', 'Older end date 2021-06 should be last')
  })

  it('should break ties in end date with newest start date', () => {
    const orgs: OrganizationEntry[] = [
      {
        id: '1',
        organization: 'Org A',
        role: 'Lead',
        startDate: '2021-01',
        endDate: '2023-12',
        isCurrent: false,
        bullets: [],
      },
      {
        id: '2',
        organization: 'Org B',
        role: 'Advisor',
        startDate: '2022-06',
        endDate: '2023-12',
        isCurrent: false,
        bullets: [],
      },
    ]

    const sorted = sortOrganizations(orgs)
    assert.strictEqual(sorted[0].id, '2', 'Newer start date should win tie break')
    assert.strictEqual(sorted[1].id, '1')
  })

  it('should sort professional experience entries with Present at the top', () => {
    const exps: ExperienceEntry[] = [
      {
        id: 'e1',
        company: 'Old Company',
        title: 'Developer',
        period: '2019 - 2021',
        bullets: [],
      },
      {
        id: 'e2',
        company: 'Current Company',
        title: 'Senior Developer',
        period: '2022 - Present',
        bullets: [],
      },
      {
        id: 'e3',
        company: 'Intermediate Company',
        title: 'Developer II',
        period: '2021 - 2022',
        bullets: [],
      },
    ]

    const sorted = sortExperiences(exps)
    assert.strictEqual(sorted[0].id, 'e2', 'Present experience should be first')
    assert.strictEqual(sorted[1].id, 'e3', '2022 end should be second')
    assert.strictEqual(sorted[2].id, 'e1', '2021 end should be third')
  })

  it('should format organization period correctly in EN and ID locales', () => {
    const currentOrg: OrganizationEntry = {
      id: 'o1',
      organization: 'Tech Org',
      role: 'Lead',
      startDate: '2022-08',
      endDate: '',
      isCurrent: true,
      bullets: [],
    }

    assert.strictEqual(formatOrganizationPeriod(currentOrg, false), '2022-08 - Present')
    assert.strictEqual(formatOrganizationPeriod(currentOrg, true), '2022-08 - Sekarang')

    const pastOrg: OrganizationEntry = {
      id: 'o2',
      organization: 'Past Org',
      role: 'Staff',
      startDate: '2021-01',
      endDate: '2022-06',
      isCurrent: false,
      bullets: [],
    }

    assert.strictEqual(formatOrganizationPeriod(pastOrg, false), '2021-01 - 2022-06')
  })
})
