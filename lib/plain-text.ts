import { CVData } from '@/types/cv'
import { t, Locale } from '@/lib/i18n'

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
    data.experience.forEach(exp => {
      lines.push(`${exp.company} | ${exp.title} | ${exp.period}`)
      exp.bullets.filter(Boolean).forEach(bullet => {
        lines.push(`• ${bullet}`)
      })
      lines.push('')
    })
  }

  const hasAdditional = data.additional.certifications.length > 0 || 
    data.additional.achievements.length > 0 || 
    data.additional.technicalSkills.length > 0 || 
    data.additional.softSkills.length > 0

  if (hasAdditional) {
    lines.push(lang.cvAdditional)
    lines.push('---')
    if (data.additional.certifications.length > 0) {
      lines.push(`${lang.certifications}: ${data.additional.certifications.join(', ')}`)
    }
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
