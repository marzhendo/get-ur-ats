'use client'

import { useCVStore } from '@/lib/store'
import { nanoid } from 'nanoid'
import { t } from '@/lib/i18n'
import { isValidHttpsUrl } from '@/lib/certifications-util'
import { useState } from 'react'
import type { Certification } from '@/types/cv'

export default function CertificationForm() {
  const { 
    data, 
    addCertification, 
    updateCertification, 
    removeCertification, 
    locale 
  } = useCVStore()
  const lang = t[locale]

  const [dismissReference, setDismissReference] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const legacyCerts = data.additional?.certifications || []
  const certs = data.certifications || []

  const handleAdd = () => {
    const newCert: Certification = {
      id: nanoid(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    }
    addCertification(newCert)
  }

  const handleCopyLegacy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (e) {
      console.error('Failed to copy text:', e)
    }
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
        <div className="border-l-2 border-accent pl-3">
          <h2 className="text-text font-semibold text-sm uppercase tracking-widest">
            {lang.certifications}
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

      {/* Legacy Certifications Reference Box (FR-C11 / OD-24) */}
      {!dismissReference && legacyCerts.length > 0 && (
        <div className="mb-6 p-4 rounded border border-border bg-surface">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-sm font-bold text-accent">{lang.oldCertReferenceTitle}</h4>
              <p className="text-xs text-muted">{lang.oldCertReferenceDesc}</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissReference(true)}
              className="text-xs text-muted hover:text-text px-2 py-1 border border-border rounded"
            >
              {lang.dismissReference}
            </button>
          </div>
          <div className="space-y-2 mt-3">
            {legacyCerts.map((certText, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2 rounded bg-background border border-border text-xs text-text"
              >
                <span className="font-mono text-muted">{certText}</span>
                <button
                  type="button"
                  onClick={() => handleCopyLegacy(certText, idx)}
                  className="ml-2 text-accent hover:underline shrink-0"
                >
                  {copiedIndex === idx ? lang.copied : lang.copy}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Certifications List */}
      <div className="space-y-6">
        {certs.map((cert) => {
          const isUrlValid = isValidHttpsUrl(cert.url)
          return (
            <div key={cert.id} className="p-4 border border-border rounded bg-background">
              <div className="flex justify-between mb-4">
                <h4 className="font-semibold text-text text-sm">
                  {cert.name || lang.certName}
                </h4>
                <button
                  type="button"
                  onClick={() => removeCertification(cert.id)}
                  className="text-sm text-red-500 hover:text-red-400"
                >
                  {lang.remove}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder={`${lang.certName} *`}
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                    className="w-full p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                    required
                  />
                  {!cert.name && (
                    <span className="text-[10px] text-muted ml-1">Required</span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder={`${lang.certIssuer} *`}
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                    className="w-full p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                    required
                  />
                  {!cert.issuer && (
                    <span className="text-[10px] text-muted ml-1">Required</span>
                  )}
                </div>

                <input
                  type="text"
                  placeholder={lang.certIssueDate}
                  value={cert.issueDate || ''}
                  onChange={(e) => updateCertification(cert.id, { issueDate: e.target.value })}
                  className="p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                />

                <input
                  type="text"
                  placeholder={lang.certExpiryDate}
                  value={cert.expiryDate || ''}
                  onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                  className="p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                />

                <input
                  type="text"
                  placeholder={lang.certCredentialId}
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                  className="p-2 bg-surface border border-border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none"
                />

                <div>
                  <input
                    type="url"
                    placeholder={lang.certUrl}
                    value={cert.url || ''}
                    onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                    className={`w-full p-2 bg-surface border rounded text-text focus:border-l-2 focus:border-accent focus:outline-none ${
                      !isUrlValid ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {!isUrlValid && (
                    <span className="text-[10px] text-red-500 ml-1">
                      {lang.certUrlError}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-muted mt-2 italic">
                {lang.certDriveHint}
              </p>
            </div>
          )
        })}

        {certs.length === 0 && (
          <p className="text-muted text-sm text-center py-4">
            {lang.noCertifications}
          </p>
        )}
      </div>
    </section>
  )
}
