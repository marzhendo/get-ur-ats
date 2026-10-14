'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { cropAndCompressImage } from '@/lib/photo'
import { useCVStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import type { CVPhoto } from '@/types/cv'

interface PhotoCropperProps {
  image: HTMLImageElement
  onSave: (photo: CVPhoto) => void
  onCancel: () => void
}

const CANVAS_WIDTH = 240
const CANVAS_HEIGHT = 320 // 3:4 aspect ratio preview

export default function PhotoCropper({ image, onSave, onCancel }: PhotoCropperProps) {
  const { locale } = useCVStore()
  const lang = t[locale]

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Calculate drawing dimensions and bounds
  const getDrawBounds = useCallback(
    (currentZoom: number, currentPan: { x: number; y: number }) => {
      const baseScale = Math.max(
        CANVAS_WIDTH / image.naturalWidth,
        CANVAS_HEIGHT / image.naturalHeight
      )
      const currentScale = baseScale * currentZoom
      const drawWidth = image.naturalWidth * currentScale
      const drawHeight = image.naturalHeight * currentScale

      const maxPanX = Math.max(0, (drawWidth - CANVAS_WIDTH) / 2)
      const maxPanY = Math.max(0, (drawHeight - CANVAS_HEIGHT) / 2)

      const clampedX = Math.min(maxPanX, Math.max(-maxPanX, currentPan.x))
      const clampedY = Math.min(maxPanY, Math.max(-maxPanY, currentPan.y))

      const drawX = (CANVAS_WIDTH - drawWidth) / 2 + clampedX
      const drawY = (CANVAS_HEIGHT - drawHeight) / 2 + clampedY

      return {
        scale: currentScale,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
        clampedX,
        clampedY,
      }
    },
    [image]
  )

  // Redraw canvas whenever zoom or pan changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { drawX, drawY, drawWidth, drawHeight } = getDrawBounds(zoom, pan)

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)

    // Draw subtle 3x3 rule-of-thirds grid guidelines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 3, 0)
    ctx.lineTo(CANVAS_WIDTH / 3, CANVAS_HEIGHT)
    ctx.moveTo((CANVAS_WIDTH * 2) / 3, 0)
    ctx.lineTo((CANVAS_WIDTH * 2) / 3, CANVAS_HEIGHT)

    ctx.moveTo(0, CANVAS_HEIGHT / 3)
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 3)
    ctx.moveTo(0, (CANVAS_HEIGHT * 2) / 3)
    ctx.lineTo(CANVAS_WIDTH, (CANVAS_HEIGHT * 2) / 3)
    ctx.stroke()
  }, [image, zoom, pan, getDrawBounds])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const nextPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }
    const { clampedX, clampedY } = getDrawBounds(zoom, nextPan)
    setPan({ x: clampedX, y: clampedY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const nextPan = {
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    }
    const { clampedX, clampedY } = getDrawBounds(zoom, nextPan)
    setPan({ x: clampedX, y: clampedY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Zoom change
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    const { clampedX, clampedY } = getDrawBounds(newZoom, pan)
    setPan({ x: clampedX, y: clampedY })
  }

  // Save handler
  const handleSave = () => {
    const { scale, drawX, drawY } = getDrawBounds(zoom, pan)
    // Convert preview canvas coordinates back to original image pixel coordinates
    const sourceCropX = Math.max(0, -drawX / scale)
    const sourceCropY = Math.max(0, -drawY / scale)
    const sourceCropWidth = Math.min(image.naturalWidth - sourceCropX, CANVAS_WIDTH / scale)
    const sourceCropHeight = Math.min(image.naturalHeight - sourceCropY, CANVAS_HEIGHT / scale)

    try {
      const photo = cropAndCompressImage(image, {
        x: sourceCropX,
        y: sourceCropY,
        width: sourceCropWidth,
        height: sourceCropHeight,
      })
      onSave(photo)
    } catch (err) {
      console.error('Error cropping image:', err)
    }
  }

  // Keyboard accessibility (Esc to cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
    >
      <div className="bg-surface border border-border rounded-lg max-w-sm w-full p-6 text-text shadow-xl">
        <h3 className="text-base font-semibold text-text mb-2 text-center">
          {lang.cropPhotoTitle}
        </h3>
        <p className="text-xs text-muted mb-4 text-center">
          {lang.cropInstructions}
        </p>

        {/* Canvas container */}
        <div className="flex justify-center mb-4">
          <div
            className="border-2 border-accent rounded overflow-hidden select-none"
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ touchAction: 'none' }}
            />
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="space-y-1 mb-6">
          <div className="flex justify-between text-xs text-muted">
            <span>{lang.zoom}</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.05"
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
            aria-label={lang.zoom}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border text-sm rounded hover:bg-background text-text"
          >
            {lang.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-accent text-background text-sm font-semibold rounded hover:bg-opacity-90"
          >
            {lang.saveCrop}
          </button>
        </div>
      </div>
    </div>
  )
}
