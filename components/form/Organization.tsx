'use client'

import { useCVStore } from '@/lib/store'
import { nanoid } from 'nanoid'
import { t } from '@/lib/i18n'
import type { OrganizationEntry } from '@/types/cv'

export default function Organization() {
  const { 
    data, 
    addOrganization, 
    updateOrganization, 
    removeOrganization, 
    locale 
  } = useCVStore()
  const lang = t[locale]

  const orgs = data.organizations || []

  const handleAdd = () => {
    const newEntry: OrganizationEntry = {
      id: nanoid(),
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: [''],
    }
    addOrganization(newEntry)
  }

  const handleAddBullet = (id: string, bullets: string[]) => {
    updateOrganization(id, { bullets: [...bullets, ''] })
  }

  const handleUpdateBullet = (id: string, bullets: string[], index: number, value: string) => {
    const newBullets = [...bullets]
    newBullets[index] = value
    updateOrganization(id, { bullets: newBullets })
  }

  const handleRemoveBullet = (id: string, bullets: string[], index: number) => {
    const newBullets = bullets.filter((_, i) => i !== index)
    updateOrganization(id, { bullets: newBullets })
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
        <div className="border-l-2 border-accent pl-3">
          <h2 className="text-text font-semibold text-sm uppercase tracking-widest">
            {lang.organizations}
          </h2>
        </div>
        <button 
          type="button"
          onClick={handleAdd} 
          className="text-sm bg-accent text-background px-3 py-1 rounded font-medium hover:bg-opacity-90"
        >
          + {lang.addEntry}
        </button>
      </div>

      <div className="space-y-6">
        {orgs.map((org) => (
          <div key={org.id} className="p-4 border border-border rounded bg-background">
            <div className="flex justify-between mb-4">
              <h4 className="font-semibold text-text text-sm">
                {org.organization || lang.orgName}
              </h4>
              <button 
                type="button"
                onClick={() => removeOrganization(org.id)} 
                className="text-sm text-red-500 hover:text-red-400"
              >
                {lang.remove}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  placeholder={`${lang.orgName} *`}
                  value={org.organization}
                  onChange={(e) => updateOrganization(org.id, { organization: e.target.value })}
                  className="w-full p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                  required
                />
                {!org.organization && (
                  <span className="text-[10px] text-muted ml-1">{lang.required}</span>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder={`${lang.orgRole} *`}
                  value={org.role}
                  onChange={(e) => updateOrganization(org.id, { role: e.target.value })}
                  className="w-full p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                  required
                />
                {!org.role && (
                  <span className="text-[10px] text-muted ml-1">{lang.required}</span>
                )}
              </div>

              <input
                type="text"
                placeholder={lang.startDate}
                value={org.startDate || ''}
                onChange={(e) => updateOrganization(org.id, { startDate: e.target.value })}
                className="p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
              />

              <div>
                <input
                  type="text"
                  placeholder={lang.endDate}
                  value={org.isCurrent ? (locale === 'id' ? 'Sekarang' : 'Present') : (org.endDate || '')}
                  disabled={Boolean(org.isCurrent)}
                  onChange={(e) => updateOrganization(org.id, { endDate: e.target.value })}
                  className={`w-full p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none ${
                    org.isCurrent ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <label className="flex items-center gap-2 mt-2 text-xs text-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(org.isCurrent)}
                    onChange={(e) => updateOrganization(org.id, { isCurrent: e.target.checked })}
                    className="accent-accent"
                  />
                  <span>{lang.currentlyActive}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-text mb-2">{lang.accomplishmentsBullets}</p>
              {org.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={lang.bulletContributionPlaceholder}
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(org.id, org.bullets, idx, e.target.value)}
                    className="flex-1 p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => handleRemoveBullet(org.id, org.bullets, idx)} 
                    className="px-3 text-red-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => handleAddBullet(org.id, org.bullets)} 
                className="text-sm text-accent hover:underline mt-2 inline-block"
              >
                + {lang.addBullet}
              </button>
            </div>
          </div>
        ))}

        {orgs.length === 0 && (
          <p className="text-muted text-sm text-center py-4">
            {lang.noOrganizations}
          </p>
        )}
      </div>
    </section>
  )
}
