# 01 - Where do the schemes come from?

## The answer (for you, and for the judges)

**Use a curated dataset you own, seeded from official sources, with a human review step. Do not depend on a live API at demo time.**

Why:
- **No confirmed official public API.** myScheme.gov.in is the national scheme directory, and API Setu (MeitY's open API platform) lists myScheme as a partner, but I found no published myScheme endpoint. Access would need an application to MeitY / the myScheme team. Do not tell judges you use "the myScheme API".
- **Community datasets exist.** Several Hugging Face datasets (`*/gov_myscheme`) contain scheme data scraped from myscheme.gov.in. They are useful for a head start, but their own cards warn the data may be outdated or wrong. Their licence is unclear, so treat them as research input, not as truth.
- **Eligibility must be exact.** Wrong advice harms real people, so every scheme in your database should be checked against the official page.
- **Demo reliability.** A live API can fail on stage. Your own dataset cannot.

## Recommended approach: 3 layers

1. **Core dataset (now, for the hackathon).** Expand `scheme-data/schemes.json` from 14 to **40-60 high-impact schemes**: central schemes with big reach (PM-KISAN, Ayushman Bharat, PMAY, Ujjwala, PMJJBY, PMSBY, Atal Pension, Sukanya Samriddhi, Mudra, PMKVY, Stand-Up India, NSP scholarships, PM Matru Vandana ...) plus **Maharashtra state schemes** (your persona is Savitribai from Osmanabad): Sanjay Gandhi Niradhar, Shravan Bal, Majhi Ladki Bahin, MahaDBT scholarships, etc.
2. **Seeding helper (AI-assisted, human-checked).** A script takes a scheme URL or pasted text from the official site and drafts the JSON entry (eligibility fields, documents, amount, deadline). A human compares it with the official page and marks `verified: true`. Only verified schemes are used in matching.
3. **Scale plan (talk track, not built now).** Apply for API Setu / myScheme data access; use data.gov.in open data; add a monthly refresh job that flags changes; let CSC partners report corrections.

## Scheme record format (single source of truth)

One JSON file or one database table, used by web, WhatsApp and voice.

```json
{
  "id": "pm-kisan",
  "name": {"en": "PM-KISAN", "hi": "पीएम-किसान", "mr": "पीएम-किसान"},
  "category": "agriculture",
  "level": "central",
  "state": "all",
  "amount": 6000,
  "frequency": "yearly",
  "benefitSummary": {"en": "Rs 6,000 a year in 3 instalments", "hi": "...", "mr": "..."},
  "eligibility": {
    "minAge": 18, "maxAge": null, "gender": "any",
    "occupations": ["farmer"], "maxAnnualIncome": null,
    "requiresLand": true, "maritalStatus": "any",
    "categories": ["any"], "requiresBPL": false
  },
  "documents": ["Aadhaar", "Land record (7/12)", "Bank passbook"],
  "deadline": null,
  "howToApply": "Apply at pmkisan.gov.in or the nearest CSC",
  "officialUrl": "https://pmkisan.gov.in",
  "sourceUrl": "https://www.myscheme.gov.in/...",
  "verified": true,
  "lastVerified": "2026-11-01"
}
```

Rules: `null` means "no limit". Amounts in rupees as numbers. Every record needs `officialUrl`, `sourceUrl`, `verified`, `lastVerified`. Languages: en, hi, mr.

## PROMPT FOR CLAUDE

```
Task: build the scheme data layer for BharatSahayak V2.

1. Read scheme-data/schemes.json, backend/routes/schemes.js, backend/controllers/schemeController.js,
   backend/prompts/systemPrompt.js and frontend/src/services/schemeService.js. Note that the web app, the
   backend and the WhatsApp prompt currently use DIFFERENT scheme lists.
2. Define one schema (JSON Schema + a validator script) with the fields in 01_SCHEMES_DATA.md:
   id, name{en,hi,mr}, category, level, state, amount, frequency, benefitSummary{en,hi,mr}, eligibility{...},
   documents, deadline, howToApply, officialUrl, sourceUrl, verified, lastVerified.
3. Migrate the existing 14 schemes into the schema. Do not invent facts. If a field is unknown, set it to null
   and add the scheme id to a file NEEDS_REVIEW.md with what to check.
4. Add scripts/draft-scheme.js: given a URL or pasted text, call Mistral to DRAFT a scheme record, set
   verified:false, and write it to scheme-data/drafts/. A human must flip verified to true.
5. Add the target list of ~50 schemes (central + Maharashtra) to scheme-data/TODO_SCHEMES.md as a checklist
   of names and official URLs only. Do NOT fabricate eligibility numbers; leave them for the draft script
   plus human verification. If you cannot verify a figure from an official source, leave it null.
6. Make backend/routes/schemes.js, the WhatsApp flow and the voice flow all load schemes through ONE module
   (backend/services/schemeStore.js) that reads only verified:true records. Cache in memory, reload on file change.
7. Serve GET /api/schemes and expose the same data to the frontend (no second copy of the data).
8. Add a script `npm run validate:schemes` that fails on schema errors, missing officialUrl, or stale lastVerified (>180 days).
Report: which schemes are verified, which need review, and what you could not confirm.
```

## Answer to give judges (30 seconds)

"Our prototype runs on a curated, verified scheme dataset, expanded to about 50 schemes. Each record has machine-readable eligibility rules and an official source link. We chose this over a live API because there is no confirmed public API for scheme eligibility, and wrong advice is costly. For scale we would apply for API Setu / myScheme data access, use an AI-assisted drafting pipeline with human review, and run periodic refreshes."
