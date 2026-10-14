import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'

export const layoutStyles = StyleSheet.create({
  section: {
    marginBottom: 4,
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
    alignItems: 'flex-start',
    columnGap: 12,
    fontWeight: 'bold',
  },
  entryTitle: {
    flex: 1,
    marginRight: 12,
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
  entryContainer: {
    marginBottom: 8,
  },
})

/**
 * Section component with minPresenceAhead to ensure heading is never
 * orphaned at the bottom of a page without content (FR-PG3).
 */
export function PDFSection({ 
  title, 
  children,
  style 
}: { 
  title: string
  children: React.ReactNode
  style?: Style | Style[]
}) {
  const combinedStyle = style
    ? (Array.isArray(style) ? [layoutStyles.section, ...style] : [layoutStyles.section, style])
    : layoutStyles.section

  return (
    <View style={combinedStyle} minPresenceAhead={70}>
      <Text style={layoutStyles.sectionHeader} minPresenceAhead={70}>
        {title}
      </Text>
      {children}
    </View>
  )
}

/**
 * EntryHeader component guaranteeing 12pt minimum gutter between
 * title and date, preventing overlap on long titles (FR-PG7, OD-23).
 */
export function PDFEntryHeader({
  title,
  date,
}: {
  title: React.ReactNode
  date?: React.ReactNode
}) {
  return (
    <View style={layoutStyles.entryHeader}>
      <Text style={layoutStyles.entryTitle}>{title}</Text>
      {date ? <Text style={layoutStyles.entryDate}>{date}</Text> : null}
    </View>
  )
}

/**
 * Single bullet item preventing orphaned split lines (FR-PG5).
 */
export function PDFBullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={layoutStyles.bulletItem} wrap={false}>
      <Text style={layoutStyles.bullet}>• </Text>
      <Text style={layoutStyles.bulletText} orphans={2} widows={2}>
        {children}
      </Text>
    </View>
  )
}

/**
 * Entry component implementing OD-17:
 * - Entries with <= 3 bullets are kept unbroken on one page (wrap={false}) (FR-PG6).
 * - Entries with > 3 bullets keep the header and first bullet together (FR-PG4),
 *   allowing subsequent bullets to cleanly flow across page boundaries.
 */
export function PDFEntry({
  header,
  bullets = [],
  children,
  style,
}: {
  header: React.ReactNode
  bullets?: string[]
  children?: React.ReactNode
  style?: Style | Style[]
}) {
  const validBullets = bullets.filter(Boolean)
  const isShort = validBullets.length <= 3
  const combinedStyle = style
    ? (Array.isArray(style) ? [layoutStyles.entryContainer, ...style] : [layoutStyles.entryContainer, style])
    : layoutStyles.entryContainer

  if (isShort) {
    return (
      <View style={combinedStyle} wrap={false}>
        {header}
        {children}
        {validBullets.map((b, idx) => (
          <PDFBullet key={idx}>{b}</PDFBullet>
        ))}
      </View>
    )
  }

  const [firstBullet, ...restBullets] = validBullets

  return (
    <View style={combinedStyle}>
      <View wrap={false}>
        {header}
        {children}
        <PDFBullet>{firstBullet}</PDFBullet>
      </View>
      {restBullets.map((b, idx) => (
        <PDFBullet key={idx + 1}>{b}</PDFBullet>
      ))}
    </View>
  )
}
