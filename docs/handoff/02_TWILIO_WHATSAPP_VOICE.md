# 02 - Revive Twilio WhatsApp (and voice)

## Why it "died"

The **Twilio WhatsApp Sandbox** is for testing only. A user's sandbox session lasts **3 days** after they send the join message; after that messages fail (error **63015**) until they re-join. Also check: a trial account running out of credit, an old ngrok URL in the webhook, and the Render free server being asleep.

## Manual steps (you do these in the browser)

1. Log in to the Twilio Console. If asked, use the **legacy console** for WhatsApp Sandbox (Messaging > Try it out > Send a WhatsApp message).
2. Note the **sandbox number** (the repo uses +1 415 523 8886) and your **join code** (`join <two-words>`).
3. On every phone that will test or demo: send `join <your-code>` to the sandbox number on WhatsApp. **Do this again on the demo morning**, because it expires after 3 days.
4. In Sandbox settings set **"When a message comes in"** to `https://<your-backend>/api/whatsapp/webhook`, method **POST**. (Check the route name in `backend/server.js`.)
5. Set "Status callback URL" to the same host (optional).
6. Check the account balance and that the Auth Token is the **new rotated** one (see 00_START_HERE).
7. **Backend env vars** (on Render/Vercel, not in git): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM=whatsapp:+14155238886`, `MISTRAL_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `PUBLIC_BASE_URL`.
8. **Keep the server awake.** Render's free tier sleeps and the first request can take 30-60 seconds, which Twilio will time out. Use a paid instance, or a free uptime pinger hitting `/health` every 5 minutes, or move the backend to a host without cold starts.
9. Test: send "Hi" from the joined phone. Watch the backend logs for `[Webhook] From: ...`.

For the **voice call**: buy or use a Twilio voice number, set "A call comes in" webhook to `https://<backend>/api/call/incoming` (POST). On a **trial account** Twilio can only call/receive from **verified numbers**, so verify the phones you will demo with (Console > Phone Numbers > Verified Caller IDs). Calling Indian numbers may need extra permissions and regulatory setup, so confirm in the Console before the demo and keep a recorded backup video.

**Production path (talk track):** move from the sandbox to a Twilio **WhatsApp sender** (Meta WhatsApp Business account, approved display name, approved message templates). Outbound reminders outside the 24-hour window must use **approved templates**.

## PROMPT FOR CLAUDE

```
Task: make the BharatSahayak WhatsApp bot and voice call reliable. Read backend/server.js,
backend/routes/whatsapp.js, backend/routes/call.js, backend/services/twilioService.js and backend/prompts/systemPrompt.js.

Fix and build:
1. Validate incoming Twilio requests with twilio.validateRequest (use X-Twilio-Signature and PUBLIC_BASE_URL),
   configurable off for local dev.
2. WhatsApp: respond 200 to Twilio immediately, then process. Replace the hard-coded scheme list in the system
   prompt with TOOL CALLING: give Mistral a function match_schemes(profile) that calls our shared eligibility engine
   (see 04 file) over the verified dataset. The model must only name schemes returned by the tool. Support
   Hindi, Marathi, English (language chosen on the first reply).
3. Store session state (language, collected profile, step) in the database (table whatsapp_sessions), keyed by phone,
   not in process memory, so restarts do not lose it. Keep the last 10 messages.
4. Voice: replace <Record> with <Gather input="speech dtmf" language="hi-IN" speechTimeout="auto"> to collect the
   caller's details by speech (name, age, state, occupation, income), ask one question at a time, run the same
   matcher, read out the top 3 schemes (name + amount) in Hindi, then offer: press 1 to get the full list on WhatsApp,
   press 2 to repeat. Use the matched list for the WhatsApp message instead of the hard-coded one.
5. Add GET /health that returns quickly without touching the database.
6. Add error handling: if Mistral/Supabase fails, send a short friendly fallback instead of silence.
7. Add a script `npm run twilio:check` that prints: env vars present (not their values), webhook URL we expect,
   and sends a test WhatsApp message to TEST_PHONE.
8. Write docs/TWILIO_SETUP.md with the manual console steps (sandbox join, webhook URLs, verified numbers).
9. Fix the wrong website link bharatsahayak.vercel.app in messages: use the PUBLIC_WEB_URL env var.
Test with Twilio's webhook simulator or curl using form-encoded bodies, and report what you could not test without real phones.
```
