'use client'

import { useCVStore } from '@/lib/store'
import styles from './CVPreview.module.css'
import { useEffect, useState } from 'react'
import { t } from '@/lib/i18n'

export default function CVPreview() {
  const { data, locale } = useCVStore()
  const lang = t[locale]
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className={styles.page}>
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
            <span className={styles.company}>{data.education.institution}</span>
            <span className={styles.date}>{data.education.period}</span>
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
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '8px' }}>
              <div className={styles.entryHeader}>
                <span className={styles.company}>
                  {exp.company}{exp.title && exp.company ? ' | ' : ''}{exp.title}
                </span>
                <span className={styles.date}>{exp.period}</span>
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

      {/* Additional Info */}
      {(data.additional.certifications.length > 0 ||
        data.additional.achievements.length > 0 ||
        data.additional.technicalSkills.length > 0 ||
        data.additional.softSkills.length > 0) && (
        <>
          <div className={styles.sectionHeader}>{lang.cvAdditional}</div>
          {data.additional.certifications.length > 0 && (
            <div><strong>{lang.certifications}:</strong> {data.additional.certifications.join(', ')}</div>
          )}
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
    </div>
  )
}
