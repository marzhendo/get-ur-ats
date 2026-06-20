'use client'

import { useCVStore } from '@/lib/store'
import { nanoid } from 'nanoid'
import { t } from '@/lib/i18n'

export default function Experience() {
  const { data, addExperience, updateExperience, removeExperience, locale } = useCVStore()
  const lang = t[locale]

  const handleAdd = () => {
    addExperience({
      id: nanoid(),
      title: '',
      company: '',
      period: '',
      bullets: [''],
    })
  }

  const handleAddBullet = (id: string, bullets: string[]) => {
    updateExperience(id, { bullets: [...bullets, ''] })
  }

  const handleUpdateBullet = (id: string, bullets: string[], index: number, value: string) => {
    const newBullets = [...bullets]
    newBullets[index] = value
    updateExperience(id, { bullets: newBullets })
  }

  const handleRemoveBullet = (id: string, bullets: string[], index: number) => {
    const newBullets = bullets.filter((_, i) => i !== index)
    updateExperience(id, { bullets: newBullets })
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
        <div className="border-l-2 border-accent pl-3">
          <h2 className="text-text font-semibold text-sm uppercase tracking-widest">{lang.experience}</h2>
        </div>
        <button onClick={handleAdd} className="text-sm bg-accent text-background px-3 py-1 rounded font-medium hover:bg-opacity-90">
          + {lang.addEntry}
        </button>
      </div>

      <div className="space-y-6">
        {data.experience.map((exp) => (
          <div key={exp.id} className="p-4 border border-border rounded bg-background">
            <div className="flex justify-between mb-4">
              <h4 className="font-semibold text-text">Experience Entry</h4>
              <button onClick={() => removeExperience(exp.id)} className="text-sm text-red-500 hover:text-red-400">
                {lang.remove}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                className="p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                className="p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
              />
              <input
                type="text"
                placeholder="Period (e.g. Jan 2022 - Present)"
                value={exp.period}
                onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                className="p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none md:col-span-2"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-text mb-2">Accomplishments (Bullets)</p>
              {exp.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Achieved X by doing Y resulting in Z..."
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(exp.id, exp.bullets, idx, e.target.value)}
                    className="flex-1 p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                  />
                  <button onClick={() => handleRemoveBullet(exp.id, exp.bullets, idx)} className="px-3 text-red-500 hover:text-red-400">
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={() => handleAddBullet(exp.id, exp.bullets)} className="text-sm text-accent hover:underline mt-2">
                + Add Bullet
              </button>
            </div>
          </div>
        ))}
        {data.experience.length === 0 && (
          <p className="text-muted text-sm text-center py-4">No experience entries yet.</p>
        )}
      </div>
    </section>
  )
}
