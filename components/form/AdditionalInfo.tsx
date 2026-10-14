'use client'

import { useCVStore } from '@/lib/store'
import { useState } from 'react'
import type { AdditionalInfo as AdditionalInfoType } from '@/types/cv'
import { t } from '@/lib/i18n'

interface ArrayInputProps {
  title: string
  items: string[]
  field: keyof AdditionalInfoType
  addLabel: string
  onAdd: (field: keyof AdditionalInfoType, value: string) => void
  onRemove: (field: keyof AdditionalInfoType, index: number) => void
}

function ArrayInput({ title, items, field, addLabel, onAdd, onRemove }: ArrayInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(field, inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-text mb-2">{title}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder={`${addLabel} ${title}... (Enter)`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 bg-background border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
        />
        <button onClick={handleAdd} className="bg-surface border border-border px-4 rounded text-text hover:bg-border">
          {addLabel}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={idx} className="bg-surface border border-border px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {item}
            <button onClick={() => onRemove(field, idx)} className="text-muted hover:text-red-400">✕</button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AdditionalInfo() {
  const { data, updateAdditional, locale } = useCVStore()
  const lang = t[locale]

  const handleAdd = (field: keyof AdditionalInfoType, value: string) => {
    const currentItems = data.additional[field] || []
    updateAdditional({ [field]: [...currentItems, value] })
  }

  const handleRemove = (field: keyof AdditionalInfoType, index: number) => {
    const currentItems = data.additional[field] || []
    updateAdditional({ [field]: currentItems.filter((_, i) => i !== index) })
  }

  return (
    <section className="mb-8">
      <div className="border-l-2 border-accent pl-3 mb-4">
        <h2 className="text-text font-semibold text-sm uppercase tracking-widest">
          {lang.additionalInfo}
        </h2>
      </div>
      <ArrayInput 
        title={lang.achievements} 
        items={data.additional.achievements} 
        field="achievements" 
        addLabel={lang.add}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
      <ArrayInput 
        title={lang.technicalSkills} 
        items={data.additional.technicalSkills} 
        field="technicalSkills" 
        addLabel={lang.add}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
      <ArrayInput 
        title={lang.softSkills} 
        items={data.additional.softSkills} 
        field="softSkills" 
        addLabel={lang.add}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </section>
  )
}

