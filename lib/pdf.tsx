import { Document, Page, View, Text, StyleSheet, Link } from '@react-pdf/renderer'
import type { CVData } from '@/types/cv'
import { t, Locale } from '@/lib/i18n'
import { sortCertifications } from '@/lib/certifications-util'
import { sortExperiences, sortOrganizations, formatOrganizationPeriod } from '@/lib/date-sorting'
import { PDFSection, PDFEntryHeader, PDFEntry } from '@/components/pdf/LayoutComponents'

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
          <PDFSection title={lang.cvSummary}>
            <Text>{data.summary}</Text>
          </PDFSection>
        )}

        {/* Education */}
        {(data.education.institution || data.education.degree) && (
          <PDFSection title={lang.cvEducation}>
            <View wrap={false} style={{ marginBottom: 4 }}>
              <PDFEntryHeader
                title={data.education.institution}
                date={data.education.period}
              />
              <Text>{data.education.degree}</Text>
              {data.education.gpa && <Text>GPA: {data.education.gpa}</Text>}
              {data.education.coursework && <Text>Relevant Coursework: {data.education.coursework}</Text>}
              {data.education.activities && <Text>Activities: {data.education.activities}</Text>}
            </View>
          </PDFSection>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <PDFSection title={lang.cvExperience}>
            {sortExperiences(data.experience).map((exp) => (
              <PDFEntry
                key={exp.id}
                header={
                  <PDFEntryHeader
                    title={`${exp.company}${exp.title && exp.company ? ' | ' : ''}${exp.title}`}
                    date={exp.period}
                  />
                }
                bullets={exp.bullets}
              />
            ))}
          </PDFSection>
        )}

        {/* Organizational Experience */}
        {(() => {
          const sortedOrgs = sortOrganizations(data.organizations || [])
          if (sortedOrgs.length === 0) return null
          return (
            <PDFSection title={lang.cvOrganizations}>
              {sortedOrgs.map((org) => (
                <PDFEntry
                  key={org.id}
                  header={
                    <PDFEntryHeader
                      title={`${org.organization}${org.role && org.organization ? ' | ' : ''}${org.role}`}
                      date={formatOrganizationPeriod(org, locale === 'id')}
                    />
                  }
                  bullets={org.bullets}
                />
              ))}
            </PDFSection>
          )
        })()}

        {/* Certifications */}
        {(() => {
          const sortedCerts = sortCertifications(data.certifications || [])
          if (sortedCerts.length === 0) return null
          return (
            <PDFSection title={lang.cvCertifications}>
              {sortedCerts.map((cert) => (
                <View key={cert.id} wrap={false} style={{ marginBottom: 6 }}>
                  <PDFEntryHeader
                    title={
                      <Text>
                        <Text style={styles.bold}>{cert.name}</Text>
                        {cert.issuer ? ` | ${cert.issuer}` : ''}
                        {cert.credentialId ? ` (ID: ${cert.credentialId})` : ''}
                      </Text>
                    }
                    date={cert.issueDate || ''}
                  />
                  {cert.url && (
                    <Link src={cert.url} style={{ ...styles.link, fontSize: 9, marginTop: 1 }}>
                      {cert.url}
                    </Link>
                  )}
                </View>
              ))}
            </PDFSection>
          )
        })()}

        {/* Additional Info */}
        {(data.additional.achievements.length > 0 ||
          data.additional.technicalSkills.length > 0 ||
          data.additional.softSkills.length > 0) && (
          <PDFSection title={lang.cvAdditional}>
            <View wrap={false}>
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
          </PDFSection>
        )}
      </Page>
    </Document>
  )
}
