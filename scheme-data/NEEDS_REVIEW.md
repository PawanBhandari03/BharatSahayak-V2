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
