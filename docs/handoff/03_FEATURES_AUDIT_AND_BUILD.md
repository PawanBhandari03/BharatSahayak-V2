# 03 - Check the 5 features, build what is missing

## What I saw in the repo (read from GitHub, not run)

| # | Feature (from your slides) | Status from the code | What is needed |
|---|---|---|---|
| 1 | Zero-internet Call Bot | **Partial.** Inbound Hindi call exists (`routes/call.js`). It records audio but never transcribes it, and the AI gets only the caller's number. | Speech input (`<Gather input="speech">`), real profile collection, shared matcher |
| 2 | Lost Benefit Detector + Deadline Alerts | **Not found in backend.** No `deadline` field in scheme data, no scheduler, no outbound reminders. Check `Dashboard.jsx` for a "missed" widget (may be demo numbers). | Add deadlines to data, a "missed/expiring" detector, scheduled WhatsApp + voice reminders at 30/15/3 days |
| 3 | Life Timeline AI | **Frontend exists** (`components/Timeline.jsx`, `pages/UserJourney.jsx`). Unknown if driven by real rules or hard-coded. | Generate from profile + scheme rules (age thresholds, child ages) |
| 4 | WhatsApp + Aadhaar Voice PIN | **WhatsApp: yes.** Voice PIN: only a `pin_hash` column exists. No flow found. | PIN set/verify flow (hashed), last-4 Aadhaar only; CSC onboarding as a described step |
| 5 | Benefit Wallet | **Frontend exists** (`BenefitWallet.jsx`). Probably uses sample totals. | Compute Received / Available / Pending / Future from real matches + application status |

Claude must **verify each row by reading and running the code** and correct this table.

## Design for the missing pieces

- **Deadlines:** add `deadline` (date or `"rolling"`) and `applicationWindow` to scheme records. Detector: for each saved profile, list eligible schemes whose deadline is within N days, or already passed ("missed" = was eligible, deadline passed, not applied).
- **Reminders:** table `reminders(id, profile_id, scheme_id, due_date, channel, status)`. A scheduler (node-cron, or a Render/Supabase scheduled job) runs daily, sends WhatsApp messages at 30/15/3 days (use an approved template in production; in the sandbox, plain text works only for joined users within the session), and optionally a Twilio outbound voice call reading the reminder in the user's language.
- **Life Timeline:** a function `buildTimeline(profile, schemes)` returns events: Now (eligible now), Next 12 months (turning 18/60/etc., child ages, deadlines opening), Later. Rules come from `minAge/maxAge` and child ages in the profile.
- **Wallet:** `received` (applications marked credited), `available` (eligible, not applied), `pending` (applied, not credited), `future` (timeline). Amounts from scheme `amount` per year.
- **Voice PIN:** 4 digits via keypad on the call (`<Gather input="dtmf" numDigits="4">`), stored only as a salted hash (bcrypt). Used to authenticate callers before reading personal data. Never store full Aadhaar.
- **Application tracking:** table `applications(id, profile_id, scheme_id, status, updated_at)` with statuses `not_started, in_progress, submitted, credited`. A simple manual update (admin / demo button) is enough for the prototype.

## PROMPT FOR CLAUDE

```
Task: audit and complete the 5 core features of BharatSahayak.
Step 1 - AUDIT: Read the whole repo. For each feature below, write docs/FEATURE_AUDIT.md with: where it lives
(file paths), whether it is real or hard-coded sample data, whether it works when run, and what is missing. Run the app to check.
Features: (1) Zero-internet call bot, (2) Lost-benefit detector + deadline alerts, (3) Life Timeline AI,
(4) WhatsApp + Aadhaar Voice PIN, (5) Benefit Wallet.
Step 2 - BUILD what is missing, using the design in 03_FEATURES_AUDIT_AND_BUILD.md:
 - deadline fields + detector (shared module), reminders table + daily scheduler, WhatsApp reminders, optional voice reminder call;
 - buildTimeline(profile, schemes) driven by real eligibility rules (replace hard-coded timeline data);
 - wallet computed from real matches + applications table (Received/Available/Pending/Future);
 - Voice PIN set/verify (bcrypt hash, 4 digits, DTMF on calls; WhatsApp: ask for PIN before showing personal data);
 - applications table + status update endpoint.
Keep ONE shared eligibility engine used by web, WhatsApp and voice. Add unit tests for the detector, timeline, wallet math.
Be honest: at the end list each feature as WORKING (ran it), PARTIAL, or NOT DONE, with evidence.
Do not store the full Aadhaar number anywhere.
```
