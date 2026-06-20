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
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form')

  useEffect(() => {
    setMounted(true)
  }, [])

  const lang = mounted ? t[locale] : t['en']

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-b border-border bg-background w-full shrink-0">
        <button 
          onClick={() => setMobileTab('form')} 
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 ${mobileTab === 'form' ? 'border-accent text-text' : 'border-transparent text-muted'}`}
        >
          Form
        </button>
        <button 
          onClick={() => setMobileTab('preview')} 
          className={`flex-1 py-3 text-sm font-bold text-center border-b-2 ${mobileTab === 'preview' ? 'border-accent text-text' : 'border-transparent text-muted'}`}
        >
          Preview
        </button>
      </div>

      {/* Form Section (Left) */}
      <div className={`w-full md:w-1/2 p-6 overflow-y-auto border-r border-border bg-surface relative pb-24 md:pb-6 ${mobileTab === 'preview' ? 'hidden md:block' : 'block'}`}>
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

        {/* Sticky Mobile Bottom Bar (Form Tab Only) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-surface border-t border-border flex items-center justify-between px-6 z-10">
          <DownloadPDFButton />
          <button 
            onClick={() => setMobileTab('preview')}
            className="text-accent font-bold text-sm hover:underline flex items-center gap-1"
          >
            Preview CV &rarr;
          </button>
        </div>
      </div>

      {/* Preview Section (Right) */}
      <div className={`w-full md:w-1/2 p-6 bg-background overflow-y-auto ${mobileTab === 'form' ? 'hidden md:block' : 'block'}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-text">Live Preview</h2>
          <div className="flex flex-wrap items-center gap-2">
            <ATSChecker />
            <DownloadPDFButton />
            <Link href="/preview" className="hidden md:inline-block px-4 py-2 border border-border rounded hover:bg-surface text-sm text-text">
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
