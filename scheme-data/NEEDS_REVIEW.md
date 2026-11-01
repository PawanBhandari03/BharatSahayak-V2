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
