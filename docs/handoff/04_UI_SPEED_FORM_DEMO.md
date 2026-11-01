# 04 - Modern UI, speed, shorter form, Demo button, accurate matching

## Problems to fix (what you told me)

1. UI looks old and boring.
2. Scheme generation is slow after submitting details.
3. The form is too long.
4. You need a **Demo Data** button for the prototype demo.
5. Matching must be accurate.

## Why it is slow (likely causes from the code)

- The match flow calls Mistral (an LLM) **before** showing results, and also saves to Supabase, in sequence. LLM calls take seconds.
- The Render free-tier backend **sleeps**; the first request can take 30-60 seconds.
- Matching logic is duplicated (frontend `schemeMatcher.js`, backend `routes/schemes.js`) and may re-fetch data.

**Fix:** show results **instantly** from the rules engine (milliseconds, in the browser), and let the AI explanation and the database save happen **afterwards** in the background.

## Speed plan

- Matching runs **client-side** (or in a shared module) on the verified dataset: results in under 100 ms. No network wait.
- AI "why you qualify" text: load **after** results appear, streamed or lazy, with a skeleton placeholder. Pre-written explanations come from the dataset's own `benefitSummary`, so the page is useful even if AI fails.
- Database writes are **fire-and-forget**. Never block the screen on them.
- Backend always awake (see 02), `/health` endpoint, gzip, cache `/api/schemes` with `ETag`.
- Frontend: route-level code splitting (already present), lazy images, preconnect to API host, no heavy animation libraries on first paint.
- Target: form submit to visible results **under 1 second**. Measure with Lighthouse and report the numbers.

## Shorter form: 3 steps, 12 fields max

| Step | Title | Fields |
|---|---|---|
| 1 | About you | Name, Age, Gender, State, District, Mobile (optional) |
| 2 | Work and income | Occupation, Annual income (range chips), Category (General/OBC/SC/ST), *Owns farm land? (only if farmer)*, *Land in acres (only if yes)* |
| 3 | Family | Marital status, Children (count), BPL / ration card (Yes/No), Has smartphone (Yes/No) |

Rules: use **chips/segmented buttons** instead of dropdowns where options are few; **conditional fields** (show land questions only for farmers; widow-specific items only when relevant); **progress bar**; auto-advance; remember answers in `localStorage`; **no Aadhaar field** (collect the PIN later in the voice flow). One screen per step, thumb-friendly on a phone.

## Demo Data button (for your demo)

- Visible **"Demo mode"** switch in the footer or `?demo=1` in the URL. When on, a floating button **"Fill demo data"** appears (admin-style).
- It opens a small menu with 3 personas, and one click fills the whole form **and** jumps to results:
  1. **Savitribai** - 52, female, widow, farmer, Osmanabad (Maharashtra), 2 acres, income Rs 48,000, BPL, keypad phone, 2 children.
  2. **Aarav** - 18, male, student, Pune (Maharashtra), family income Rs 2,00,000, OBC.
  3. **Rahul** - 26, male, entrepreneur / salaried professional, Mumbai, income Rs 4,50,000.
- Also a **"Reset"** option. The button must not appear in normal mode.
- Demo profiles live in `frontend/src/demo/personas.js`. Each has an `expectedSchemes` list so tests can assert the matching.

## Accurate matching

- **One engine**: `shared/eligibility.js` (pure functions, no network), used by the web app, WhatsApp tool-calling and voice. Delete the duplicate matchers.
- Declarative rules read from the scheme record (age, gender, state, income ceiling, occupation, land, marital status, category, BPL). No scheme-id special cases hidden in code; if a scheme needs a special rule, express it in the data (`requiresLand`, `requiresBPL`, `incomeOrBPL`).
- Return for each scheme: `eligible` (yes / maybe / no), `score`, `reasons[]` (why yes), `blockers[]` (why not), `missingDocuments[]`. Show "maybe" when a needed answer is missing instead of guessing.
- Income is stored as a **number** (convert range chips to their upper bound once, in one place) to avoid the string-parsing bugs in the old code.
- **Tests**: for each persona, assert the exact expected scheme IDs. Add edge cases: age exactly on the boundary, wrong state, missing income, widow under 40.

## UI design direction (modern, calm, Indian)

- Palette: deep indigo `#1B1740`, saffron `#FF9933`, India-green `#138808`, soft lavender `#F3F1FF`. Dark text on light cards. Same palette as the presentation.
- Typography: a clean sans (Inter or Poppins) with a serif display font for headlines; large, readable text; strong contrast.
- Hero: one clear sentence ("Find every benefit you deserve in 60 seconds"), a primary button "Check my benefits", a "Try on WhatsApp" secondary button, trust strip.
- Cards with soft shadows, rounded corners, icon in a coloured circle, subtle hover motion. Scheme cards show: name, amount badge, "Why you qualify", documents chips, deadline countdown, "How to apply".
- Results page: big **total benefit** number counting up, filter chips (All / Eligible now / Maybe / Missed), the **Benefit Wallet** with four colours.
- Language switcher (EN / हिं / मर) in the navbar; remember the choice.
- Mobile first, responsive, light + dark mode if time allows, accessible (focus rings, labels, alt text, 4.5:1 contrast).
- Loading states: skeleton cards, never blank screens.

## PROMPT FOR CLAUDE

```
Task: modernise BharatSahayak's frontend and fix speed, form length, demo data and matching accuracy.
Read frontend/src (App.jsx, pages/*, components/*, utils/schemeMatcher.js, services/*) and backend/routes/schemes.js first.

1. SHARED ENGINE: create shared/eligibility.js (pure functions). It takes a profile and the verified scheme list and returns, per scheme,
   {eligible: 'yes'|'maybe'|'no', score, reasons[], blockers[], missingDocuments[]}. Remove the two duplicate matchers and the
   scheme-id special cases (move them into scheme data fields). Store income as a number. Write unit tests in shared/eligibility.test.js
   for the three personas in 04_UI_SPEED_FORM_DEMO.md (Savitribai, Aarav, Rahul) with exact expected scheme IDs, plus boundary cases.
2. SPEED: run matching client-side so results show in <1s after submit. Move the Mistral explanation and Supabase save AFTER results are
   shown (background, non-blocking, with skeleton placeholders and a fallback to the dataset's benefitSummary). Cache /api/schemes with ETag.
   Add /health. Measure with Lighthouse and report before/after numbers.
3. FORM: replace the long form with a 3-step wizard (About you / Work and income / Family), max 12 fields, chip buttons, conditional fields,
   progress bar, autosave to localStorage, no Aadhaar field, mobile friendly.
4. DEMO: add a Demo mode (toggle in footer or ?demo=1). When on, show a floating "Fill demo data" button with 3 personas
   (Savitribai, Aarav, Rahul) that fills the form and jumps to results, plus Reset. Personas in frontend/src/demo/personas.js with expected schemes.
5. UI: redesign with the palette indigo #1B1740, saffron #FF9933, green #138808, lavender #F3F1FF; clean sans + serif display font; modern hero,
   rounded cards with soft shadows, scheme cards (amount badge, why you qualify, documents, deadline countdown, how to apply),
   count-up total benefit, Benefit Wallet (Received/Available/Pending/Future), filter chips, EN/HI/MR language switcher, skeleton loaders,
   fully responsive, accessible. Keep Tailwind. Avoid generic template look.
6. Run the app, click through every persona, and report: tests passing, Lighthouse numbers, screenshots described, and anything not finished.
Do not leave hard-coded sample numbers in the wallet or dashboard unless clearly labelled "demo".
```
