# 🎓 Transcript GPA Analyzer

Upload a university transcript PDF or photo and get your GPA calculated automatically — no manual entry.

**Live demo:** [gpa-analyzer-challenge.vercel.app](https://gpa-analyzer-challenge.vercel.app/)

---

## Setup

```bash
git clone https://github.com/crisupdate/gpa-calc.git
cd gpa-calc
npm install
```

Add your Anthropic API key to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

---

## What It Does

- Reads courses, grades, and credits from your transcript using Claude AI
- Calculates term GPA and cumulative GPA (standard 4.0 scale)
- Handles Pass/Fail and Withdrawn courses correctly
- GPA trend chart and What-If calculator included
- Files are never stored — processed in memory only

---

## What Could Be Improved

- **Grading system types** — `Grading System`, `Converted Grade`, `Converted Transcript` types for multi-system support
- **UK Classification converter** — First Class, 2:1, 2:2, Third via GPA → percentage bridge
- **ECTS converter** — A–F European grades with percentile bands
- **Percentage converter** — piecewise 4.0 → 0–100 mapping with letter grade labels
- **Unified grading converter** — single `convertToSystem()` function + live selector UI on results page
- PDF export, persistent storage, manual grade correction, mobile camera capture

---

Built with Next.js · TypeScript · shadcn/ui · Claude API