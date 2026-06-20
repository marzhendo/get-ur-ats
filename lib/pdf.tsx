import { Document, Page, View, Text, StyleSheet, Link } from '@react-pdf/renderer'
import type { CVData } from '@/types/cv'
import { t, Locale } from '@/lib/i18n'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    padding: 72, // approx 1 inch
    color: '#1A1A1A',
  },
  name: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contact: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  sectionHeader: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 11,
  },
  entryHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  entryTitle: {
    flex: 1,
  },
  entryDate: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
    textAlign: 'right',
    fontWeight: 'normal',
  },
  bulletItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#1A1A1A',
    textDecoration: 'underline',
  }
})

export const CVDocument = ({ data, locale }: { data: CVData; locale: Locale }) => {
  const lang = t[locale]

  const renderContactItems = () => {
    const items: React.ReactNode[] = []
    
    if (data.personal.city) items.push(<Text key="city">{data.personal.city}</Text>)
    
    if (data.personal.phone) {
      const waNumber = data.personal.phone.replace(/[^0-9]/g, '')
      items.push(
        <Link key="phone" src={`https://wa.me/${waNumber}`} style={styles.link}>
          {data.personal.phone}
        </Link>
      )
    }
    
    if (data.personal.email) {
      items.push(
        <Link key="email" src={`mailto:${data.personal.email}`} style={styles.link}>
          {data.personal.email}
        </Link>
      )
    }
    
    if (data.personal.linkedin) {
      items.push(
        <Link key="linkedin" src={data.personal.linkedin} style={styles.link}>
          {data.personal.linkedin}
        </Link>
      )
    }
    
    if (data.personal.portfolio) {
      items.push(
        <Link key="portfolio" src={data.personal.portfolio} style={styles.link}>
          {data.personal.portfolio}
        </Link>
      )
    }

    if (items.length === 0) return null

    return (
      <Text style={styles.contact}>
        {items.map((item, index) => (
          <Text key={index}>
            {item}
            {index < items.length - 1 ? ' | ' : ''}
          </Text>
        ))}
      </Text>
    )
  }

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Personal Info */}
        <Text style={styles.name}>{data.personal.name || 'YOUR NAME'}</Text>
        {renderContactItems()}

        {/* Summary */}
        {data.summary && (
          <View>
            <Text style={styles.sectionHeader}>{lang.cvSummary}</Text>
            <Text>{data.summary}</Text>
          </View>
        )}

        {/* Education */}
        {(data.education.institution || data.education.degree) && (
          <View>
            <Text style={styles.sectionHeader}>{lang.cvEducation}</Text>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{data.education.institution}</Text>
              <Text style={styles.entryDate}>{data.education.period}</Text>
            </View>
            <Text>{data.education.degree}</Text>
            {data.education.gpa && <Text>GPA: {data.education.gpa}</Text>}
            {data.education.coursework && <Text>Relevant Coursework: {data.education.coursework}</Text>}
            {data.education.activities && <Text>Activities: {data.education.activities}</Text>}
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>{lang.cvExperience}</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {exp.company}{exp.title && exp.company ? ' | ' : ''}{exp.title}
                  </Text>
                  <Text style={styles.entryDate}>{exp.period}</Text>
                </View>
                <View>
                  {exp.bullets.filter(Boolean).map((bullet, idx) => (
                    <View key={idx} style={styles.bulletItem}>
                      <Text style={styles.bullet}>• </Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Additional Info */}
        {(data.additional.certifications.length > 0 ||
          data.additional.achievements.length > 0 ||
          data.additional.technicalSkills.length > 0 ||
          data.additional.softSkills.length > 0) && (
          <View>
            <Text style={styles.sectionHeader}>{lang.cvAdditional}</Text>
            {data.additional.certifications.length > 0 && (
              <Text>
                <Text style={styles.bold}>{lang.certifications}: </Text>
                {data.additional.certifications.join(', ')}
              </Text>
            )}
            {data.additional.achievements.length > 0 && (
              <Text>
                <Text style={styles.bold}>{lang.achievements}: </Text>
                {data.additional.achievements.join(', ')}
              </Text>
            )}
            {data.additional.technicalSkills.length > 0 && (
              <Text>
                <Text style={styles.bold}>{lang.technicalSkills}: </Text>
                {data.additional.technicalSkills.join(', ')}
              </Text>
            )}
            {data.additional.softSkills.length > 0 && (
              <Text>
                <Text style={styles.bold}>{lang.softSkills}: </Text>
                {data.additional.softSkills.join(', ')}
              </Text>
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}
