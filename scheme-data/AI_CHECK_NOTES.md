# Scheme research notes (NOT a verification)

These notes come from searching official government sites (PIB, ministry and state portals) for the schemes the demo uses most.
**No scheme was marked `verified: true` from this.** The official scheme portals could not be opened by the tool
(PIB blocked it, pmkisan.gov.in failed its certificate check, myScheme loads its content with JavaScript), so these are
second-hand summaries of official pages. A person still has to open each official page, compare, and then run
`npm run verify:scheme -- <id> --source <page> --yes`.

Researched on 2026-11-01.

| Scheme | Our record | What official sources say | Action |
|---|---|---|---|
| `pm-kisan` | ₹6,000/year, farmer, land needed, **income limit ₹5,00,000** | ₹6,000/year in three instalments of ₹2,000 for landholding farmer families. Exclusions are income-tax payers, serving or retired government employees (higher grades), constitutional post holders, institutional landholders and some professionals. **No income limit.** | Income limit removed from the record (changed). Still needs a person to confirm the exclusions and the land rule on pmkisan.gov.in |
| `ayushman-bharat` | ₹5 lakh/year, **income limit ₹2,00,000**, any age | ₹5 lakh per family per year. Families are chosen from census deprivation data (SECC), not by an income limit. Since 2024, **everyone aged 70 or over** is covered regardless of income, with a separate ₹5 lakh top-up cover. | Our income limit is a proxy. Decide whether to keep it or mark the result "maybe". Add the 70+ rule |
| `pm-matru-vandana` | ₹5,000, one time, first living child, age 19+ | ₹5,000 for the first child in **two** instalments (₹3,000 then ₹2,000), and ₹6,000 for a second child if she is a girl. Not for women in regular government jobs. A 19-year minimum age was **not found** in these sources. | Confirm the age rule and the exclusion on the official FAQ |
| `pmay-g` | ₹1.20 lakh, one time, **income limit ₹2,00,000** | ₹1.20 lakh in plain areas and ₹1.30 lakh in hilly and north-eastern areas. Households are chosen from SECC 2011 and the Awaas+ survey (houseless, or living in kutcha houses). **No income limit.** | Our income limit is a proxy. The scheme is rural only; the engine has no rural or urban rule |
| `namo-shetkari` | ₹6,000/year, Maharashtra farmers, land needed | ₹6,000/year on top of PM-KISAN for PM-KISAN beneficiaries in Maharashtra. Amount and state match. | Documents list and current instalment status not confirmed |
| `majhi-ladki-bahin` | ₹1,500/month, age 21 to 65, income ₹2,50,000 | **Could not confirm** the amount, age range or income cap from official pages. | Check the current Government Resolution on the Maharashtra Women and Child Development portal |
| `pmsss` | (fixed earlier) now limited to J&K residents, ₹30,000/year | The documents list in our record already requires a J&K or Ladakh domicile certificate. | Ladakh students are not covered because the engine supports a single state |

## Sources used
- PM-KISAN: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2292437&reg=48&lang=1 and the FAQ at https://pmkisan.gov.in/Documents/RevisedFAQ.pdf
- PM-JAY: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2053881&reg=48&lang=2
- PMMVY: https://wcd.gov.in/offerings/pradhan-mantri-matru-vandana-yojana
- PMAY-G: https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2043921&reg=3&lang=2
- Namo Shetkari: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2062425

## Known engine limits that affect results
The shared engine has no rule for rural or urban residence, home ownership, or the census deprivation list. Schemes that depend on
those (PMAY-G, PMAY-U, MGNREGA, PM Surya Ghar, PM-JAY) can show as "fits" for people who may not qualify. Treat their results as "check the official portal".
