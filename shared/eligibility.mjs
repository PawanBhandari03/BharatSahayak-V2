// One eligibility engine for web, WhatsApp and voice (pure functions, no network).
// A scheme rule that is null / "any" never excludes anyone. A rule that needs an answer the user did not
// give makes the result "maybe" instead of guessing. Only a known mismatch gives "no".

const lc = (v) => String(v ?? '').trim().toLowerCase();
const known = (v) => v !== undefined && v !== null && v !== '' && !(typeof v === 'number' && Number.isNaN(v));
const yes = (v) => ['true', 'yes', '1'].includes(lc(v).split(/[\s-]/)[0]);
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export function evaluate(profile = {}, scheme) {
  const el = scheme.eligibility || {};
  const reasons = [];
  const blockers = [];
  const missing = [];

  // age
  if (el.minAge != null || el.maxAge != null) {
    const range = `${el.minAge ?? 0}${el.maxAge != null ? '–' + el.maxAge : '+'}`;
    if (known(profile.age)) {
      const age = Number(profile.age);
      if ((el.minAge != null && age < el.minAge) || (el.maxAge != null && age > el.maxAge)) blockers.push(`Age must be ${range}`);
      else reasons.push(`Age ${age} fits ${range}`);
    } else missing.push('age');
  }

  // gender
  if (el.gender && el.gender !== 'any') {
    if (known(profile.gender)) {
      if (lc(profile.gender) !== lc(el.gender)) blockers.push(`For ${el.gender} applicants only`);
      else reasons.push(`Open to ${el.gender} applicants`);
    } else missing.push('gender');
  }

  // state
  if (scheme.state && lc(scheme.state) !== 'all') {
    if (known(profile.state)) {
      if (lc(profile.state) !== lc(scheme.state)) blockers.push(`Only for residents of ${scheme.state}`);
      else reasons.push(`Available in ${profile.state}`);
    } else missing.push('state');
  }

  // category
  if (el.categories && !el.categories.includes('any')) {
    if (known(profile.category)) {
      if (!el.categories.map(lc).includes(lc(profile.category))) blockers.push(`For ${el.categories.join('/')} category only`);
      else reasons.push(`Category ${profile.category} is covered`);
    } else missing.push('category');
  }

  // occupation
  if (el.occupations && !el.occupations.includes('any')) {
    if (known(profile.occupation)) {
      if (!el.occupations.map(lc).includes(lc(profile.occupation))) blockers.push(`For: ${el.occupations.join(', ')}`);
      else reasons.push(`Suits your work (${profile.occupation})`);
    } else missing.push('occupation');
  }

  // marital status
  if (el.maritalStatus && el.maritalStatus !== 'any') {
    if (known(profile.maritalStatus)) {
      if (lc(profile.maritalStatus) !== lc(el.maritalStatus)) blockers.push(`For ${el.maritalStatus} only`);
      else reasons.push(`Marital status fits (${profile.maritalStatus})`);
    } else missing.push('marital status');
  }

  // income: a range answer carries a lower and upper bound; only a certain mismatch is a blocker
  if (el.maxAnnualIncome != null) {
    const hi = known(profile.annualIncome) ? Number(profile.annualIncome) : null;
    const lo = known(profile.annualIncomeMin) ? Number(profile.annualIncomeMin) : hi;
    if (hi === null) missing.push('income');
    else if (lo > el.maxAnnualIncome) blockers.push(`Family income must be up to ${inr(el.maxAnnualIncome)}`);
    else if (hi > el.maxAnnualIncome) missing.push(`exact income (limit ${inr(el.maxAnnualIncome)})`);
    else reasons.push(`Income within ${inr(el.maxAnnualIncome)} limit`);
  }

  // land / BPL
  if (el.requiresLand === true) {
    if (!known(profile.hasLand)) missing.push('farm land');
    else if (!yes(profile.hasLand)) blockers.push('Needs farm land in your name');
    else reasons.push('You own farm land');
  }
  if (el.requiresBPL === true) {
    if (!known(profile.hasBPL)) missing.push('BPL / ration card');
    else if (!yes(profile.hasBPL)) blockers.push('Needs a BPL / ration card');
    else reasons.push('You hold a BPL / ration card');
  }

  const eligible = blockers.length ? 'no' : missing.length ? 'maybe' : 'yes';
  return { eligible, reasons, blockers, missing };
}

export const isMatch = (profile, scheme) => evaluate(profile, scheme).eligible !== 'no';

// Schemes the user may qualify for (yes or maybe), "yes" first, original order otherwise.
export function matchSchemes(profile, schemes) {
  const scored = schemes.map((s, i) => ({ s, i, e: evaluate(profile || {}, s).eligible })).filter((x) => x.e !== 'no');
  scored.sort((a, b) => (a.e === b.e ? a.i - b.i : a.e === 'yes' ? -1 : 1));
  return scored.map((x) => x.s);
}
