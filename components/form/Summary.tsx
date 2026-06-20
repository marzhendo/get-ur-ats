'use client'

import { useCVStore } from '@/lib/store'
import { t } from '@/lib/i18n'

export default function Summary() {
  const { data, updateSummary, locale } = useCVStore()
  const lang = t[locale]

  return (
    <section className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-text border-b border-border pb-2">{lang.professionalSummary}</h3>
      <textarea
        placeholder="A brief summary of your professional background and goals..."
        value={data.summary}
        onChange={(e) => updateSummary(e.target.value)}
        className="w-full p-2 bg-background border border-border rounded text-text focus:border-accent outline-none min-h-[120px]"
      />
    </section>
  )
}
