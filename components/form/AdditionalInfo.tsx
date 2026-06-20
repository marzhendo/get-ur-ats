'use client'

import { useCVStore } from '@/lib/store'
import { useState } from 'react'
import type { AdditionalInfo as AdditionalInfoType } from '@/types/cv'
import { t } from '@/lib/i18n'

export default function AdditionalInfo() {
  const { data, updateAdditional, locale } = useCVStore()
  const lang = t[locale]

  const ArrayInput = ({ 
    title, 
    items, 
    field 
  }: { 
    title: string, 
    items: string[], 
    field: keyof AdditionalInfoType 
  }) => {
    const [inputValue, setInputValue] = useState('')

    const handleAdd = () => {
      if (inputValue.trim()) {
        updateAdditional({ [field]: [...items, inputValue.trim()] })
        setInputValue('')
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleAdd()
      }
    }

    const handleRemove = (index: number) => {
      updateAdditional({ [field]: items.filter((_, i) => i !== index) })
    }

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-text mb-2">{title}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder={`Add ${title.toLowerCase()}... (Press Enter)`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 bg-background border border-border rounded text-text focus:border-accent outline-none"
          />
          <button onClick={handleAdd} className="bg-surface border border-border px-4 rounded text-text hover:bg-border">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <span key={idx} className="bg-surface border border-border px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {item}
              <button onClick={() => handleRemove(idx)} className="text-muted hover:text-red-400">✕</button>
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-text border-b border-border pb-2">{lang.additionalInfo}</h3>
      <ArrayInput title={lang.certifications} items={data.additional.certifications} field="certifications" />
      <ArrayInput title={lang.achievements} items={data.additional.achievements} field="achievements" />
      <ArrayInput title={lang.technicalSkills} items={data.additional.technicalSkills} field="technicalSkills" />
      <ArrayInput title={lang.softSkills} items={data.additional.softSkills} field="softSkills" />
    </section>
  )
}
