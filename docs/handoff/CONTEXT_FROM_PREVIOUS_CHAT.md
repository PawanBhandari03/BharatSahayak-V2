# Context from the previous Claude chat (read this first in a new session)

This summarises decisions and facts from the earlier conversation, so a new Claude session starts with the same background. Verify anything uncertain by reading the code.

## Who and what

- User: PawanSingh Jagdish Bhandari. Team **Binary-Builders** with Rahul H. Bramhankar. Domain: Generative AI.
- Project: **BharatSahayak**, an AI companion that tells citizens which government schemes they qualify for, via web app, WhatsApp and voice call (Hindi, Marathi, English). Built first for the Redrob Ideathon, now reused for **Catalyst Hack 2026**.
- Catalyst Hack round 1: a 7-slide idea deck (done, in `BharatSahayak_CatalystHack2026.pptx` on the Desktop; navy/saffron/green design, no live links). Round 2: explain the idea to mentors and judges and take feedback.

## State of the original code (read from GitHub, not run)

- Stack: React + Vite + Tailwind (Vercel), Node + Express (Render), **Supabase** (PostgreSQL), Twilio (WhatsApp sandbox + voice), Mistral AI. There is no Firebase.
- `schemes.json` has 14 schemes. The WhatsApp prompt has a separate hard-coded list of 15. The frontend has its own matcher. These are inconsistent. The README claims "20+".
- Voice call: records audio but does not transcribe it; the AI only gets the caller's number; pressing 1 sends a fixed list.
- Deadline alerts, outbound reminders and the Voice PIN flow were not found. Only a `pin_hash` column exists. Life Timeline and Benefit Wallet exist in the frontend, possibly with sample data.
- The original `.env` files were committed publicly. All keys (Mistral, Twilio, Supabase) must be treated as leaked: rotate and revoke them. They were removed from this new repo.
- Slow: the Mistral call and database save happen before results show, and Render's free tier sleeps.

## Decisions made

1. New private repo, fresh history (this one). New Render and Vercel deployments for submission, new keys, old keys revoked. The old repo becomes private after the new site works.
2. **Scheme data**: curated, verified dataset owned by us (target ~50 schemes, central + Maharashtra), each with an official source link and `verified` flag. No confirmed public myScheme API (API Setu lists myScheme as a partner; no endpoint found). Scale plan: apply for data access, AI-drafted records with human review.
3. One shared eligibility engine used by web, WhatsApp (tool calling) and voice. Matching runs client-side so results appear in under 1 second; AI explanations and DB saves happen afterwards.
4. Form becomes a 3-step wizard (max 12 fields). Add a **Demo mode** with a "Fill demo data" button and 3 personas: Savitribai, Aarav, Rahul.
5. Database sits behind one interface (`DB_PROVIDER=supabase|firebase`), default Supabase.
6. Twilio: the WhatsApp sandbox expires 3 days after join; re-send `join <code>`. Update the sandbox webhook to the new backend URL. Keep the server awake.
7. Revenue (citizen always free): state departments, CSC operators, CSR sponsors, scholarship/training/lender partners (consented leads, never pay-to-rank), anonymised insights.
8. **Two USPs**: (a) works for people with no smartphone or internet, via voice and WhatsApp in their language; (b) proactive alerts before deadlines and on life events, instead of a search portal. Claim (b) as live only after it works.
9. Teacher's three-word term is unknown (likely USP or TAM/SAM/SOM). See `06_REVENUE_FUTURE_QA.md`.
10. Script must stay under 5 minutes for two speakers: `07_SCRIPT_UNDER_5_MIN.md`.

## Open items

- The user may have an unexplained broken "tool" (probably the WhatsApp bot or an expired Supabase project / Render sleep). Check Twilio sandbox join, Twilio balance, webhook URL, Render logs, Supabase paused state.
- Confirm with the hackathon whether the judges need repo access (collaborators or public at submission).

## How to work

Do files `01` to `05` in order, one at a time, using each file's "PROMPT FOR CLAUDE" block. Never claim a feature works unless you ran it. Never commit secrets.
