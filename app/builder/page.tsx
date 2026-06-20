import PersonalInfo from '@/components/form/PersonalInfo'
import Summary from '@/components/form/Summary'
import Education from '@/components/form/Education'
import Experience from '@/components/form/Experience'
import AdditionalInfo from '@/components/form/AdditionalInfo'
import Link from 'next/link'
import CVPreview from '@/components/preview/CVPreview'
import DownloadPDFButton from '@/components/preview/DownloadPDFButton'
import ATSChecker from '@/components/preview/ATSChecker'

export default function BuilderPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Form Section (Left) */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-border bg-surface">
        <h2 className="text-2xl font-bold mb-4 text-text">CV Details</h2>
        <p className="text-muted mb-6">Fill out your information below.</p>
        
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
              Full Screen
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
