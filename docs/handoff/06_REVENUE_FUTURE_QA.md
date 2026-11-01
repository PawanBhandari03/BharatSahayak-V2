# 06 - Revenue model, future scope, and the "three-word term"

## 1. Revenue model: "How will you earn money?"

**Principle:** the citizen never pays. Charging poor citizens for information about their own entitlements would defeat the purpose and attract trust problems. We earn from the organisations that **benefit when more eligible people claim**.

| # | Customer | What they pay for | Model |
|---|---|---|---|
| 1 | **State governments / departments** | Outreach and awareness to eligible beneficiaries; claim-rate dashboards; multilingual voice outreach. Departments already have information-education-communication budgets. | Annual licence per state or district, or per verified beneficiary reached |
| 2 | **CSC operators (VLEs)** | A tool that makes assisted applications fast; they earn a service fee from the citizen per application as they do today. | Revenue share / small platform fee per completed application |
| 3 | **CSR and foundations** | Fund a district: "sponsor 10,000 citizens". Reports on benefits unlocked. | Grants, sponsorship |
| 4 | **Providers who need eligible users** | Scholarship providers, skill-training centres (PMKVY), and regulated lenders for Mudra/Stand-Up India style loans, insurers. | Fee per qualified, **consented** lead or enrolment. Must be disclosed and never change who is shown as eligible |
| 5 | **Policy and research users** | Anonymised, aggregated insights: which schemes are least claimed, by district. | Data/insight subscription (no personal data, consent-based) |

**Guardrails (say these, judges like them):** pay-to-rank is not allowed; sponsors never change eligibility results; personal data is never sold; citizens are always free; every recommendation shows the official source.

**Unit economics (how to talk about it):** cost per user = AI tokens + WhatsApp conversation charges + voice minutes + hosting. Matching is rules-based (free to compute), so the AI cost is small. We will measure this in the pilot and aim for cost per beneficiary well below the value of benefits they unlock. Check current Twilio, Meta and Mistral pricing before quoting numbers. **Do not state a figure you have not checked.**

**Phased plan:** Phase 1 (pilot, funded by CSR/grant): one district, CSC onboarding. Phase 2: state-government licence. Phase 3: multi-state plus partner leads.

**30-second answer:** "Citizens use it free. We earn from the people who gain when eligible citizens claim: state departments that pay for outreach and claim-rate analytics, CSC operators who earn per assisted application with a revenue share, CSR funders who sponsor districts, and training or scholarship providers who pay per consented enrolment. Sponsors can never change eligibility results."

## 2. Future scope

- **More schemes and states** (all 28 states, UTs, municipal schemes); automated scheme-refresh pipeline with human review.
- **Languages:** from 3 to 12+ with regional dialect voice.
- **Document help:** photograph a document; AI extracts details; DigiLocker integration with user consent.
- **Apply for me:** guided or assisted application, status tracking, grievance help.
- **Proactive life events:** birth, marriage, job loss, retirement trigger alerts (Life Timeline).
- **Community network:** trained local champions and CSC partners as last-mile support.
- **Redrob/job angle (optional):** link skills schemes to verified jobs.
- **Impact dashboard:** claim-rate uplift per district for governments and funders.
- **Government 360:** one interface for certificates and services.

## 3. The "three-word term" the teacher asked about

I could not tell from your description which term it was ("CSV/CFV ... benefits ... UPS/CPS"). **Ask her**, or use the candidates below. The likeliest are **USP** and **TAM-SAM-SOM**.

| Term | Meaning | Your answer |
|---|---|---|
| **USP** (Unique Selling Proposition) | What makes you different | Voice-first and WhatsApp-first: works for people **without a smartphone or internet**, in their own language; proactive alerts; one engine for all schemes |
| **TAM / SAM / SOM** (market size, three terms) | Total, serviceable, obtainable market | TAM: citizens eligible for welfare (~800 million covered, per your sources). SAM: those reachable by phone and WhatsApp in 3 pilot languages and states. SOM: a pilot district to a few states in 2-3 years. **Compute real numbers with stated assumptions before quoting.** |
| **CAC / LTV** (customer acquisition cost / lifetime value) | Cost to acquire a user vs value over time | Acquisition through CSCs and partners keeps CAC low; value comes from partner and government contracts, not from the citizen |
| **CSR** (Corporate Social Responsibility) | Company funding for social causes | A funding channel (sponsor a district) |
| **UPI / DBT** (Direct Benefit Transfer) | Money goes straight into bank accounts | Our tool tells people what to claim; DBT delivers the money |
| **KPI** | Success measures | Schemes discovered per user, applications started and completed, benefits credited, cost per beneficiary, claim-rate uplift per district |

Likely "benefits" question: "What are the benefits of your solution?" Answer with **three groups**: **citizens** (find and claim money they are owed, free, in their language), **government** (higher scheme uptake, less leakage to middlemen, data on gaps), **partners** (verified, consented leads and CSR impact reporting).

## PROMPT FOR CLAUDE

```
Task: turn 06_REVENUE_FUTURE_QA.md into 2 clean pages for judges, in plain language:
(a) a revenue model slide's worth of content with a small table, and (b) a one-page FAQ with answers to:
"How will you earn money?", "What is your USP?", "What is your market size (TAM/SAM/SOM)?", "What are the benefits?",
"What are the KPIs?", "What is the future scope?".
For market size, use only figures that I give you or that you can cite from official sources with links.
Mark anything that is an assumption as "assumption". Do not invent statistics or pricing.
```
