# Get Ur ATS - CV Builder (v2)

Welcome to **Get Ur ATS**, a fast, privacy-first, client-only tool designed to help job seekers create professional, ATS-friendly Curriculum Vitae (CV) in minutes.

> 🚀 **Live Demo:** [https://get-ur-ats.vercel.app/](https://get-ur-ats.vercel.app/)

## What is an ATS-friendly CV?

ATS stands for Applicant Tracking System. Many modern companies use automated software to scan and parse job applications. Complex multi-column designs, unusual fonts, graphic tables, and embedded profile pictures can confuse automated parsers.

**Get Ur ATS** guarantees clean, single-column document flow, standard typography, and semantic structure to maximize ATS parser accuracy while offering an optional Standard Mode for human recruiters who prefer a traditional photo CV.

## Key Features (v2)

- **Dual Mode: ATS Mode vs. Standard Mode**:
  - **ATS Mode (Default)**: Strictly optimized for ATS parsing — 100% text-based, no profile photo, clickable hyperlink URLs in PDF.
  - **Standard Mode**: Tailored for roles or regions where a photo is expected. Displays an optional 3:4 portrait photo in the header of page 1.
- **Client-Side Profile Photo with Interactive Cropper**:
  - Custom HTML5 Canvas cropper with 3:4 portrait aspect ratio and zoom controls.
  - Zero external dependencies.
  - Automatic compression (< 200 KB) and strict client-side privacy: images are never sent to a backend or external server. Photo data is stored in dedicated client browser storage (`ats-cv-photo-v1`).
- **Structured Certifications**:
  - Dedicated section with Certificate Name, Issuing Organization, Issue Date, Expiry Date, Credential ID, and Verification URL.
  - Verification URLs are rendered as clickable HTTPS hyperlinks in PDF and live preview.
  - Seamless migration helper displaying legacy v1 certification text for easy copying.
- **Organizational Experience**:
  - Dedicated section for extracurricular, community, and leadership activities.
  - Chronological sorting with "Present / Sekarang" detection.
  - Structured accomplishment bullets.
- **Intelligent Multi-Page Layout**:
  - Prevents orphaned headings (`minPresenceAhead`) across page breaks.
  - Keeps short entries intact and guarantees headers stay attached to the first bullet point.
  - Includes a 12pt protective gutter preventing date overlaps even with 100+ character titles.
  - Visual page boundary guidelines (~1056px Letter estimation) in the continuous live preview.
- **Real-Time ATS Checker**:
  - Live scoring and actionable warnings (detects emojis, invalid characters, missing required fields, insecure URLs, and excessive length > 2 pages).
- **Bilingual Interface & Headings**:
  - Instant one-click toggle between English (`en`) and Indonesian (`id`).
- **Instant PDF Export & Plain Text Copy**:
  - High-fidelity PDF generation via `@react-pdf/renderer`.
  - One-click plain text copy for pasting into application portals.

## How to Use

1. Fill out your details in the form sections on the left side of the screen.
2. Toggle between **ATS Mode** and **Standard Mode** depending on your target job requirement.
3. Review your live layout and visual page boundaries on the right preview pane.
4. Check your **ATS Score** and resolve any warnings.
5. Click **Download PDF** to export your polished CV!

## Development & Local Setup

### Prerequisites
- Node.js 20+ (recommended Node.js 22 or 24)
- npm 10+

### Installation
```bash
git clone https://github.com/marzhendo/get-ur-ats.git
cd get-ur-ats
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests
The project uses Node.js's native test runner with `tsx`:
```bash
npm test
```

### Building for Production
```bash
npm run build
```

---

_Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand 5, and @react-pdf/renderer._
