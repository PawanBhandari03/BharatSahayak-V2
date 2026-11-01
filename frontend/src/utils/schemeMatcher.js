// Matching, wallet and timeline for the website. All eligibility logic lives in shared/eligibility.mjs,
// the same engine the backend (WhatsApp, voice, /api/match-schemes) uses. No scheme data is kept here.
import { evaluate } from '../../../shared/eligibility.mjs';

const SCORE = { yes: 95, maybe: 60, no: 0 };

// cards come from SchemesContext (toCard). Returns every card with its eligibility for this profile.
export function matchSchemesForUser(profile, cards) {
  return cards
    .map((card) => {
      const r = evaluate(profile, card._record);
      return {
        ...card,
        isMatched: r.eligible !== 'no',
        eligibleLevel: r.eligible,           // 'yes' | 'maybe' | 'no'
        matchScore: SCORE[r.eligible],
        reasons: r.reasons,
        blockers: r.blockers,
        missing: r.missing,
        ineligibleReason: r.blockers[0] || null,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

// ── Tracking: the user marks schemes they applied for / already receive (stored on this device) ──
const TRACK_KEY = 'bs_tracking_v1';
export const readTracking = () => { try { return JSON.parse(localStorage.getItem(TRACK_KEY)) || {}; } catch { return {}; } };
export function writeTracking(map) { try { localStorage.setItem(TRACK_KEY, JSON.stringify(map)); } catch { /* ignore */ } }

// Benefit wallet from real data. Only schemes with a fixed rupee amount add to the totals;
// the rest are counted in `unknownAmount` so nothing is invented.
export function computeWallet(cards, tracking = {}, profile = {}) {
  const matched = cards.filter((c) => c.isMatched);
  // Health and insurance "cover" (e.g. ₹5 lakh of treatment) is not money paid to the person, so it is left out of rupee totals.
  const isCover = (c) => ['health', 'insurance'].includes(c._record?.category);
  const sum = (list) => list.reduce((a, c) => a + (isCover(c) ? 0 : (c.benefitAmount || 0)), 0);

  const received = sum(matched.filter((c) => tracking[c.id] === 'received'));
  const pending = sum(matched.filter((c) => tracking[c.id] === 'applied'));
  const open = matched.filter((c) => !tracking[c.id]);
  const available = sum(open.filter((c) => c.eligibleLevel === 'yes'));
  const possible = sum(open.filter((c) => c.eligibleLevel === 'maybe'));

  // Future: schemes the user would qualify for once old enough (engine re-run at the scheme's minimum age)
  const age = Number(profile.age);
  const futureCards = Number.isFinite(age)
    ? cards.filter((c) => {
        const min = c._record?.eligibility?.minAge;
        return !c.isMatched && min != null && min > age && evaluate({ ...profile, age: min }, c._record).eligible !== 'no';
      })
    : [];
  const future = sum(futureCards);

  return {
    received, pending, available, possible, future,
    total: available + possible,                 // still unclaimed today
    count: matched.length,
    confirmed: matched.filter((c) => c.eligibleLevel === 'yes').length,
    maybeCount: matched.filter((c) => c.eligibleLevel === 'maybe').length,
    futureCards,
    unknownAmount: matched.filter((c) => !c.amountKnown).length,
    chartData: [
      { name: 'Received', value: received, color: '#138808' },
      { name: 'Available', value: available + possible, color: '#1B1740' },
      { name: 'Pending', value: pending, color: '#C2610A' },
      { name: 'Future', value: future, color: '#2196F3' },
    ],
  };
}

export function getAvatar(profile) {
  const occ = profile.occupation?.toLowerCase() || '';
  if (occ.includes('farmer')) return '👨‍🌾';
  if (occ.includes('student')) return '👨‍🎓';
  if (occ.includes('business') || occ.includes('self-employed')) return '👨‍💼';
  if (occ.includes('domestic')) return '🏠';
  if (occ.includes('construct')) return '👷';
  if (occ.includes('fisherman')) return '🎣';
  if (occ.includes('artisan')) return '🧑‍🎨';
  if (occ.includes('vendor')) return '🏪';
  if (occ.includes('widow')) return '🙏';
  if (profile.gender === 'Female') return '👩';
  return '👤';
}

// Life timeline built from the scheme rules: what you can claim now, what opens at which age,
// and which enrolment windows close at a given age. Nothing is hard-coded per scheme.
export function generateTimeline(profile, cards) {
  const age = parseInt(profile.age, 10);
  if (!Number.isFinite(age)) return [];
  const year = new Date().getFullYear();
  const events = [];

  cards.filter((c) => c.eligibleLevel === 'yes').slice(0, 3).forEach((c) => events.push({
    year, age, type: 'current', color: '#1B1740',
    event: `${c.name} — ${c.benefitLabel}`, source: c.portalHost,
  }));

  const rules = cards.map((c) => ({ c, el: c._record?.eligibility || {} }));
  // opens later
  rules.filter(({ c, el }) => el.minAge != null && el.minAge > age && evaluate({ ...profile, age: el.minAge }, c._record).eligible !== 'no')
    .sort((a, b) => a.el.minAge - b.el.minAge).slice(0, 3)
    .forEach(({ c, el }) => events.push({
      year: year + (el.minAge - age), age: el.minAge, type: 'future', color: '#2196F3',
      event: `${c.name} opens to you — ${c.benefitLabel}`, source: c.portalHost,
    }));
  // enrolment closes later (still eligible today)
  rules.filter(({ c, el }) => el.maxAge != null && el.maxAge >= age && el.maxAge - age <= 15 && c.eligibleLevel !== 'no')
    .sort((a, b) => a.el.maxAge - b.el.maxAge).slice(0, 2)
    .forEach(({ c, el }) => events.push({
      year: year + (el.maxAge - age), age: el.maxAge, type: 'upcoming', color: '#FF9933',
      event: `Last age to join ${c.name} is ${el.maxAge}`, source: c.portalHost,
    }));

  return events.sort((a, b) => a.year - b.year);
}
