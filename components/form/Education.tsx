'use client'

import { useCVStore } from '@/lib/store'
import { t } from '@/lib/i18n'

export default function Education() {
  const { data, updateEducation, locale } = useCVStore()
  const lang = t[locale]

  return (
    <section className="mb-8">
      <div className="border-l-2 border-accent pl-3 mb-4">
        <h2 className="text-text font-semibold text-sm uppercase tracking-widest">
          {lang.education}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Institution Name"
          value={data.education.institution}
          onChange={(e) => updateEducation({ institution: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          placeholder="Degree"
          value={data.education.degree}
          onChange={(e) => updateEducation({ degree: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          placeholder="GPA"
          value={data.education.gpa}
          onChange={(e) => updateEducation({ gpa: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          placeholder="Period (e.g. Aug 2019 - Jul 2023)"
          value={data.education.period}
          onChange={(e) => updateEducation({ period: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Relevant Coursework"
          value={data.education.coursework}
          onChange={(e) => updateEducation({ coursework: e.target.value })}
          className="w-full p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          placeholder="Activities and Societies"
          value={data.education.activities}
          onChange={(e) => updateEducation({ activities: e.target.value })}
          className="w-full p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
      </div>
    </section>
  )
}
