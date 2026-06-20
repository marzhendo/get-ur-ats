import { CVData } from '@/types/cv'

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
  if (data.additional.technicalSkills.length > 0 || data.additional.softSkills.length > 0 || data.additional.certifications.length > 0) filledSections++

  if (filledSections < 4) {
    warnings.push('Missing section content (Ensure Summary, Education, Experience, and Additional info have content).')
    score -= 10
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
