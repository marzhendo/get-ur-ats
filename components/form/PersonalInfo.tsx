'use client'

import { useCVStore } from '@/lib/store'

export default function PersonalInfo() {
  const { data, updatePersonal } = useCVStore()

  return (
    <section className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-text border-b border-border pb-2">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={data.personal.name}
          onChange={(e) => updatePersonal({ name: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-accent outline-none"
        />
        <input
          type="text"
          placeholder="City, Country"
          value={data.personal.city}
          onChange={(e) => updatePersonal({ city: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-accent outline-none"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={data.personal.phone}
          onChange={(e) => updatePersonal({ phone: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-accent outline-none"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={data.personal.email}
          onChange={(e) => updatePersonal({ email: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-accent outline-none"
        />
        <input
          type="text"
          placeholder="LinkedIn Profile"
          value={data.personal.linkedin}
          onChange={(e) => updatePersonal({ linkedin: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-accent outline-none"
        />
        <input
          type="text"
          placeholder="Portfolio / Website"
          value={data.personal.portfolio}
          onChange={(e) => updatePersonal({ portfolio: e.target.value })}
          className="p-2 bg-background border border-border rounded text-text focus:border-accent outline-none"
        />
      </div>
    </section>
  )
}
