// Eligibility check against the shared scheme schema. Unknown/null rule = no restriction.
// Profile fields missing from the request are not used to exclude a scheme.
const lc = (v) => String(v ?? '').trim().toLowerCase();

function isMatch(profile, scheme) {
  const el = scheme.eligibility;
  if (!el) return true;

  const age = profile.age !== undefined && profile.age !== '' ? Number(profile.age) : null;
  if (age !== null && !Number.isNaN(age)) {
    if (el.minAge != null && age < el.minAge) return false;
    if (el.maxAge != null && age > el.maxAge) return false;
  }

  if (profile.gender && el.gender && el.gender !== 'any' && lc(el.gender) !== lc(profile.gender)) return false;

  if (profile.category && el.categories && !el.categories.includes('any')) {
    if (!el.categories.map(lc).includes(lc(profile.category))) return false;
  }

  if (profile.occupation && el.occupations && !el.occupations.includes('any')) {
    if (!el.occupations.map(lc).includes(lc(profile.occupation))) return false;
  }

  if (el.maxAnnualIncome != null && profile.annualIncome !== undefined && profile.annualIncome !== '') {
    if (Number(profile.annualIncome) > el.maxAnnualIncome) return false;
  }

  if (profile.state && scheme.state && lc(scheme.state) !== 'all' && lc(scheme.state) !== lc(profile.state)) return false;

  if (profile.maritalStatus && el.maritalStatus && el.maritalStatus !== 'any' && lc(el.maritalStatus) !== lc(profile.maritalStatus)) return false;

  if (el.requiresLand === true && profile.hasLand !== undefined && profile.hasLand !== '') {
    if (!['true', 'yes', '1'].includes(lc(profile.hasLand))) return false;
  }
  if (el.requiresBPL === true && profile.hasBPL !== undefined && profile.hasBPL !== '') {
    if (!['true', 'yes', '1'].includes(lc(profile.hasBPL))) return false;
  }

  return true;
}

function matchSchemes(profile, schemes) {
  return schemes.filter((s) => isMatch(profile || {}, s));
}

module.exports = { isMatch, matchSchemes };
