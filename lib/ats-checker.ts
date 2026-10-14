import { CVData } from '@/types/cv'
import { isValidHttpsUrl } from '@/lib/certifications-util'

export function checkATS(data: CVData) {
  let score = 100
  const warnings: string[] = []

  const checkText = (text: string, context: string) => {
    if (!text) return
    if (/\p{Emoji}/u.test(text)) {
      warnings.push(`Emoji found in ${context}.`)
      score -= 5
    }
    if (/[→–►]/u.test(text)) {
      warnings.push(`Special non-standard bullet or character found in ${context}.`)
      score -= 5
    }
    const lines = text.split('\n')
    lines.forEach(line => {
      if (line.length > 150) {
        warnings.push(`Line longer than 150 chars in ${context}.`)
        score -= 2
      }
    })
  }

  if (!data.personal.name || !data.personal.email || data.experience.length === 0) {
    warnings.push('Missing required fields: Name, Email, or Experience.')
    score -= 15
  }

  let filledSections = 0
  if (data.summary) filledSections++
  if (data.education.institution) filledSections++
  if (data.experience.length > 0) filledSections++
  if (
    data.additional.technicalSkills.length > 0 || 
    data.additional.softSkills.length > 0 || 
    data.additional.certifications.length > 0 ||
    (data.certifications && data.certifications.length > 0)
  ) filledSections++

  if (filledSections < 4) {
    warnings.push('Missing section content (Ensure Summary, Education, Experience, and Additional info/Certifications have content).')
    score -= 10
  }

  if (data.mode === 'standard') {
    warnings.push('Standard Mode is active. Note: Adding photos may reduce parsing accuracy in some automated ATS systems.')
  }

  if (data.certifications && data.certifications.length > 0) {
    data.certifications.forEach((cert, idx) => {
      if (!cert.name || !cert.issuer) {
        warnings.push(`Certification ${idx + 1} is missing required name or issuer.`)
        score -= 5
      }
      if (cert.url && !isValidHttpsUrl(cert.url)) {
        warnings.push(`Certification ${idx + 1} has an invalid or insecure URL (must start with https://).`)
        score -= 5
      }
      if (cert.issueDate && cert.expiryDate && cert.expiryDate < cert.issueDate) {
        warnings.push(`Certification "${cert.name || idx + 1}" has expiry date earlier than issue date.`)
        score -= 5
      }
      checkText(cert.name, `Certification ${idx + 1} Name`)
      checkText(cert.issuer, `Certification ${idx + 1} Issuer`)
    })
  }

  if (data.organizations && data.organizations.length > 0) {
    data.organizations.forEach((org, idx) => {
      if (!org.organization || !org.role) {
        warnings.push(`Organization entry ${idx + 1} is missing required organization name or role.`)
        score -= 5
      }
      checkText(org.organization, `Organization ${idx + 1} Name`)
      checkText(org.role, `Organization ${idx + 1} Role`)
      org.bullets.forEach((b, j) => checkText(b, `Organization ${idx + 1} Bullet ${j + 1}`))
    })
  }

  // Check all text
  checkText(data.personal.name, 'Name')
  checkText(data.summary, 'Summary')
  data.experience.forEach((exp, i) => {
    exp.bullets.forEach((b, j) => checkText(b, `Experience ${i+1} Bullet ${j+1}`))
  })

  score = Math.max(0, score)
  return { score, warnings, passed: score >= 80 }
}
