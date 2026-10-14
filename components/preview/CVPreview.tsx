'use client'

import { useRef, useState, useEffect } from 'react'
import { useCVStore } from '@/lib/store'
import styles from './CVPreview.module.css'
import { t } from '@/lib/i18n'
import { useIsMounted } from '@/lib/use-is-mounted'
import { sortCertifications } from '@/lib/certifications-util'
import { sortExperiences, sortOrganizations, formatOrganizationPeriod } from '@/lib/date-sorting'

export default function CVPreview() {
  const { data, locale } = useCVStore()
  const lang = t[locale]
  const mounted = useIsMounted()
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageBoundaries, setPageBoundaries] = useState<number[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const updatePages = () => {
      const el = containerRef.current
      if (!el) return
      const height = el.scrollHeight
      const pageHeight = 1056 // US Letter height at 96dpi
      const count = Math.floor(height / pageHeight)
      const boundaries: number[] = []
      for (let i = 1; i <= count; i++) {
        boundaries.push(i * pageHeight)
      }
      setPageBoundaries(boundaries)
    }

    updatePages()
    const resizeObserver = new ResizeObserver(updatePages)
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [data, mounted])

  if (!mounted) {
    return <div className={styles.page}></div>
  }

  const renderContactItems = () => {
    const items: React.ReactNode[] = []
    
    if (data.personal.city) items.push(data.personal.city)
    
    if (data.personal.phone) {
      // Clean phone number to digits only for WhatsApp link
      const waNumber = data.personal.phone.replace(/[^0-9]/g, '')
      items.push(
        <a key="phone" href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {data.personal.phone}
        </a>
      )
    }
    
    if (data.personal.email) {
      items.push(
        <a key="email" href={`mailto:${data.personal.email}`} className={styles.link}>
          {data.personal.email}
        </a>
      )
    }
    
    if (data.personal.linkedin) {
      items.push(
        <a key="linkedin" href={data.personal.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {data.personal.linkedin}
        </a>
      )
    }
    
    if (data.personal.portfolio) {
      items.push(
        <a key="portfolio" href={data.personal.portfolio} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {data.personal.portfolio}
        </a>
      )
    }

    if (items.length === 0) return null

    return (
      <div className={styles.contact}>
        {items.map((item, index) => (
          <span key={index}>
            {item}
            {index < items.length - 1 && ' | '}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={styles.page}>
      {/* Personal Info */}
      <div className={styles.name}>{data.personal.name || 'YOUR NAME'}</div>
      {renderContactItems()}

      {/* Summary */}
      {data.summary && (
        <>
          <div className={styles.sectionHeader}>{lang.cvSummary}</div>
          <div>{data.summary}</div>
        </>
      )}

      {/* Education */}
      {(data.education.institution || data.education.degree) && (
        <>
          <div className={styles.sectionHeader}>{lang.cvEducation}</div>
          <div className={styles.entryHeader}>
            <span className={styles.entryTitle}>{data.education.institution}</span>
            <span className={styles.entryDate}>{data.education.period}</span>
          </div>
          <div>{data.education.degree}</div>
          {data.education.gpa && <div>GPA: {data.education.gpa}</div>}
          {data.education.coursework && <div>Relevant Coursework: {data.education.coursework}</div>}
          {data.education.activities && <div>Activities: {data.education.activities}</div>}
        </>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <>
          <div className={styles.sectionHeader}>{lang.cvExperience}</div>
          {sortExperiences(data.experience).map((exp) => (
            <div key={exp.id} style={{ marginBottom: '8px' }}>
              <div className={styles.entryHeader}>
                <span className={styles.entryTitle}>
                  {exp.company}{exp.title && exp.company ? ' | ' : ''}{exp.title}
                </span>
                <span className={styles.entryDate}>{exp.period}</span>
              </div>
              <ul className={styles.bulletList}>
                {exp.bullets.filter(Boolean).map((bullet, idx) => (
                  <li key={idx} className={styles.bulletItem}>
                    <span className={styles.bullet}></span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {/* Organizational Experience */}
      {(() => {
        const sortedOrgs = sortOrganizations(data.organizations || [])
        if (sortedOrgs.length === 0) return null
        return (
          <>
            <div className={styles.sectionHeader}>{lang.cvOrganizations}</div>
            {sortedOrgs.map((org) => (
              <div key={org.id} style={{ marginBottom: '8px' }}>
                <div className={styles.entryHeader}>
                  <span className={styles.entryTitle}>
                    {org.organization}{org.role && org.organization ? ' | ' : ''}{org.role}
                  </span>
                  <span className={styles.entryDate}>
                    {formatOrganizationPeriod(org, locale === 'id')}
                  </span>
                </div>
                <ul className={styles.bulletList}>
                  {org.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx} className={styles.bulletItem}>
                      <span className={styles.bullet}></span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )
      })()}

      {/* Certifications */}
      {(() => {
        const sortedCerts = sortCertifications(data.certifications || [])
        if (sortedCerts.length === 0) return null
        return (
          <>
            <div className={styles.sectionHeader}>{lang.cvCertifications}</div>
            {sortedCerts.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '6px' }}>
                <div className={styles.entryHeader}>
                  <span className={styles.entryTitle}>
                    <strong>{cert.name}</strong>{cert.issuer ? ` | ${cert.issuer}` : ''}
                    {cert.credentialId ? ` (ID: ${cert.credentialId})` : ''}
                  </span>
                  <span className={styles.entryDate}>{cert.issueDate || ''}</span>
                </div>
                {cert.url && (
                  <div style={{ fontSize: '10px', marginTop: '1px' }}>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {cert.url}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </>
        )
      })()}

      {/* Additional Info */}
      {(data.additional.achievements.length > 0 ||
        data.additional.technicalSkills.length > 0 ||
        data.additional.softSkills.length > 0) && (
        <>
          <div className={styles.sectionHeader}>{lang.cvAdditional}</div>
          {data.additional.achievements.length > 0 && (
            <div><strong>{lang.achievements}:</strong> {data.additional.achievements.join(', ')}</div>
          )}
          {data.additional.technicalSkills.length > 0 && (
            <div><strong>{lang.technicalSkills}:</strong> {data.additional.technicalSkills.join(', ')}</div>
          )}
          {data.additional.softSkills.length > 0 && (
            <div><strong>{lang.softSkills}:</strong> {data.additional.softSkills.join(', ')}</div>
          )}
        </>
      )}

      {/* Visual Page Break Boundary Markers (OD-19 Opsi a) */}
      {pageBoundaries.map((topOffset, idx) => (
        <div
          key={idx}
          className={styles.pageBreakIndicator}
          style={{ top: `${topOffset}px` }}
          aria-hidden="true"
        >
          <span className={styles.pageBreakBadge}>
            {locale === 'id' 
              ? `--- Halaman ${idx + 2} (Perkiraan Letter) ---` 
              : `--- Page ${idx + 2} (Letter Est.) ---`}
          </span>
        </div>
      ))}
    </div>
  )
}
