// The website reads schemes from the backend (GET /api/schemes): there is no second copy of the data.
// The last good response is cached in localStorage so the site still works if the backend is asleep or offline.
export const API_URL = (import.meta.env.VITE_API_URL || 'https://bharatsahayak.onrender.com').replace(/\/api\/?$/, '');
const CACHE_KEY = 'bs_schemes_cache_v1';

export async function fetchSchemeRecords() {
  try {
    const res = await fetch(`${API_URL}/api/schemes`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { schemes } = await res.json();
    if (Array.isArray(schemes) && schemes.length) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), schemes })); } catch { /* ignore */ }
      return { schemes, source: 'api' };
    }
    throw new Error('empty list');
  } catch (err) {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cached?.schemes?.length) return { schemes: cached.schemes, source: 'cache', error: err.message };
    } catch { /* ignore */ }
    return { schemes: [], source: 'none', error: err.message };
  }
}

export function readCachedRecords() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY))?.schemes || []; } catch { return []; }
}

const CATEGORY_LABELS = {
  agriculture: 'Agriculture', health: 'Health', energy: 'Energy', housing: 'Housing', insurance: 'Insurance',
  pension: 'Pension', 'social-welfare': 'Social Welfare', entrepreneurship: 'Entrepreneurship',
  'skill-development': 'Skill Development', education: 'Education', 'women-child': 'Women & Child', other: 'Other',
};
export const categoryLabel = (c) => CATEGORY_LABELS[c] || 'Other';
const FREQUENCY_LABELS = { 'one-time': 'One-time', monthly: 'Per month', yearly: 'Per year', 'per-cylinder': 'Per cylinder', other: '' };
const titleCase = (s) => String(s || '').replace(/\b\w/g, (c) => c.toUpperCase());

const text = (field, lang) => (field && typeof field === 'object' ? field[lang] || field.en || '' : field || '');

const hostOf = (url) => { try { return new URL(url).host.replace(/^www\./, ''); } catch { return ''; } };

// Plain-language lines describing who the scheme is for, generated from the rule fields.
function eligibilityLines(r) {
  const el = r.eligibility || {};
  const lines = [];
  if (el.minAge != null || el.maxAge != null) lines.push(`Age ${el.minAge ?? 0}${el.maxAge != null ? ' to ' + el.maxAge : '+'}`);
  if (el.gender && el.gender !== 'any') lines.push(`For ${el.gender} applicants`);
  if (r.state && r.state !== 'all') lines.push(`Residents of ${titleCase(r.state)}`);
  if (el.occupations && !el.occupations.includes('any')) lines.push(`Work: ${el.occupations.join(', ')}`);
  if (el.categories && !el.categories.includes('any')) lines.push(`Category: ${el.categories.join(', ')}`);
  if (el.maritalStatus && el.maritalStatus !== 'any') lines.push(`Marital status: ${el.maritalStatus}`);
  if (el.maxAnnualIncome != null) lines.push(`Family income up to ₹${el.maxAnnualIncome.toLocaleString('en-IN')} a year`);
  if (el.requiresLand) lines.push('Owns farm land');
  if (el.requiresBPL) lines.push('BPL / ration card holder');
  return lines.length ? lines : ['Open to all citizens'];
}

function daysUntil(iso) {
  if (!iso) return null;
  return Math.ceil((new Date(iso + 'T23:59:59') - new Date()) / 86400000);
}

// Record (API shape) -> card shape used by SchemeCard, the Schemes page and the dashboard.
// Keeps the full record in `_record` so the shared engine can evaluate it.
export function toCard(r, lang = 'en') {
  const el = r.eligibility || {};
  const name = text(r.name, lang);
  return {
    id: r.id,
    _record: r,
    name,
    fullName: text(r.name, 'en'),
    department: r.level === 'central' ? 'Government of India' : `Government of ${titleCase(r.state)}`,
    category: categoryLabel(r.category),
    benefitAmount: r.amount || 0,
    amountKnown: r.amount != null,
    benefitType: FREQUENCY_LABELS[r.frequency] || '',
    benefitLabel: text(r.benefitSummary, lang),
    officialPortal: r.officialUrl,
    description: text(r.benefitSummary, lang),
    eligibility: eligibilityLines(r),
    tags: [r.level === 'central' ? 'Central' : titleCase(r.state), ...(el.gender && el.gender !== 'any' ? [titleCase(el.gender)] : []),
      ...(el.occupations && !el.occupations.includes('any') ? el.occupations.slice(0, 1) : [])],
    state: r.state === 'all' ? 'All India' : titleCase(r.state),
    deadline: r.deadline,
    deadlineDaysLeft: daysUntil(r.deadline),
    documentsNeeded: (r.documents || []).length,
    documents: r.documents || [],
    howToApply: r.howToApply || '',
    verified: r.verified === true,
    portalHost: hostOf(r.officialUrl),
  };
}
