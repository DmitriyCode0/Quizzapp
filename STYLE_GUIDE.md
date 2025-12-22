# VocabCrafter AI Design System

## 1. Philosophy
VocabCrafter AI follows a clean, professional "Educational SaaS" aesthetic (similar to Linear Light Mode or Notion). 
The goal is to minimize visual noise, allowing users to focus on the vocabulary content.

## 2. Color Palette (Light Mode)

### Backgrounds
- **Main Canvas:** `bg-slate-50` (#F8FAFC) - Used for the full page background.
- **Cards/Panels:** `bg-white` (#FFFFFF) - Used for content containers.
- **Subtle Sections:** `bg-slate-50` (#F8FAFC) - Used for inner blocks (e.g., grammar explanation boxes).

### Text
- **Headings:** `text-slate-900` (#0F172A) - High contrast, bold.
- **Body:** `text-slate-700` (#334155) - Readable, softer than pure black.
- **Secondary:** `text-slate-500` (#64748B) - Used for labels and hints.

### Brand & Actions
- **Primary:** Indigo (`bg-indigo-600` / `text-indigo-600`).
- **Primary Hover:** `hover:bg-indigo-700`.
- **Accents:** Soft Indigo (`bg-indigo-50`).

### Status Colors
- **Success:** Emerald (`text-emerald-600` / `bg-emerald-50` / `border-emerald-200`).
- **Error:** Rose (`text-rose-600` / `bg-rose-50` / `border-rose-200`).
- **Warning/Bonus:** Amber (`text-amber-600` / `bg-amber-50` / `border-amber-200`).

## 3. Component Styles

### Buttons
- **Primary:** `bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg`.
- **Secondary:** `bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm`.
- **Icon Button:** `p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600`.

### Inputs
- **Style:** "Paper" look. White background, thin border.
- **Class:** `bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500`.

### Cards
- **Container:** `bg-white rounded-2xl shadow-xl border border-slate-200`.
- **Inner Section:** `bg-slate-50 rounded-xl border border-slate-100 p-4`.

## 4. Typography
- **Font:** Inter (Sans-Serif).
- **Sizes:** 
  - Page Titles: `text-3xl font-bold`.
  - Section Headers: `text-xl font-bold`.
  - Body: `text-base` or `text-sm`.
  - Labels: `text-xs font-bold uppercase tracking-wider`.

## 5. Spacing
- **Padding:** Generous padding (`p-6` to `p-10`) inside cards to create breathability.
- **Gaps:** `gap-4` to `gap-8` between major sections.
