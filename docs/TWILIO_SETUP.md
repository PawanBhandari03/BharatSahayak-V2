# Twilio WhatsApp + voice setup (sandbox)

Your sandbox sender is **+1 737 250 8034**, join code **`join twilio-trial`**.
Never put the Account SID / Auth Token in git; they live in `backend/.env` (ignored).

## 1. Backend env (`backend/.env`)

```
TWILIO_ACCOUNT_SID=...            # from the Twilio console home page
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+17372508034
MISTRAL_API_KEY=...
MISTRAL_MODEL=open-mistral-nemo   # free tier; mistral-large-latest needs a paid plan
WHATSAPP_DAILY_CAP=80             # server stops sending after this many messages a day
INCLUDE_UNVERIFIED=true           # dev/demo only, until schemes are verified
```

## 2. Give Twilio a public URL for your local backend

Twilio cannot reach `localhost`. In a terminal:

```
cd backend && npm start          # backend on port 5000
ngrok http 5000                  # prints https://xxxx.ngrok-free.app
```

Check it works: open `https://xxxx.ngrok-free.app/health`; it should show `{"ok":true}`.
The ngrok URL changes every time you restart ngrok (free plan), so repeat step 3 then.
For a permanent URL, deploy the backend (Render) and use that URL instead.

## 3. Point the sandbox at the webhook

Twilio Console -> Messaging -> Try it out -> Send a WhatsApp message -> **Sandbox settings**:

- **When a message comes in**: `https://xxxx.ngrok-free.app/api/whatsapp/webhook`, method **POST**
- Status callback URL: leave empty (saves traffic)
- Save.

## 4. Join the sandbox (each tester, every ~3 days)

From WhatsApp on +91 84594 65421, message **+1 737 250 8034** with exactly: `join twilio-trial`
(or scan the QR code on the same console page). Sessions expire; re-send the join message when the bot goes silent.
Only numbers that joined can talk to the bot.

## 5. Test

Send `Hi` to +1 737 250 8034. The bot asks for a language, then age/state/occupation/income, then lists matching schemes.
Backend log shows `[Webhook] From: whatsapp:+91...`.

## 6. Voice (optional, needs a Twilio phone number)

Console -> Phone Numbers -> Manage -> Active numbers -> your number -> Voice Configuration:
**A call comes in** -> Webhook -> `https://xxxx.ngrok-free.app/api/call/incoming` (POST).
Trial accounts can only call/receive from verified numbers. The call records 30 seconds; the AI currently
answers from the scheme list (it does not transcribe the recording yet).

## Saving your free message allowance

- Each bot reply is one outbound message. `WHATSAPP_DAILY_CAP` stops the server before the limit.
- Test the web app and the matching API (`POST /api/match-schemes`) first: they cost no Twilio messages.
- Keep the Mistral model on the free `open-mistral-nemo`.
