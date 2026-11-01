// WhatsApp rejects bodies over 1600 characters. Keep each AI answer to ONE message (each message uses quota):
// cut at the last paragraph/line break before the limit instead of splitting into several sends.
const MAX_CHARS = 1400;

function fitWhatsApp(text, max = MAX_CHARS) {
  const t = String(text || '').trim();
  if (t.length <= max) return t;
  const head = t.slice(0, max);
  const cut = Math.max(head.lastIndexOf('\n\n'), head.lastIndexOf('\n'), head.lastIndexOf('। '), head.lastIndexOf('. '));
  return (cut > max * 0.5 ? head.slice(0, cut) : head).trimEnd() + ' …';
}

// ── Profile hand-off: the AI only collects answers; our rules engine does the matching. ──
const OCCUPATIONS = [
  'Farmer / Kisan', 'Agricultural Labourer', 'Daily Wage Worker', 'Street Vendor / Small Trader',
  'Self-Employed (Small Business)', 'Student', 'Homemaker', 'Private Employee', 'Government Employee',
  'Domestic Worker', 'Construction Worker', 'Artisan / Craftsperson', 'Fisherman',
  'Widow / Pensioner', 'Person with Disability', 'Other',
];

// Returns a profile object if the AI reply contains PROFILE_JSON {...}, otherwise null.
function extractProfile(text) {
  const m = String(text || '').match(/PROFILE_JSON\s*(\{[\s\S]*?\})/);
  if (!m) return null;
  let p;
  try { p = JSON.parse(m[1]); } catch { return null; }
  const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? undefined : Number(v));
  const occ = OCCUPATIONS.find((o) => o.toLowerCase() === String(p.occupation || '').trim().toLowerCase());
  const gender = /^f/i.test(p.gender) ? 'Female' : /^m/i.test(p.gender) ? 'Male' : undefined;
  return {
    age: num(p.age), gender, state: p.state || undefined, occupation: occ,
    annualIncome: num(p.annualIncome), category: p.category || undefined,
    maritalStatus: p.maritalStatus || undefined,
    language: ['hi', 'mr', 'en'].includes(p.language) ? p.language : 'en',
  };
}

const COPY = {
  en: {
    head: (n) => `You may qualify for ${n} scheme(s):`,
    none: 'I could not find a matching scheme with these details. Please check them or visit the website.',
    foot: 'Details & how to apply: https://bharatsahayak.vercel.app\nReply HELLO to start again.',
    more: (n) => `…and ${n} more on the website.`,
  },
  hi: {
    head: (n) => `आप इन ${n} योजनाओं के पात्र हो सकते हैं:`,
    none: 'इन जानकारियों से कोई योजना नहीं मिली। कृपया जानकारी जाँचें या वेबसाइट देखें।',
    foot: 'पूरी जानकारी और आवेदन: https://bharatsahayak.vercel.app\nफिर से शुरू करने के लिए HELLO भेजें।',
    more: (n) => `…और ${n} योजनाएँ वेबसाइट पर।`,
  },
  mr: {
    head: (n) => `तुम्ही या ${n} योजनांसाठी पात्र असू शकता:`,
    none: 'या माहितीवरून कोणतीही योजना सापडली नाही. कृपया माहिती तपासा किंवा वेबसाइट पहा.',
    foot: 'संपूर्ण माहिती व अर्ज: https://bharatsahayak.vercel.app\nपुन्हा सुरू करण्यासाठी HELLO पाठवा.',
    more: (n) => `…आणि ${n} योजना वेबसाइटवर.`,
  },
};

// Schemes written for the user's own situation (their state, occupation, gender, category) come first.
function specificity(s) {
  const el = s.eligibility || {};
  return (s.state && s.state !== 'all' ? 2 : 0)
    + (el.occupations && !el.occupations.includes('any') ? 2 : 0)
    + (el.categories && !el.categories.includes('any') ? 1 : 0)
    + (el.gender && el.gender !== 'any' ? 1 : 0)
    + (el.maritalStatus && el.maritalStatus !== 'any' ? 1 : 0);
}

// matches: scheme records from the store; t: (i18nField) => string
function formatMatches(matches, lang, t, limit = 5) {
  const c = COPY[lang] || COPY.en;
  if (!matches.length) return `${c.none}\n\n${c.foot}`;
  matches = [...matches].sort((a, b) => specificity(b) - specificity(a));
  const lines = matches.slice(0, limit).map((s) => `• ${t(s.name)} — ${t(s.benefitSummary)}`);
  const extra = matches.length > limit ? `\n${c.more(matches.length - limit)}` : '';
  return `${c.head(matches.length)}\n\n${lines.join('\n')}${extra}\n\n${c.foot}`;
}

module.exports = { fitWhatsApp, MAX_CHARS, OCCUPATIONS, extractProfile, formatMatches };
