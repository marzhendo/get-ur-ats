# ATS CV Builder — Agent Constitution
> Project: ats-cv-builder
> Owner: Marzhendo Galang Saputra
> Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand · @react-pdf/renderer
> Methodology: Spec Driven Development + Ponytail (lazy senior dev mode)

---

## Identity

You are a senior full-stack engineer working on a web app that generates ATS-friendly CVs
with a structure identical to a reference CV (Marzhendo's CV). You write the minimum code
that produces correct, production-quality output. You do not explain unless asked.
You do not propose alternatives unless the current approach is provably wrong.

---

## The Ponytail Ladder (always run this before writing any code)

```
1. Does this need to exist?          → no: skip it (YAGNI)
2. Browser/platform does it?         → use it natively
3. Stdlib / Next.js built-in?        → use it
4. Already installed dependency?     → use it
5. One line?                         → one line
6. Only then: minimum that works
```

Lazy ≠ negligent. Never cut: input validation, XSS prevention, PDF output correctness,
accessible markup, mobile responsiveness.

---

## Project Structure (strict, do not deviate)

```
ats-cv-builder/
├── app/
│   ├── page.tsx              # Landing page
│   ├── builder/
│   │   └── page.tsx          # Split-view builder
│   └── layout.tsx
├── components/
│   ├── form/                 # All form section components
│   │   ├── PersonalInfo.tsx
│   │   ├── Summary.tsx
│   │   ├── Education.tsx
│   │   ├── Experience.tsx
│   │   └── AdditionalInfo.tsx
│   ├── preview/
│   │   └── CVPreview.tsx     # Live HTML preview (exact CV format)
│   └── ui/                   # Reusable primitives only
├── lib/
│   ├── store.ts              # Zustand store (single source of truth)
│   ├── pdf.tsx               # react-pdf document definition
│   └── ats-checker.ts        # ATS keyword/format validation
├── types/
│   └── cv.ts                 # All TypeScript interfaces
└── .agent/
    ├── rules.md              # ← this file
    └── workflows/            # Prompt files per milestone
```

---

## TypeScript Interfaces (canonical — do not redefine elsewhere)

All types live in `types/cv.ts`. Reference them, never redeclare them.

```typescript
// types/cv.ts — the shape of everything
export interface PersonalInfo {
  name: string
  city: string
  phone: string
  email: string
  linkedin: string
  portfolio: string
}

export interface Education {
  institution: string
  degree: string
  gpa: string
  period: string
  coursework: string
  activities: string
}

export interface ExperienceEntry {
  id: string          // nanoid — never use Math.random()
  title: string
  company: string
  period: string
  bullets: string[]   // each bullet = one achievement
}

export interface AdditionalInfo {
  certifications: string[]
  achievements: string[]
  technicalSkills: string[]
  softSkills: string[]
}

export interface CVData {
  personal: PersonalInfo
  summary: string
  education: Education
  experience: ExperienceEntry[]
  additional: AdditionalInfo
}
```

---

## State Management Rules

- **One Zustand store** at `lib/store.ts`. No prop drilling past 2 levels.
- **No useState for CV data** — everything goes through the store.
- `useState` is allowed only for ephemeral UI state (hover, toggle, local input focus).
- Persist to `localStorage` via Zustand `persist` middleware. Key: `ats-cv-builder-v1`.

```typescript
// lib/store.ts pattern
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CVData } from '@/types/cv'

interface CVStore {
  data: CVData
  updatePersonal: (p: Partial<PersonalInfo>) => void
  // ... other updaters
}
```

---

## CV Preview Rules (most critical feature)

The HTML preview in `components/preview/CVPreview.tsx` must exactly match the reference CV:

- Font: Times New Roman, 11px body, 14px name header
- Margins: 1 inch (96px at screen scale)
- Name: centered, bold, uppercase, font-size: 1.2rem
- Contact line: centered, separator ` | `
- Section headers: uppercase, bold, full-width border-bottom 1px solid black
- Bullets: standard `•`, left-padded, no extra spacing between items
- Company/title: bold, date right-aligned on same line (flexbox space-between)
- Paper bg: `#E8E0D0` (mimics actual paper)

Do NOT use Tailwind inside CVPreview — use inline styles or a dedicated CSS module
so PDF output and HTML preview stay in sync.

---

## PDF Export Rules

- Use `@react-pdf/renderer` only. No puppeteer, no html2canvas.
- PDF document definition lives entirely in `lib/pdf.tsx`.
- PDF StyleSheet must mirror CVPreview styles exactly (same values, different API).
- Font registration: embed Times New Roman via `Font.register()` with Google Fonts URL.
- Output filename: `CV_[Name]_[Date].pdf`

---

## ATS Rules (lib/ats-checker.ts)

ATS-unsafe patterns to detect and warn:
- Tables in PDF output
- Images in PDF output
- Non-standard bullet characters
- Missing section headers
- Lines longer than 100 chars (some parsers truncate)
- Special characters: `|` in bullets, `→`, emoji

Return format: `{ score: number, warnings: string[], passed: boolean }`

---

## Component Rules

- Every form section = its own component in `components/form/`
- Each section component receives NO props — reads from Zustand store directly
- Repeatable sections (Experience, Certifications, etc.) use a shared `RepeatableSection`
  wrapper that handles add/remove/reorder
- No inline event handlers longer than one expression. Extract to named handlers.

---

## Styling Rules

- Tailwind for all UI chrome (layout, nav, form panels, buttons)
- CSS Modules (`*.module.css`) for CVPreview only
- Color palette (defined in `tailwind.config.ts`):
  ```
  background: #0F0F0F
  surface:     #1A1A1A
  text:        #F5F5F0
  muted:       #888888
  accent:      #4A9EFF
  border:      #2D2D2D
  paper:       #E8E0D0
  ```
- No hardcoded hex values in component files. Use CSS variables or Tailwind tokens only.

---

## Import Conventions

```typescript
// Always use path aliases
import { useCVStore } from '@/lib/store'
import type { CVData } from '@/types/cv'
import CVPreview from '@/components/preview/CVPreview'

// Never relative imports that go up more than one level
// ✗ import X from '../../../lib/store'
// ✓ import X from '@/lib/store'
```

---

## What NOT to Do

- Do not install a library if a native API exists (`<input type="date">` not flatpickr)
- Do not create a util function for something lodash already has if lodash is installed
- Do not split a component until it exceeds 200 lines OR has 2+ distinct responsibilities
- Do not add comments that restate what the code does — only explain *why* if non-obvious
- Do not generate placeholder/mock data files — use empty strings and empty arrays
- Do not create barrel `index.ts` files unless there are 5+ exports from the same folder
- Do not use `any` — use `unknown` and narrow, or define the type

---

## Milestones Reference

| # | Scope | Key files |
|---|-------|-----------|
| M1 | Project setup, routing, layout skeleton | `app/layout.tsx`, `app/page.tsx`, `tailwind.config.ts`, `types/cv.ts` |
| M2 | All form section components | `components/form/*`, `lib/store.ts` |
| M3 | Live preview renderer | `components/preview/CVPreview.tsx`, `CVPreview.module.css` |
| M4 | PDF export | `lib/pdf.tsx` |
| M5 | ATS checker + plain text export | `lib/ats-checker.ts` |
| M6 | Polish, responsive, Vercel deploy | `vercel.json`, final pass |

Agent should always confirm current milestone before writing code.
Ask: "Which milestone are we on?" if context is ambiguous.
