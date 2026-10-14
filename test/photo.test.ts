import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  validatePhotoFile,
  MAX_PHOTO_FILE_SIZE_BYTES,
  ALLOWED_PHOTO_MIME_TYPES,
} from '../lib/photo'

describe('Photo Validation Logic (OD-6)', () => {
  it('should accept valid image types under 10 MB', () => {
    ALLOWED_PHOTO_MIME_TYPES.forEach((mime) => {
      const mockFile = {
        name: `test.${mime.split('/')[1]}`,
        type: mime,
        size: 5 * 1024 * 1024, // 5 MB
      } as File

      const result = validatePhotoFile(mockFile, false)
      assert.strictEqual(result.valid, true, `Mime type ${mime} should be valid`)
    })
  })

  it('should reject files exceeding 10 MB limit', () => {
    const oversizedFile = {
      name: 'large.jpg',
      type: 'image/jpeg',
      size: MAX_PHOTO_FILE_SIZE_BYTES + 1024, // > 10 MB
    } as File

    const resultEN = validatePhotoFile(oversizedFile, false)
    assert.strictEqual(resultEN.valid, false)
    assert.match(resultEN.error || '', /10 MB/)

    const resultID = validatePhotoFile(oversizedFile, true)
    assert.strictEqual(resultID.valid, false)
    assert.match(resultID.error || '', /10 MB/)
  })

  it('should reject unsupported MIME types', () => {
    const invalidFiles = [
      { name: 'document.pdf', type: 'application/pdf', size: 1024 },
      { name: 'icon.svg', type: 'image/svg+xml', size: 1024 },
      { name: 'animated.gif', type: 'image/gif', size: 1024 },
    ]

    invalidFiles.forEach((f) => {
      const result = validatePhotoFile(f as unknown as File, false)
      assert.strictEqual(result.valid, false, `${f.type} should be rejected`)
    })
  })
})
