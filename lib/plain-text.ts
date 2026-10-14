import { CVData } from '@/types/cv'
import { t, Locale } from '@/lib/i18n'
import { sortCertifications } from '@/lib/certifications-util'
import { sortExperiences, sortOrganizations, formatOrganizationPeriod } from '@/lib/date-sorting'

export function toPlainText(data: CVData, locale: Locale): string {
  const lang = t[locale]
  const lines: string[] = []
  
  if (data.personal.name) lines.push(data.personal.name.toUpperCase())
  
  const contact = [
    data.personal.city, 
    data.personal.phone, 
    data.personal.email, 
    data.personal.linkedin, 
    data.personal.portfolio
  ].filter(Boolean).join(' | ')
  if (contact) lines.push(contact)
  
  lines.push('')

  if (data.summary) {
    lines.push(lang.cvSummary)
    lines.push('---')
    lines.push(data.summary)
    lines.push('')
  }

  if (data.education.institution) {
    lines.push(lang.cvEducation)
    lines.push('---')
    lines.push(`${data.education.institution} | ${data.education.period}`)
    lines.push(data.education.degree)
    if (data.education.gpa) lines.push(`GPA: ${data.education.gpa}`)
    if (data.education.coursework) lines.push(`Relevant Coursework: ${data.education.coursework}`)
    if (data.education.activities) lines.push(`Activities: ${data.education.activities}`)
    lines.push('')
  }

  if (data.experience.length > 0) {
    lines.push(lang.cvExperience)
    lines.push('---')
    sortExperiences(data.experience).forEach(exp => {
      lines.push(`${exp.company} | ${exp.title} | ${exp.period}`)
      exp.bullets.filter(Boolean).forEach(bullet => {
        lines.push(`• ${bullet}`)
      })
      lines.push('')
    })
  }

  const sortedOrgs = sortOrganizations(data.organizations || [])
  if (sortedOrgs.length > 0) {
    lines.push(lang.cvOrganizations)
    lines.push('---')
    sortedOrgs.forEach(org => {
      const period = formatOrganizationPeriod(org, locale === 'id')
      const headerParts = [org.organization, org.role, period].filter(Boolean)
      lines.push(headerParts.join(' | '))
      org.bullets.filter(Boolean).forEach(bullet => {
        lines.push(`• ${bullet}`)
      })
      lines.push('')
    })
  }

  const sortedCerts = sortCertifications(data.certifications || [])
  if (sortedCerts.length > 0) {
    lines.push(lang.cvCertifications)
    lines.push('---')
    sortedCerts.forEach(cert => {
      const headerParts = [cert.name, cert.issuer, cert.issueDate].filter(Boolean)
      lines.push(headerParts.join(' | '))
      if (cert.credentialId) lines.push(`Credential ID: ${cert.credentialId}`)
      if (cert.url) lines.push(cert.url)
      lines.push('')
    })
  }

  const hasAdditional = 
    data.additional.achievements.length > 0 || 
    data.additional.technicalSkills.length > 0 || 
    data.additional.softSkills.length > 0

  if (hasAdditional) {
    lines.push(lang.cvAdditional)
    lines.push('---')
    if (data.additional.achievements.length > 0) {
      lines.push(`${lang.achievements}: ${data.additional.achievements.join(', ')}`)
    }
    if (data.additional.technicalSkills.length > 0) {
      lines.push(`${lang.technicalSkills}: ${data.additional.technicalSkills.join(', ')}`)
    }
    if (data.additional.softSkills.length > 0) {
      lines.push(`${lang.softSkills}: ${data.additional.softSkills.join(', ')}`)
    }
  }

  return lines.join('\n')
}
