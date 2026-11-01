# BharatSahayak - Round 2 Pitch Script (Catalyst Hack 2026)

Format: about 7 minutes of presenting, then mentor and judge Q&A. Two speakers: **P** = PawanSingh, **R** = Rahul. Swap the lines if you prefer. Speak slowly; the pauses matter.

---

## Slide 1 - Introduction (0:40)

**P:** Good morning, respected mentors and judges. We are Team **Binary-Builders**. I am PawanSingh Bhandari.

**R:** And I am Rahul Bramhankar. Our domain is **Generative AI**, and today we are presenting **BharatSahayak**.

**P:** In one line: BharatSahayak is an AI companion that tells every Indian which government benefits they already qualify for, on a WhatsApp chat or a plain phone call, with no app and no internet needed.

**R:** Let us start with why we built it.

---

## Slide 2 - The Problem (1:00)

**R:** India spends more than **₹15 lakh crore** on welfare every year. Yet about **₹2.6 lakh crore goes unclaimed** every year.

**P:** The money is there. People are not claiming it because they do not know it exists.

**R:** Meet Savitribai. She is 52, a widow farmer from Osmanabad, Maharashtra, with two acres of land and a basic keypad phone. She qualifies for around **9 schemes worth about ₹43,000 a year**. She has claimed **zero**, because nobody told her.

**P:** And it is not only rural India. Aarav, 18, a first-year student, is unaware of scholarships he is eligible for. Different people, same gap.

**R:** There are 1,000+ schemes across the Centre and states, and awareness among eligible citizens is under 5%. So this is **not a money problem. It is an information problem.**

---

## Slide 3 - Our Solution (0:50)

**P:** Our solution has three parts. **Input:** the citizen speaks or messages in their own language and gives a few basic details: age, state, occupation, income, category.

**R:** **AI engine:** a multilingual AI holds the conversation, and an eligibility engine checks those details against scheme rules.

**P:** **Output:** a personalised list of schemes with benefit amounts, the documents needed, and deadline alerts.

**R:** It serves four groups: students, professionals, entrepreneurs and citizens, so one companion covers every stage of life.

---

## Slide 4 - Key Features (1:00)

**R:** Five features. One: the **zero-internet call bot**. The citizen calls a number, and the AI speaks to them in Hindi. No smartphone and no data needed.

**P:** Two: the **lost-benefit detector with deadline alerts**. Most schemes go unclaimed because of missed deadlines, so we alert at 30, 15 and 3 days before.

**R:** Three: **Life Timeline AI**. When Savitribai's daughter turns 18, the scholarship alert reaches her automatically. We are proactive, not reactive.

**P:** Four: **WhatsApp plus a voice PIN**. One visit to a CSC centre, a 4-digit PIN, and she is set. We store only the last four digits of Aadhaar, never the full number.

**R:** Five: the **Benefit Wallet**. Everything received, available, pending and future in one place.

---

## Slide 5 - How It Works (1:45)

**P:** Now the technical flow. To be clear about status: **built** today are the web app with the eligibility matcher, the WhatsApp bot, and an inbound Hindi call flow. **Designed as next milestones** are the deadline-alert calls, Life Timeline, and Voice PIN onboarding at CSC centres.

**P:** **WhatsApp.** The citizen messages our WhatsApp number. **Twilio** forwards it to our **Node.js backend**, hosted on Render. A **Mistral large language model** talks to the user in Hindi, Marathi or English and collects the details a couple of questions at a time. We keep the last few messages as context so the chat feels natural.

**R:** **Matching.** On the web app, a **rules-based eligibility engine** checks age, gender, state, income, occupation and category against our structured dataset of 14 verified schemes, and the AI explains the result. On WhatsApp, the AI currently matches from a curated scheme list inside its prompt. Wiring WhatsApp and voice to the same rules engine, so eligibility is always rules-decided and checkable, is our next step.

**P:** **Voice.** The citizen calls our Twilio number. Today the call greets them in Hindi, reads out commonly applicable schemes, and if they press 1, sends the list to their WhatsApp. Next we add speech recognition, so the call collects the profile and runs the same matcher.

**R:** **Storage.** Profiles and recommendations are saved in **Supabase (PostgreSQL)**. The web dashboard is **React on Vercel**, and it shows the same Benefit Wallet.

**P:** For the user the journey is seven steps: visit a CSC, verify and set the PIN, connect on WhatsApp, the AI finds benefits, voice alerts follow, they apply with guidance, and benefits are credited.

---

## Slide 6 - Impact and Inclusivity (0:40)

**R:** The prototype speaks Hindi, Marathi and English today; 12+ languages is our target. Our design rule: if you have a phone number, you can use BharatSahayak. No smartphone, no internet, any language, and a secure PIN instead of passwords.

**P:** Our projected impact is about **₹1.37 lakh of benefits discovered per user** and **80% less time** spent searching and applying. These are projected figures, and a pilot will validate them. The reachable base is around 300 million non-smartphone users.

---

## Slide 7 - Roadmap and Vision (0:45)

**P:** Next, **Scale** to all states and districts, **Personalize** with smarter life-stage journeys, **Integrate** with more government platforms, and **Empower** as a Bharat-first opportunity ecosystem. Beyond schemes, this extends to education guidance, skill-to-job bridges, health and welfare, and financial inclusion.

**R:** Our vision: every citizen informed, every opportunity accessible, every dream possible.

**P:** That is our idea. We would love your feedback, especially on what to prioritise for a real pilot. Thank you.

---

# Q&A Preparation

## Q1 (MOST LIKELY): "Where do the schemes come from? Manual dataset or API?"

**Say this:**

"Right now our prototype uses a **curated, structured dataset** of schemes, stored as JSON. Each scheme has its benefit amount, required documents and machine-readable eligibility rules: age range, gender, state, income ceiling, occupation, marital status. We built and verified these by hand from official sources, so the prototype's matching is accurate and explainable.

For scale, doing it by hand does not work. There are 1,000+ schemes and they change every year. Our plan has three layers:

1. **Official sources as the base.** MyScheme.gov.in is the government's own scheme directory, and data.gov.in and API Setu are the official open-data and API channels. We would use whatever official API or data access is available and apply for data-sharing access where it is not.
2. **A structured scheme database.** Whatever the source, we convert each scheme into our own schema (eligibility rules, documents, deadlines, links) and store it in our database. An LLM can help extract rules from scheme PDFs, but **a human reviewer approves every scheme before it goes live**, because wrong eligibility advice harms real people.
3. **Keeping it fresh.** A periodic refresh job flags changes in amounts and deadlines for review, and state coordinators or CSC partners can report corrections.

So the answer is a **hybrid**: manual and verified for the pilot, official sources plus an AI-assisted, human-reviewed pipeline for scale. We deliberately do not let the AI invent scheme information."

*Be careful:* do not say "we will use the MyScheme API" as a fact. We have not confirmed that a public API exists or what its terms are. Say "we would explore it and request access".

## Q2: "How do you stop the AI from giving wrong information?"

"Our design is that eligibility comes from a rules engine over a verified dataset, and the AI only explains. Today that holds on the web app. On WhatsApp the AI matches from a curated list in its prompt, and the voice call is a simple demo flow. Our next step is to route all channels through the same rules engine, so every reply is grounded in the same dataset. We also tell users which documents to verify at a CSC before applying."

*(See "Known gaps" below. This is exactly what you are saying you will fix.)*

## Q3: "What about privacy and Aadhaar?"

"We store only the **last four digits of Aadhaar** and a **hashed PIN**, never the full number or biometrics. Full Aadhaar verification needs UIDAI authorisation, so we plan to do it through CSC partners who are already authorised. We would also add explicit consent and data minimisation."

## Q4: "How is this different from MyScheme or UMANG?"

"Those are discovery portals. They need a smartphone, internet, literacy and the knowledge that you should search. We go to the citizen: voice calls in local languages, WhatsApp, proactive alerts, and tracking. We want to be the delivery layer on top of those sources, not a competitor to them."

## Q5: "Is this real, or a demo? What is Twilio doing?"

"It is a working prototype: a WhatsApp bot, a voice call flow, a web dashboard and a database. WhatsApp is on the **Twilio sandbox** for now. For production we would move to the WhatsApp Business API with approved templates. Twilio handles the telephony: it receives the WhatsApp message or call and forwards it to our backend."

## Q6: "What does it cost, and how does it make money?"

"Per user the cost is mainly the AI call plus WhatsApp and voice minutes, which is small compared with the benefits discovered. For sustainability: government or CSC partnerships (CSCs already serve villages), CSR funding, and B2B channels such as scholarship and skill-program providers who want to reach eligible people. The citizen stays free."

## Q7: "How will you reach rural users?"

"Through CSC centres and community champions for onboarding. After that the user needs only a phone: an inbound call or a call from us. Local languages and voice remove the literacy barrier."

## Q8: "How will you measure success?"

"Schemes discovered per user, applications started and completed, and benefits actually credited. In a pilot district we would compare claim rates before and after."

## Q9: "What would you do first with more time?"

"Three things: automate and review the scheme pipeline, connect the pilot to real CSC onboarding, and add application tracking so we measure benefits received, not just benefits found."

## Questions to ask them (feedback)

- "Which single scheme category should we pilot first: farmers, widows, or students?"
- "Do you know of an official data source or partner for scheme data?"
- "What would make you trust an AI to tell you about government benefits?"

---

# Known gaps: read this before you present (do not say these unprompted, but never claim otherwise)

I read your public GitHub repo to write the technical section. These are the places where the slides promise more than the code currently does. If a judge asks, answer honestly and say it is next on the roadmap:

1. **Scheme data is not consistent across channels.** The web app and backend use `scheme-data/schemes.json` (14 schemes). The WhatsApp bot uses a separate hard-coded list of 15 in `systemPrompt.js`. The README says "20+". **Fix:** one source of truth, and use "14 verified schemes in the prototype" in your speech. Never say 20+ or 1,000+ as what you have built.
2. **The voice call is not grounded.** In `call.js` the AI is asked for "top 3 schemes" without being given your dataset or the caller's profile, so it could recommend something wrong. Pressing 1 sends a fixed list of five schemes. **Fix:** collect the profile on the call, run the matcher, and pass the matched schemes to the AI.
3. **Deadline alerts and proactive outbound calls:** from the code I read, I only found the inbound call flow, not the scheduled outbound alerts. Present these as "designed, next milestone" unless you have them working.
4. **Aadhaar Voice PIN and CSC onboarding** are in the design and the database has a PIN field, but treat them as roadmap, not live.
5. **Sessions are in memory,** so a server restart loses conversation context. Fine for a prototype, and worth knowing.
6. **The ₹1.37 lakh and 80% figures are projections,** which your slide already says. Say "projected" aloud.
7. **Languages:** slides 3 and 6 say 12+. The prototype speaks Hindi, Marathi and English on WhatsApp and Hindi on voice. Say "12+ is the target, the prototype speaks 3" once, aloud.
8. **Voice speech recognition does not exist yet:** the call records audio but does not transcribe it or use it. Do not say the AI "understands" the caller's speech on calls.
9. **Before any live demo:** the README still says "Built for Redrob Ideathon 2026"; the bot and call messages link `bharatsahayak.vercel.app`, not your real `bharat-sahayak-one.vercel.app`; and Twilio sandbox users must first send the "join <code>" message before the bot replies.
10. Slide 2 numbers (₹2.6 lakh crore, under 5% awareness) come from your original sources (DBT Mission India, CAG, MyScheme, NITI Aayog 2024). Be ready to name them if asked.

One honest line that works well with judges: "The matching engine and channels are built. The scheme data pipeline and the CSC onboarding are what we want to build with your guidance."
