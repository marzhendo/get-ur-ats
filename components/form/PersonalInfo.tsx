'use client'

import { useCVStore } from '@/lib/store'
import { t } from '@/lib/i18n'

export default function PersonalInfo() {
  const { data, updatePersonal, locale } = useCVStore()
  const lang = t[locale]

  return (
    <section className="mb-8">
      <div className="border-l-2 border-accent pl-3 mb-4">
        <h2 className="text-text font-semibold text-sm uppercase tracking-widest">
          {lang.personalInfo}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={data.personal.name}
          onChange={(e) => updatePersonal({ name: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          placeholder="City, Country"
          value={data.personal.city}
          onChange={(e) => updatePersonal({ city: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={data.personal.phone}
          onChange={(e) => updatePersonal({ phone: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={data.personal.email}
          onChange={(e) => updatePersonal({ email: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          placeholder="LinkedIn Profile"
          value={data.personal.linkedin}
          onChange={(e) => updatePersonal({ linkedin: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          placeholder="Portfolio / Website"
          value={data.personal.portfolio}
          onChange={(e) => updatePersonal({ portfolio: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
      </div>
    </section>
  )
}
