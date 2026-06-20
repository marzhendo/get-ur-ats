'use client'

import dynamic from 'next/dynamic'
import { CVDocument } from '@/lib/pdf'
import { useCVStore } from '@/lib/store'
import { useEffect, useState } from 'react'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false }
)

export default function DownloadPDFButton() {
  const { data } = useCVStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="px-4 py-2 bg-accent text-background rounded text-sm font-bold opacity-50 cursor-not-allowed">
        Loading...
      </button>
    )
  }

  const fileName = `CV_${data.personal.name || 'Untitled'}.pdf`.replace(/\s+/g, '_')

  return (
    <PDFDownloadLink document={<CVDocument data={data} />} fileName={fileName}>
      {({ loading }) => (
        <button 
          disabled={loading}
          className="px-4 py-2 bg-accent text-background rounded text-sm font-bold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Download PDF'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
