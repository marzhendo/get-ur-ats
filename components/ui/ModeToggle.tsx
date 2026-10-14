'use client'

import { useCVStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import type { CVMode } from '@/types/cv'

export default function ModeToggle() {
  const { data, setMode, locale } = useCVStore()
  const lang = t[locale]
  const currentMode = data.mode || 'ats'

  const handleSelectMode = (mode: CVMode) => {
    setMode(mode)
  }

  return (
    <div className="mb-6 p-4 rounded border border-border bg-background">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {lang.mode}
        </span>
        <span className="text-xs text-muted">
          {currentMode === 'ats' ? lang.modeDescriptionAts : lang.modeDescriptionStandard}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 bg-surface p-1 rounded border border-border">
        <button
          type="button"
          onClick={() => handleSelectMode('ats')}
          className={`py-2 px-3 text-xs font-bold rounded transition-colors ${
            currentMode === 'ats'
              ? 'bg-accent text-background shadow-sm'
              : 'text-muted hover:text-text'
          }`}
          aria-pressed={currentMode === 'ats'}
        >
          {lang.atsMode}
        </button>
        <button
          type="button"
          onClick={() => handleSelectMode('standard')}
          className={`py-2 px-3 text-xs font-bold rounded transition-colors ${
            currentMode === 'standard'
              ? 'bg-accent text-background shadow-sm'
              : 'text-muted hover:text-text'
          }`}
          aria-pressed={currentMode === 'standard'}
        >
          {lang.standardMode}
        </button>
      </div>
    </div>
  )
}
