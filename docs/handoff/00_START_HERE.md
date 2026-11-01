# BharatSahayak V2 - Handoff Pack (start here)

Use this pack with a fresh Claude session. Files are numbered in build order. Give Claude **one file at a time**: paste the file's **"PROMPT FOR CLAUDE"** block, and let it finish before the next.

| # | File | What it does |
|---|------|--------------|
| 00 | this file | Context, repo setup, **security warning**, assumptions |
| 01 | `01_SCHEMES_DATA.md` | Where schemes come from: dataset vs API, step by step |
| 02 | `02_TWILIO_WHATSAPP_VOICE.md` | Revive WhatsApp (sandbox expired) and the voice call flow |
| 03 | `03_FEATURES_AUDIT_AND_BUILD.md` | Check all 5 features exist; build the missing ones |
| 04 | `04_UI_SPEED_FORM_DEMO.md` | Modern UI, speed, shorter form, Demo Data button, accurate matching |
| 05 | `05_BACKEND_DATABASE.md` | Backend that works with Supabase or Firebase |
| 06 | `06_REVENUE_FUTURE_QA.md` | Revenue model, future scope, the "three-word term" answers |
| 07 | `07_SCRIPT_UNDER_5_MIN.md` | Short 2-person script (about 4 minutes) |

## Project in one paragraph

BharatSahayak tells Indian citizens which government schemes they qualify for, via a web app, a WhatsApp bot and a voice call, in Hindi, Marathi and English. Stack today: React + Vite + Tailwind (Vercel), Node + Express (Render), Supabase (PostgreSQL), Twilio (WhatsApp sandbox + voice), Mistral AI. Original repo: `github.com/PawanBhandari03/BharatSahayak`.

## IMPORTANT: security problem in the current repo

The public repo has `backend/.env` and `frontend/.env` **committed**. Anyone can read those keys. Before anything else:

1. **Rotate every secret**: Mistral API key, Twilio Auth Token, Supabase service key (and anon key if exposed).
2. **Never copy `.env` into the new repo.** Add `.env`, `node_modules`, `dist`, `.vite` to `.gitignore`, and commit a `.env.example` with empty values.

## Step 0: create the new repo (hackathon copy)

Run these yourself (replace `BharatSahayak-Catalyst` with your repo name):

```bash
git clone https://github.com/PawanBhandari03/BharatSahayak BharatSahayak-Catalyst
cd BharatSahayak-Catalyst
rm -rf .git backend/.env frontend/.env frontend/dist frontend/.vite
git init -b main
git add . && git commit -m "Initial commit: BharatSahayak V2 base"
gh repo create BharatSahayak-Catalyst --public --source=. --push
```

(No `gh`? Create an empty repo on github.com, then `git remote add origin <url> && git push -u origin main`.)

Update the README: remove "Built for Redrob Ideathon 2026", name Catalyst Hack 2026.

## Assumptions I made (change if wrong)

- You said the backend should work "in Firebase ... anywhere it is connected". I read this as **Supabase or Firebase**. File 05 makes the database swappable, default Supabase (already used).
- "Twilio is dead on WhatsApp" = the **Twilio WhatsApp sandbox expired** (sandbox sessions last 3 days and users must re-send the join message). File 02 covers it.
- The three-word term the teacher asked about is not clear to me. File 06 covers the likely candidates (USP, TAM/SAM/SOM, CAC/LTV, CSR). **Ask her which one** if you can.

## Rules for Claude (paste at the top of every session)

```
You are working on BharatSahayak V2 in the repo I will point you to.
Rules: read the existing code before changing it; keep changes small and testable;
never commit secrets; use .env + .env.example; after each task run the app and the tests
and tell me exactly what passed and what did not. If something is uncertain, say so instead of guessing.
Do not claim a feature works unless you ran it.
```
