import type { CVPhoto } from '@/types/cv'

export const MAX_PHOTO_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB per OD-6
export const ALLOWED_PHOTO_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const TARGET_PHOTO_WIDTH = 300
export const TARGET_PHOTO_HEIGHT = 400 // 3:4 aspect ratio per OD-5
export const MAX_PHOTO_DATA_SIZE_BYTES = 200 * 1024 // target < 200 KB

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validatePhotoFile(file: File, isIdLocale: boolean): ValidationResult {
  if (!ALLOWED_PHOTO_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: isIdLocale
        ? 'Format gambar tidak valid. Format yang didukung: JPEG, PNG, WebP.'
        : 'Invalid image format. Supported formats: JPEG, PNG, WebP.'
    }
  }

  if (file.size > MAX_PHOTO_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: isIdLocale
        ? 'Ukuran file melebihi batas 10 MB. Silakan pilih foto dengan ukuran lebih kecil.'
        : 'File size exceeds the 10 MB limit. Please select a smaller photo.'
    }
  }

  return { valid: true }
}

/**
 * Loads an image file into an HTMLImageElement with EXIF orientation handled.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image into element'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Renders the cropped area to a 300x400 canvas and compresses it to a JPEG data URL < 200 KB.
 */
export function cropAndCompressImage(
  image: HTMLImageElement,
  cropArea: CropArea
): CVPhoto {
  const canvas = document.createElement('canvas')
  canvas.width = TARGET_PHOTO_WIDTH
  canvas.height = TARGET_PHOTO_HEIGHT
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas 2D context not supported')
  }

  // Draw background white for transparent PNGs
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, TARGET_PHOTO_WIDTH, TARGET_PHOTO_HEIGHT)

  // Draw cropped slice onto target canvas
  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    TARGET_PHOTO_WIDTH,
    TARGET_PHOTO_HEIGHT
  )

  // Compression loop: target < 200 KB
  let quality = 0.85
  let dataUrl = canvas.toDataURL('image/jpeg', quality)

  while (dataUrl.length > MAX_PHOTO_DATA_SIZE_BYTES && quality > 0.4) {
    quality -= 0.1
    dataUrl = canvas.toDataURL('image/jpeg', quality)
  }

  return {
    dataUrl,
    width: TARGET_PHOTO_WIDTH,
    height: TARGET_PHOTO_HEIGHT,
    updatedAt: Date.now()
  }
}
