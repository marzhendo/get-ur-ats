'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useCVStore } from '@/lib/store'
import { usePhotoStore } from '@/lib/photo-store'
import { t } from '@/lib/i18n'
import { validatePhotoFile, loadImageFromFile } from '@/lib/photo'
import PhotoCropper from '@/components/form/PhotoCropper'
import type { CVPhoto } from '@/types/cv'

export default function PhotoUploader() {
  const { data, locale } = useCVStore()
  const { photo, setPhoto, clearPhoto } = usePhotoStore()
  const lang = t[locale]

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isStandard = data.mode === 'standard'

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage(null)
    const validation = validatePhotoFile(file, locale === 'id')
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    try {
      const img = await loadImageFromFile(file)
      setSelectedImage(img)
    } catch {
      setErrorMessage(lang.photoLoadError)
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSaveCrop = (croppedPhoto: CVPhoto) => {
    try {
      setPhoto(croppedPhoto)
      setSelectedImage(null)
      setErrorMessage(null)
    } catch {
      setErrorMessage(lang.photoQuotaError)
    }
  }

  const handleCancelCrop = () => {
    setSelectedImage(null)
  }

  const handleRemovePhoto = () => {
    clearPhoto()
    setErrorMessage(null)
  }

  if (!isStandard) {
    return (
      <div className="mb-4 p-3 bg-surface border border-border rounded text-xs text-muted flex items-center justify-between">
        <span>{lang.photoDisabledAts}</span>
        <span className="text-[10px] uppercase font-semibold text-accent px-2 py-0.5 border border-accent/40 rounded">
          ATS Mode
        </span>
      </div>
    )
  }

  return (
    <div className="mb-6 p-4 bg-surface border border-border rounded">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {photo ? (
            <div className="relative w-16 h-21 border border-border rounded overflow-hidden bg-background shrink-0">
              <Image
                src={photo.dataUrl}
                alt="Profile thumbnail"
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-16 h-21 border border-dashed border-border rounded flex flex-col items-center justify-center bg-background/50 text-muted shrink-0">
              <span className="text-xl">📷</span>
              <span className="text-[10px] mt-1">3:4</span>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-text">
              {photo ? lang.photoActiveTitle : lang.photoEmptyTitle}
            </h4>
            <p className="text-xs text-muted mt-0.5">
              {photo ? lang.photoActiveDesc : lang.photoEmptyDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs bg-accent text-background font-medium px-3 py-1.5 rounded hover:bg-opacity-90 transition"
          >
            {photo ? lang.changePhoto : lang.uploadPhoto}
          </button>

          {photo && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-xs text-red-500 hover:text-red-400 font-medium px-2 py-1.5 border border-red-500/30 rounded"
            >
              {lang.removePhoto}
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-500 mt-2 font-medium">{errorMessage}</p>
      )}

      {selectedImage && (
        <PhotoCropper
          image={selectedImage}
          onSave={handleSaveCrop}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  )
}
