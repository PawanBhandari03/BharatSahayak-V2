# 05 - Backend and database (Supabase or Firebase, swappable)

I was not sure whether you meant Supabase or Firebase. Today the repo uses **Supabase (PostgreSQL)**. The safest plan is to **hide the database behind one interface**, so you can show it working on Supabase and switch to Firebase (Firestore) by changing one env variable.

## Design

- `backend/db/index.js` reads `DB_PROVIDER=supabase|firebase` and exports one object with the same functions either way:
  `saveProfile`, `getProfileByMobile`, `saveRecommendations`, `getSession`, `saveSession`, `listApplications`, `upsertApplication`, `listReminders`, `createReminder`, `markReminderSent`.
- `backend/db/supabaseAdapter.js` (existing logic moved here) and `backend/db/firebaseAdapter.js` (Firebase Admin SDK, Firestore).
- Controllers and routes never import Supabase or Firebase directly.
- Schemas: Supabase tables `profiles`, `recommendations`, `whatsapp_sessions`, `applications`, `reminders` (SQL migration file `db/migrations/001_init.sql`). Firestore uses collections with the same names.
- Use the **server-side key only on the backend**. The frontend must never get the service-role key. Turn on row-level security for tables that the frontend reads.
- Backend must still run if the database is down: matching works without it; saves are queued/logged.
- Config via env vars and `.env.example`. No secrets in git.

## PROMPT FOR CLAUDE

```
Task: make the BharatSahayak backend database-agnostic and production-ready.
Read backend/server.js, backend/config/supabase.js, backend/controllers/*.js, backend/routes/*.js.
1. Create backend/db/index.js with a provider switch (DB_PROVIDER=supabase|firebase) and one interface:
   saveProfile, getProfileByMobile, saveRecommendations, getSession, saveSession, listApplications, upsertApplication,
   listReminders, createReminder, markReminderSent.
2. Move the existing Supabase code into backend/db/supabaseAdapter.js. Add backend/db/firebaseAdapter.js using firebase-admin (Firestore).
   Controllers/routes must only use backend/db/index.js.
3. Write db/migrations/001_init.sql for Supabase (profiles, recommendations, whatsapp_sessions, applications, reminders) with sensible
   indexes (mobile) and RLS enabled; document the Firestore equivalent in docs/DATABASE.md.
4. Make saves non-blocking and failure-tolerant (log and continue). Add input validation (zod or joi) on every route, rate limiting,
   helmet, CORS limited to the web origin, and request logging.
5. Provide .env.example listing all variables (no real values). Confirm no secret is committed (grep the repo).
6. Add npm scripts: dev, start, test, db:migrate (prints the SQL to run). Add tests for both adapters using mocks.
7. Report how to switch providers and what you tested for real vs mocked.
```
