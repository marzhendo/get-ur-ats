'use client'

import { useCVStore } from '@/lib/store'
import { t } from '@/lib/i18n'

export default function Summary() {
  const { data, updateSummary, locale } = useCVStore()
  const lang = t[locale]

  return (
    <section className="mb-8">
      <div className="border-l-2 border-accent pl-3 mb-4">
        <h2 className="text-text font-semibold text-sm uppercase tracking-widest">
          {lang.professionalSummary}
        </h2>
      </div>
      <textarea
        placeholder="A brief summary of your professional background and goals..."
        value={data.summary}
        onChange={(e) => updateSummary(e.target.value)}
        className="w-full p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none min-h-[120px]"
      />
    </section>
  )
}
