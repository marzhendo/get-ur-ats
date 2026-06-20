# SKILLS — ATS CV Builder
> Loaded by OpenCode agent. Tool and library reference for this project.
> One entry per skill. Read the relevant section before touching that domain.

---

## SKILL: Next.js 14 App Router

**Use when:** Creating pages, layouts, API routes, or any routing logic.

Rules:
- All pages live in `app/` using file-based routing. No `pages/` directory.
- `layout.tsx` wraps children — put global providers (Zustand, fonts) here.
- `'use client'` directive required for any component using hooks, event handlers,
  or browser APIs. Add it at the top of the file, before imports.
- Server Components by default — only add `'use client'` when actually needed.
- API routes → `app/api/[route]/route.ts` with named exports `GET`, `POST`, etc.
- Font loading: use `next/font/google`, not a `<link>` tag.

```typescript
// Correct font setup in layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

Do NOT use: `getServerSideProps`, `getStaticProps`, `useRouter` from `next/router`
(use `next/navigation` instead).

---

## SKILL: TypeScript

**Use when:** Every file in this project (`.ts` / `.tsx` only, never `.js`).

Rules:
- All types in `types/cv.ts`. Import from there. Never redeclare.
- `interface` for object shapes, `type` for unions/aliases.
- `unknown` over `any`. Narrow with `typeof` or type guards.
- Avoid type assertions (`as X`) unless interacting with external library types.
- `readonly` on arrays that should not be mutated in place.

```typescript
// Correct pattern for updaters
updateExperience: (id: string, patch: Partial<ExperienceEntry>) => void
// Not: updateExperience: (data: any) => void
```

---

## SKILL: Tailwind CSS v3

**Use when:** Styling all UI chrome (layout, panels, buttons, inputs, nav).
Do NOT use Tailwind inside `CVPreview` component — use CSS Modules there.

Rules:
- All custom tokens defined in `tailwind.config.ts` under `theme.extend.colors`.
- Use config tokens, not hardcoded hex: `bg-surface` not `bg-[#1A1A1A]`.
- Responsive: mobile-first. Builder layout: `flex-col` on mobile, `flex-row md:` on desktop.
- Dark mode: not needed — app is dark-only by design.
- Class order convention: layout → spacing → typography → color → state.

```tsx
// Good
<div className="flex flex-col md:flex-row gap-4 p-6 bg-surface text-text">

// Bad — hardcoded values, wrong order
<div className="text-white p-6 flex" style={{ background: '#1A1A1A' }}>
```

Custom tokens to use:
```
bg-background   → #0F0F0F
bg-surface      → #1A1A1A
text-text       → #F5F5F0
text-muted      → #888888
bg-accent       → #4A9EFF
border-border   → #2D2D2D
bg-paper        → #E8E0D0
```

---

## SKILL: Zustand

**Use when:** All CV data state. Single store at `lib/store.ts`.

Rules:
- One store, one file.
- Use `persist` middleware from `zustand/middleware` for localStorage.
- Updater functions are defined inside the store, not in components.
- Slices (nested update): spread the parent, spread the slice.

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Correct nested update pattern
updatePersonal: (patch) =>
  set((state) => ({
    data: { ...state.data, personal: { ...state.data.personal, ...patch } }
  }))
```

Do NOT use: Redux, Context API for CV data, or multiple stores.
Do NOT call `set` with the full state object — always use the updater pattern above.

---

## SKILL: @react-pdf/renderer

**Use when:** Generating the downloadable PDF in `lib/pdf.tsx`.

Rules:
- ALL PDF layout lives in `lib/pdf.tsx`. Never import PDF primitives in components.
- Use `StyleSheet.create()` — inline style objects inside JSX are a code smell here.
- Register fonts before the component definition with `Font.register()`.
- PDF primitives: `Document`, `Page`, `View`, `Text`, `StyleSheet` — these are NOT
  HTML elements. `View` = div, `Text` = span/p. No `div`, no `span`.
- Flexbox works but differently: default `flexDirection` is `column`.
- `@react-pdf/renderer` does NOT support: CSS grid, `position: fixed/absolute` complex
  layouts, most CSS pseudo-selectors.

```typescript
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'

Font.register({
  family: 'Times New Roman',
  src: 'https://fonts.gstatic.com/s/...',  // use stable Google Fonts URL
})

const styles = StyleSheet.create({
  name: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', fontFamily: 'Times New Roman' },
  section: { marginTop: 8, borderBottomWidth: 1, borderBottomColor: '#000' },
})
```

PDF download trigger:
```tsx
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVDocument } from '@/lib/pdf'

<PDFDownloadLink document={<CVDocument data={data} />} fileName={`CV_${data.personal.name}.pdf`}>
  {({ loading }) => loading ? 'Generating...' : 'Download PDF'}
</PDFDownloadLink>
```

---

## SKILL: CSS Modules (CVPreview only)

**Use when:** Styling `components/preview/CVPreview.tsx`.
This is the only component that uses CSS Modules. Everything else uses Tailwind.

Rules:
- File: `components/preview/CVPreview.module.css`
- Class names: camelCase in CSS file, accessed as `styles.className` in JSX.
- Mirror the values from `lib/pdf.tsx` StyleSheet — same font sizes, spacing, margins.
- Base unit: `1rem = 16px`. CV margins: `1in = 96px` at screen DPI.

```css
/* CVPreview.module.css */
.page {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11px;
  padding: 96px;           /* 1 inch */
  background: #E8E0D0;
  max-width: 816px;        /* US Letter at 96dpi */
  margin: 0 auto;
  color: #1A1A1A;
}

.name {
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sectionHeader {
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid #1A1A1A;
  margin-top: 12px;
  margin-bottom: 4px;
  font-size: 11px;
}

.entryHeader {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.bullet::before {
  content: '• ';
}
```

---

## SKILL: nanoid (ID generation)

**Use when:** Generating IDs for repeatable entries (ExperienceEntry, etc.).

```typescript
import { nanoid } from 'nanoid'

// Create new experience entry
const newEntry: ExperienceEntry = {
  id: nanoid(),
  title: '',
  company: '',
  period: '',
  bullets: [''],
}
```

Never use: `Math.random()`, `Date.now()`, or sequential integers for entity IDs.

---

## SKILL: ATS Validation (lib/ats-checker.ts)

**Use when:** Implementing or calling ATS validation logic.

ATS-unsafe patterns — detect all of these:

| Pattern | Check |
|---------|-------|
| Emoji in any field | `/\p{Emoji}/u.test(value)` |
| Special bullets (`→`, `–`, etc.) | not `•` or plain `-` |
| Lines > 100 chars | split by `\n`, check length |
| Empty required fields | name, email, at least 1 experience |
| Missing section headers | check that all 4 sections have content |

Score: start at 100, deduct per warning. Return `{ score, warnings, passed: score >= 80 }`.

---

## SKILL: Plain Text Export

**Use when:** Implementing "Copy as ATS Text" feature.

Rules:
- Pure string concatenation from Zustand store data — no DOM manipulation.
- Format: identical section order to the PDF.
- Bullets: `• ` prefix (U+2022 + space).
- Separator lines: `---` (no fancy unicode dashes).
- Copy to clipboard: `navigator.clipboard.writeText(text)`.

```typescript
// lib/plain-text.ts
export function toPlainText(data: CVData): string {
  const lines: string[] = []
  lines.push(data.personal.name.toUpperCase())
  lines.push(`${data.personal.city} | ${data.personal.phone} | ${data.personal.email}`)
  // ... continue for each section
  return lines.join('\n')
}
```

---

## SKILL: Vercel Deployment

**Use when:** Final deploy at M6.

Rules:
- `vercel.json` at root — only needed if custom headers/rewrites required. Otherwise skip.
- Environment variables: none needed for MVP (no backend, no API keys).
- Build command: `next build` (Vercel auto-detects).
- Output: static export NOT used — keep SSR default for future extensibility.
- Custom domain: set in Vercel dashboard, not in config files.

Pre-deploy checklist:
- [ ] `next build` passes locally with zero errors
- [ ] No `console.log` left in production code
- [ ] `localStorage` gracefully handled for SSR (check `typeof window !== 'undefined'`)
- [ ] PDF download tested on Chrome and Firefox
- [ ] Mobile layout tested at 375px width
