'use client'

import PersonalInfo from '@/components/form/PersonalInfo'
import Summary from '@/components/form/Summary'
import Education from '@/components/form/Education'
import Experience from '@/components/form/Experience'
import AdditionalInfo from '@/components/form/AdditionalInfo'
import Link from 'next/link'
import CVPreview from '@/components/preview/CVPreview'
import DownloadPDFButton from '@/components/preview/DownloadPDFButton'
import ATSChecker from '@/components/preview/ATSChecker'
import { useCVStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { useEffect, useState } from 'react'

export default function BuilderPage() {
  const { locale, setLocale } = useCVStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const lang = mounted ? t[locale] : t['en']

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Form Section (Left) */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-border bg-surface relative">
        <div className="absolute top-6 right-6 flex items-center space-x-2 text-sm font-bold">
          <button onClick={() => setLocale('en')} className={locale === 'en' ? 'text-accent' : 'text-muted'}>EN</button>
          <span className="text-muted">|</span>
          <button onClick={() => setLocale('id')} className={locale === 'id' ? 'text-accent' : 'text-muted'}>ID</button>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-text">{lang.pageTitle}</h2>
        <p className="text-muted mb-6">{lang.pageSubtitle}</p>
        
        <PersonalInfo />
        <Summary />
        <Education />
        <Experience />
        <AdditionalInfo />
      </div>

      {/* Preview Section (Right) */}
      <div className="w-full md:w-1/2 p-6 bg-background overflow-y-auto hidden md:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">Live Preview</h2>
          <div className="space-x-2 flex items-center gap-2">
            <ATSChecker />
            <DownloadPDFButton />
            <Link href="/preview" className="px-4 py-2 border border-border rounded hover:bg-surface text-sm text-text">
              {lang.fullScreen}
            </Link>
          </div>
        </div>
        
        <div className="flex justify-center">
          <CVPreview />
        </div>
      </div>
    </div>
  )
}
