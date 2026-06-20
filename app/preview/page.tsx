import Link from 'next/link'

import CVPreview from '@/components/preview/CVPreview'

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center">
      <div className="w-full max-w-[816px] flex justify-between items-center mb-6">
        <Link href="/builder" className="text-accent hover:underline font-medium">
          &larr; Back to Builder
        </Link>
        <h1 className="text-xl font-bold text-text">Full Preview</h1>
      </div>
      
      <CVPreview />
    </div>
  )
}
