import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  isValidHttpsUrl,
  sortCertifications,
} from '../lib/certifications-util'
import type { Certification } from '../types/cv'

describe('Certifications Utility Logic', () => {
  it('should accept valid https URLs', () => {
    assert.strictEqual(isValidHttpsUrl('https://example.com'), true)
    assert.strictEqual(isValidHttpsUrl('https://drive.google.com/file/d/123/view'), true)
    assert.strictEqual(isValidHttpsUrl('https://aws.amazon.com/verification?id=abc'), true)
  })

  it('should reject non-https or dangerous URLs', () => {
    assert.strictEqual(isValidHttpsUrl('http://insecure.com'), false)
    assert.strictEqual(isValidHttpsUrl('javascript:alert(1)'), false)
    assert.strictEqual(isValidHttpsUrl('data:text/html,test'), false)
    assert.strictEqual(isValidHttpsUrl('ftp://example.com'), false)
    assert.strictEqual(isValidHttpsUrl('not-a-url'), false)
  })

  it('should treat empty or undefined URL as valid (optional field)', () => {
    assert.strictEqual(isValidHttpsUrl(''), true)
    assert.strictEqual(isValidHttpsUrl('   '), true)
    assert.strictEqual(isValidHttpsUrl(undefined), true)
  })

  it('should sort certifications newest first, undated at end', () => {
    const certs: Certification[] = [
      {
        id: 'c1',
        name: 'Older Cert',
        issuer: 'Org A',
        issueDate: '2021-03',
      },
      {
        id: 'c2',
        name: 'Undated Cert',
        issuer: 'Org B',
      },
      {
        id: 'c3',
        name: 'Newest Cert',
        issuer: 'Org C',
        issueDate: '2023-09',
      },
    ]

    const sorted = sortCertifications(certs)
    assert.strictEqual(sorted[0].id, 'c3', '2023-09 should be first')
    assert.strictEqual(sorted[1].id, 'c1', '2021-03 should be second')
    assert.strictEqual(sorted[2].id, 'c2', 'Undated cert should be last')
  })
})
