# Pitch script V2 (matches the build as of 1 Nov 2026): about 4:30

Two speakers: **P** = PawanSingh, **R** = Rahul. It only claims what the build can show.
Everything said below can be shown live. If a line starts with **[SHOW]**, do it on screen while saying it.

---

## Before you go on stage (10-minute checklist)

1. Start the backend (`cd backend && npm start`) and ngrok (`ngrok http 5000 --url=sharpie-disown-backshift.ngrok-free.dev`). Open `https://sharpie-disown-backshift.ngrok-free.dev/health`: it must show `{"ok":true}`.
2. Start the website (`cd frontend && npm run dev`) and open **http://localhost:5173/register?demo=1**.
3. On the demo phone, send `join spent-opinion` to +1 415 523 8886. Then send `hi` once and check you get a reply (the WhatsApp session lasts a few days).
4. Twilio allowance is limited. **Do not rehearse the WhatsApp part more than once.** Keep screenshots of a good run as backup.
5. If the venue Wi-Fi is bad, the website still works: it keeps a saved copy of the scheme list.

---

## The script

**[0:00-0:25: Who we are]**
**P:** Good morning, mentors and judges. We are Team Binary-Builders, working in Generative AI.
**R:** I am Rahul, this is Pawan. Our project is **BharatSahayak**: it tells people which government schemes they may qualify for, in Hindi, Marathi or English, on the web, on WhatsApp and by phone.

**[0:25-1:00: The problem]**
**P:** Government schemes only help people who know about them. Meet Savitribai, 52, a widow and farmer in Osmanabad, Maharashtra. She has a basic phone and low income.
**R:** There are central and state schemes that may apply to her. Today she would have to find them across many portals, in English. Nobody tells her. *(Say "estimated" and name your source if you quote any national "unclaimed" figure. If you cannot source it, leave it out.)*

**[1:00-2:00: Live demo, web]**
**P:** **[SHOW]** This is our form. Only five answers are required: age, gender, state, work, income. No Aadhaar, no OTP, no password.
**R:** **[SHOW]** For the demo we click Savitribai. *(click the "Savitribai" button at the bottom.)*
**P:** **[SHOW: dashboard]** In under a second: 23 of our 50 schemes may fit her answers. Each card says why it fits, lists the documents, and links to the official portal. Our own dataset puts three of them at about thirty thousand rupees a year in cash: PM-KISAN, Namo Shetkari and the Niradhar pension. *(Check this arithmetic against the cards before you say it, and say "according to our data".)*
**R:** **[SHOW: Schemes page]** All fifty schemes are here. **[SHOW]** I switch to Hindi, and the names and benefits change. If someone's answers are incomplete we say "possible", not "yes".

**[2:00-3:00: Live demo, WhatsApp]**
**R:** **[SHOW phone]** Most people we want to reach live on WhatsApp. I message the bot.
**P:** The bot chats in the person's language and asks the questions. When it has the answers, our **rules engine** picks the schemes, not the AI. We moved matching out of the AI because AI models invent schemes. The AI only talks; the rules decide.
*(If WhatsApp is slow, say: "It takes a few seconds on a free plan", then show the backup screenshot.)*

**[3:00-3:40: How it is built and kept honest]**
**R:** One shared scheme dataset and one eligibility engine feed the website, WhatsApp and the phone line. Fifty schemes today, each with an official link.
**P:** To be clear: **11 of these fifty are verified** against their official pages; the other 39 are not yet. We built the process for it: an AI drafts each record from the official page, a person approves it, and a weekly re-check job flags any change. It never edits the data by itself.

**[3:40-4:15: What is next, and the ask]**
**R:** Next: reminders before deadlines, speech recognition on the phone line, and reviewed scheme data for more states.
**P:** The citizen always stays free. Funding could come from state departments, CSC operators, CSR sponsors, and training or loan providers who benefit when eligible people claim.
**R:** We would value your feedback, especially on which district to pilot in. Thank you.

---

## Say this / do not say this

| Do not say | Say instead (true today) |
|---|---|
| "Deadline alerts and reminders" | "Reminders are our next step." (not built) |
| "Voice PIN / Aadhaar login" | Nothing: removed on purpose; no Aadhaar or OTP is collected |
| "Our AI call bot understands speech" | "The phone line greets and answers from our scheme list; speech recognition is next." (not tested end to end) |
| "Verified schemes" | "Fifty schemes with official links; 11 verified against their official pages, the rest in progress (a verify tool and checklist are ready)" |
| "We found the user 1.37 lakh rupees" | Use the dashboard numbers, and say they are the schemes' stated benefits |
| "We use the myScheme API" | "A curated dataset with official links. We would apply for data access to scale." |
| "Works offline / zero internet" | "Works on basic WhatsApp; no app to install" (voice needs a call, which is not demoed) |

## If a judge asks

- **Why not just a chatbot?** Chatbots invent schemes. Ours only suggests what a rules engine finds in the dataset (see the WhatsApp section above).
- **Is the data correct?** Not yet verified by a person: say so. Every scheme links to its official page, and a weekly re-check flags changes.
- **Privacy?** The form collects no Aadhaar and no OTP, and the matching runs in the browser. To write the short AI summary, the answers are sent to our server and on to our AI provider (Mistral). We do not store them in a database today; a database would come with reminders, and only with consent.
- **Revenue?** The citizen is always free. We earn from state departments, CSC operators, CSR sponsors and loan/training providers (full table in `PROJECT_DOCUMENTATION.md`, section 14).
- **If a mentor asks for a "three-word term"** (ask which one if unclear):
  - **USP:** the rules, not the AI, decide eligibility, so it cannot invent schemes; it works on WhatsApp in three languages with no app and no Aadhaar.
  - **TAM / SAM / SOM:** only quote numbers you can source. Say "we will size this in the pilot" if you cannot.
  - **KPI:** schemes discovered per user, applications started and completed, claim-rate increase per district.

## Timing

About 4:15 spoken, so there is about 45 seconds of slack for a slow WhatsApp reply. Cut the "How it is built" part first if you are running long.

## One more thing to say carefully

The count "23 may fit" includes broad schemes whose real condition our rules cannot check yet (for example schemes for pregnant women, or for urban housing). Say **"may qualify"**, never "qualifies for 23 schemes". If a judge asks, explain that this is exactly why we mark every scheme as unverified until a person has compared it with the official page.
