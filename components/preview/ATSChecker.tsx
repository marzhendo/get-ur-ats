'use client'

import { useCVStore } from '@/lib/store'
import { checkATS } from '@/lib/ats-checker'
import { toPlainText } from '@/lib/plain-text'
import { useState, useEffect } from 'react'
import { t } from '@/lib/i18n'

export default function ATSChecker() {
  const { data, locale } = useCVStore()
  const lang = t[locale]
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  
  const result = checkATS(data)

  const handleCopyText = async () => {
    const text = toPlainText(data, locale)
    await navigator.clipboard.writeText(text)
    alert('CV copied to clipboard as plain text!')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-600'
    if (score >= 60) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className={`px-4 py-2 rounded text-sm font-bold text-background ${getScoreColor(result.score)}`}
      >
        {lang.atsScore}: {result.score}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border p-6 rounded max-w-md w-full text-text">
            <h3 className="text-xl font-bold mb-4">ATS Validation Results</h3>
            
            <div className="mb-4">
              <span className={`text-2xl font-bold ${result.passed ? 'text-green-500' : 'text-yellow-500'}`}>
                Score: {result.score}/100
              </span>
            </div>

            {result.warnings.length > 0 ? (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Warnings:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-500 max-h-[300px] overflow-y-auto">
                  {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            ) : (
              <p className="mb-6 text-green-500">Your CV looks great and ATS-friendly!</p>
            )}

            <div className="flex justify-between gap-4">
              <button 
                onClick={handleCopyText}
                className="px-4 py-2 border border-border rounded hover:bg-background"
              >
                {lang.copyPlainText}
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-accent text-background rounded hover:bg-opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
