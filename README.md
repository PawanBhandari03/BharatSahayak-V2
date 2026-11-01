# BharatSahayak 🇮🇳

Build what next India runs on

AI-powered government scheme discovery for every Indian citizen.
What is BharatSahayak?
BharatSahayak helps citizens discover government schemes, scholarships, welfare benefits, and grants they are eligible for — in their own language, without needing internet or a smartphone.
Features

# Web App

Multi-step onboarding form collecting user profile
AI-powered scheme matching from 20+ government schemes
Personalized dashboard showing eligible schemes with amounts
Benefit wallet showing total benefits available
Multilingual support

# WhatsApp Bot

Send "Hi" to +1 415 523 8886
Choose language: Hindi, Marathi, or English
AI collects your details conversationally
Get matched schemes instantly on WhatsApp
Works on 2G, no app needed

# Database

All user profiles saved to Supabase
Scheme recommendations stored per user
Real-time data persistence

# AI Integration

Mistral AI for multilingual conversations
Smart scheme eligibility matching
Personalized recommendations with reasoning

Tech Stack
LayerTechnologyFrontendReact + Vite + Tailwind CSSBackendNode.js + ExpressDatabaseSupabase (PostgreSQL)AIMistral AIWhatsAppTwilio SandboxDeploymentRender (backend) + Vercel (frontend)
Live Links

Website: https://bharat-sahayak-one.vercel.app
Backend API: https://bharatsahayak.onrender.com
WhatsApp: +1 415 523 8886

Team
Binary Builders

PawanSingh Jagdish Bhandari
Rahul H. Bramhankar

Problem Statement
₹2.6 lakh crore in government benefits go unclaimed every year. Not because the money isn't there. Simply because no one told Savitribai it was hers.# BharatSahayak
BharatSahayak — AI-powered government scheme discovery  for every Indian. WhatsApp + Voice calls + Zero internet  required. Built for Catalyst Hack 2026 by Team Binary Builders.
Whatsapp bot with adhar Voice pin

# Scheme data

All channels (web API, WhatsApp, voice) read schemes through `backend/services/schemeStore.js` from `scheme-data/schemes.json`
(schema: `scheme-data/scheme.schema.json`). Only records with `verified: true` are served unless `INCLUDE_UNVERIFIED=true`
(local dev only). `GET /api/schemes` returns the list.

```bash
cd backend
npm run validate:schemes                                   # schema, officialUrl, stale lastVerified (>180 days)
npm run draft:scheme -- <official-url> --id <scheme-id>    # AI draft -> scheme-data/drafts/ (verified:false)
npm test
```

## Weekly re-check of verified schemes

`npm run recheck:schemes` fetches each verified scheme's `sourceUrl`/`officialUrl`, drafts a fresh record with Mistral and
compares eligibility, amount, documents and deadline. It **never edits `schemes.json`**: differences go to
`scheme-data/recheck-report.md` and the changed ids to `scheme-data/needs-review.json`. Unreachable pages are listed and skipped.
A human checks the official page, edits `schemes.json`, and only then sets `verified: true` again.
`npm run recheck:schemes -- --demo` runs it on 3 schemes for a live demo.

Limits: it only re-checks URLs already in our list (no discovery, no crawling), needs `MISTRAL_API_KEY`, and strict TLS is kept,
so sites with incomplete certificate chains show up as unreachable (fix with `NODE_EXTRA_CA_CERTS=<intermediate.pem>`).

Run weekly with cron (Linux server): `0 6 * * 1 cd /path/to/repo/backend && npm run recheck:schemes >> recheck.log 2>&1`
or GitHub Actions (`.github/workflows/recheck.yml`): `on: schedule: [{cron: '0 6 * * 1'}]`, steps: checkout, `npm ci` in `backend`,
`npm run recheck:schemes` with `MISTRAL_API_KEY` from repo secrets, then open a PR/issue with the report.
