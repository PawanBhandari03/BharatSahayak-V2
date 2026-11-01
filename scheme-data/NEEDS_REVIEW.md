# Needs review before any scheme can be `verified: true`

All 14 migrated schemes are `verified: false`: nobody has compared them with the official pages yet. Nothing below is confirmed;
these are the places where the old data sources disagree with each other, or look doubtful to me (I could not check them).

Applies to every scheme: `sourceUrl` and `lastVerified` are null; `deadline` was reset to null (the old frontend deadlines were
placeholder dates, mostly already past); Hindi/Marathi `name` and `benefitSummary` are null (no translations exist yet);
`frequency` is null unless the old data said it plainly; `requiresBPL` is null everywhere.

| id | what to check |
|---|---|
| pm-kisan | `maxAnnualIncome` 500000 came from the old JSON. I believe the scheme has no income cap (it excludes income-tax payers and some post-holders). `requiresLand: true` is inferred from the land-record document and the frontend text. |
| sanjay-gandhi-niradhar | `amount` 18000/yr vs frontend "₹1,500/month". Income cap 100000 vs the document list saying ≤ ₹21,000/yr. Age 18-65. |
| ignwps | Amount 3600/yr vs "₹300-₹500/month + state top-up". Age band 40-79 and income cap. |
| ayushman-bharat | Income cap 200000 and minAge 0 may not match the actual rule (not income-based as far as I know). Check senior-citizen (70+) rule. |
| pmuy | `amount` 1200 = 4 refills x ₹300 per frontend; it is a subsidy, not the connection benefit. Income cap 200000. |
| pmay-g | Selection is by SECC/Awaas+ list, not direct application; income cap 200000 is questionable. Amount 120000 vs "+ extras". |
| pmjjby, pmsby | Age bands 18-50 and 18-70 (matches my understanding; unchecked). Premiums quoted in summary. |
| mahadbt-shetkari | `amount` 50000 vs "up to 50% subsidy (≤ ₹2.4 Lakh)". `requiresLand` left null: check. |
| mudra-loan | `amount` 100000 vs "up to ₹10 Lakh". Occupation list includes "farmer / kisan" and "other": check. |
| pmkvy | `amount` 8000 is an average reward. Occupations student/other only. |
| startup-india | `amount` 500000 vs summary "up to ₹20 Lakh seed fund". |
| pmsss | `amount` 150000 vs summary "₹30,000/year + maintenance". Scheme is for J&K/Ladakh students, but `state` is "all": domicile is not modelled. |
| atal-pension | `maxAnnualIncome` 500000: I do not think this is an official rule. |

## Could not confirm
Everything above. Also the official URLs (`officialUrl`) were carried over from the frontend file and have not been opened by me.
In this environment several .gov.in sites failed to load from Node (incomplete certificate chain, DNS, timeout), so automated
re-checking will need those handled (see README).

## Added later (16 schemes, all `verified: false`, written from my general knowledge, not from official pages)
Only constraints I was fairly sure of are filled in; the rest are null. Check each against the official site before verifying.

| id | what to check |
|---|---|
| sukanya-samriddhi | Girl must be 10 or younger to open the account (`maxAge`), but the profile age is the user's own: this rule really means "has a daughter under 10". Not modelled. |
| pm-matru-vandana | Meant for pregnant/lactating women on their first living child; age 19+ is all we model, so older women match too. Amount and instalments to confirm. |
| pm-svanidhi, pm-vishwakarma | Loan/toolkit amounts and registration conditions to confirm. |
| pmjdy | `minAge: 10` is from memory. |
| ignoaps, igndps | Monthly amount left null (central share and state top-up vary). Age bands and "80% disability" rule to confirm. `requiresBPL` is only enforced when the user answers the BPL question. |
| pm-jay-vay-vandana | Age 70+ rule and ₹5 lakh cover to confirm; overlaps with `ayushman-bharat`. |
| pmfby | No amount (premium-based). Enrolment cut-off dates by season not modelled. |
| pm-sym | Age 18-40 and income cap ₹15,000/month (stored as 180000/yr), `amount` 36000 = ₹3,000/month pension: confirm. |
| mgnrega | Household-based; modelled as age 18+ only. |
| post-matric-sc | Income cap 250000 and category SC to confirm. |
| majhi-ladki-bahin | Age 21-65, income cap 250000, ₹1,500/month: confirm current status; rules and payments have been reported to change. |
| shravan-bal | Amount null; age 65+ and BPL/income rule to confirm. |
| namo-shetkari | `requiresLand` true; amount 6000/yr to confirm; depends on PM-KISAN enrolment. |
| mjpjay | Income/ration-card conditions not modelled (left open to all). Cover amount to confirm. |

## Hindi and Marathi text
All 30 schemes now have `name` and `benefitSummary` in Hindi and Marathi. They were written by Claude (an AI), not by a native speaker or the departments. Official scheme names in each language, and the wording of the benefit lines, need a native-speaker check before the demo is called "verified". `documents` and `howToApply` are still English only.

## Added to reach 50 (20 schemes, all `verified: false`)
Written from general knowledge, not from official pages (the official scheme portal could not be read automatically). Hindi and Marathi text is AI-written. `documents` and `howToApply` are typical, not confirmed. Check each item below against the official page before verifying.

| id | what to check |
|---|---|
| pmay-u | Income bands (EWS/LIG/MIG), central assistance amount, and the "urban area only" rule are NOT modelled; left open to adults. |
| jsy | Amount depends on state category and rural/urban; left null. Age 19+ is from memory. |
| pm-kmy | Age 18-40, ₹3,000/month at 60 (stored as 36000/yr), small/marginal land holding limit (about 2 hectares) not modelled. |
| pm-kusum | Several components; benefit amount varies by state; left null. |
| kcc | Official page link is the PM-KISAN portal (a guess); check the correct source. Fishers and livestock keepers can also get KCC; not modelled. |
| nfsa | Eligibility is by state-issued ration card category (priority households / AAY), not by income; left open. Quantity per person to confirm. |
| nfbs | ₹20,000 and BPL rule from memory; age of the deceased earner (18-59) not modelled. |
| csss | Income limit 450000 and ₹12,000/year from memory; top-percentile merit rule not modelled. |
| pre-matric-sc, post-matric-st | Income limit 250000 from memory; amounts vary by course; left null. |
| lek-ladki | Staged payments totalling ₹1,01,000 and eligibility (ration card colour, birth date cut-off) to confirm; `maxAge` 18 is the girl's age. |
| rajarshi-shahu | Income limit 800000 and covered categories (OBC / EWS / SEBC) to confirm; SEBC is not a form option. |
| ramai-awas, shabari-awas | Rural-only and amount to confirm; left null. |
| pm-surya-ghar | Up to ₹78,000 and the "own a house with a roof" rule from memory. |
| scss | Interest rate changes each quarter; no rupee amount. Early-retirement exceptions (age 55+) not modelled. |
| pmegp | Subsidy percentage and project limits vary; left null. Education and area rules not modelled. |
| adip | Income limit 360000 (₹30,000/month) and disability percentage rule to confirm. |
| e-shram | Excludes EPFO/ESIC members and income-tax payers (not modelled). Insurance cover is under PMSBY. |
| vayoshri | ₹3,000 one-time, age 65+, income limit 200000 from memory; scheme may be closed or changed. |

## Verified on 2026-11-01 (7 of 50)
Checked against the scheme's own official page (read by a fetch tool, not in a browser). "Verified" here means the eligibility rules and benefit shown to citizens match that page. Where a page did not say something, the field was set to empty instead of guessed. Known limits are listed so nobody over-trusts them.

| id | page read | what the page confirmed | limits to know |
|---|---|---|---|
| atal-pension | pfrda.org.in/schemes/atal-pension-yojana-apy | Age 18-40, ₹1,000-5,000/month pension after 60, savings account needed | Income-tax payers are NOT eligible (since 1 Oct 2022); our rules cannot model that, so they are told in the benefit text only. Our old ₹5 lakh income cap was wrong and was removed. |
| pmuy | pmuy.gov.in/ujjwala2.html, faq.html | Woman 18+, poor household by declaration, free connection, first refill and stove free, documents | No income limit is stated. The per-cylinder ₹300 subsidy is not on the site and was removed. The site shows two different cash-assistance totals (₹1,600 and ₹2,050), which we do not quote. |
| pmjdy | pmjdy.gov.in/scheme | No minimum balance, RuPay card, accident cover ₹1 lakh (₹2 lakh for accounts opened after 28 Aug 2018) | No minimum age is stated (old value 10 removed). Rule "no other account" is not modelled. Document list is only the account opening form. |
| mgnrega | nrega.dord.gov.in | 100 days a year, adult members of rural households who volunteer for unskilled manual work | Minimum age 18 is taken from the word "adult". How to get a job card and documents were not on the pages read, so those fields are empty. |
| e-shram | eshram.gov.in/faqs | Age 16 and above (no upper limit), unorganised workers, not EPFO/ESIC members, no income test, free, Aadhaar + Aadhaar-linked mobile | Old maximum age 59 was wrong and removed. EPFO/ESIC exclusion is not modelled. Insurance amount is not stated, so the benefit is described as registration and a worker ID. |
| pm-vishwakarma | pmvishwakarma.gov.in (home, FAQ) | Age 18+, 18 listed traditional trades, ₹15,000 toolkit grant, ₹500/day stipend, loans ₹1 lakh then ₹2 lakh at 5%, documents | Only "Artisan / Craftsperson" is matched; some trades (barber, washerman, tailor, garland maker) have no matching form option. Exclusions (government job, earlier PMEGP/Mudra/SVANidhi loan, one member per family) are not modelled. |
| pm-svanidhi | pmsvanidhi.mohua.gov.in (home, Pre-Application) | Street vendors with certificate of vending / ID / letter of recommendation, three loan stages | The ₹15,000 / ₹25,000 / ₹50,000 amounts come from the portal's "Apply For 15k/25k/50k" buttons, not a sentence. Only states that notified the vending rules take part (not modelled). Cut-off date and the FAQ PDF were not read. |

## Tried but could not be verified (still unverified)
The pages could not be read from this environment, so nothing was confirmed. A person should check them in a browser.
- **Certificate errors:** pmkisan.gov.in, nsiindia.gov.in (Sukanya, SCSS). (jansuraksha.gov.in and mudra.org.in also fail, but PMJJBY, PMSBY and Mudra were verified through the Finance Ministry pages, see below.)
- **Not reachable:** pmjay.gov.in (connection refused), pmayg.nic.in and npscra.nsdl.co.in (DNS)
- **Page content loads only in a browser:** myscheme.gov.in, pmsuryaghar.gov.in, pmfby.gov.in
- **Wrong site:** maandhan.in is the PM-SYM site and was used to verify pm-sym (below). PM Kisan Maandhan (pm-kmy) is not on it and stays unverified.
- **Unreadable PDFs / no scheme details:** scholarships.gov.in (the guideline PDFs could not be read), nfsa.gov.in. For NFSA only the benefit wording is confirmed and updated: eligibility is decided by each state, and our rules would show it to everyone, so it stays unverified.

## Verified later on 2026-11-01 (4 more, 11 of 50 in total)
| id | page read | what the page confirmed | limits to know |
|---|---|---|---|
| pm-sym | maandhan.in (scheme page, FAQs, contribution chart) | Age 18-40, income ₹15,000 a month or below, ₹3,000 pension after 60, you pay ₹55-200 a month matched by the Government, documents | Excludes EPFO/NPS/ESIC members and income-tax payers (not modelled; said in the benefit text). The site words the income limit two ways ("or below" / "less than"); we use up to ₹15,000. Enrolment steps beyond the Common Service Centre were not stated. |
| pmjjby | financialservices.gov.in (Finance Ministry) | ₹2 lakh for death due to any reason, ₹436 a year, age 18-50 with a bank account, auto-debit | The page does not say whether 18 and 50 are inclusive. The age at which cover stops is not stated. |
| pmsby | financialservices.gov.in | ₹2 lakh for death or total disability, ₹1 lakh partial disability, ₹20 a year, age 18-70 with a bank account and auto-debit consent | Same inclusive-age and cover-end notes as PMJJBY. |
| mudra-loan | financialservices.gov.in | Collateral not required; Shishu up to ₹50,000, Kishore ₹50,000-₹5 lakh, Tarun ₹5-10 lakh, Tarun Plus ₹10-20 lakh; non-agricultural micro enterprises | The page names no occupations or minimum age, so minimum age was removed and the occupation list is our reading of "non-agricultural". How to apply and documents were not on the page, so those fields are empty. The old fixed ₹1 lakh amount was removed. |

Startup India: only the general description of the Seed Fund Scheme was confirmed (support for proof of concept, prototype, trials, market entry and commercialisation). The old "₹20 lakh" claim could not be confirmed and was removed; eligibility and how to apply were not on the readable pages, so it stays unverified.
