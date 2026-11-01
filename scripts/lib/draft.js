// Shared drafting logic: fetch an official page, ask Mistral to DRAFT a scheme record, validate it.
// A draft is never trusted: verified is forced to false and only a human flips it.
const fs = require('fs');
const path = require('path');

const BACKEND = path.join(__dirname, '../../backend');
const SCHEMA_FILE = path.join(__dirname, '../../scheme-data/scheme.schema.json');
const fromBackend = (m) => require(require.resolve(m, { paths: [BACKEND] }));

require(require.resolve('dotenv', { paths: [BACKEND] })).config({ path: path.join(BACKEND, '.env') });

const MAX_CHARS = 20000;

async function fetchPageText(url, timeoutMs = 15000) {
  let res;
  try {
    res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'User-Agent': 'BharatSahayak-recheck/1.0 (+scheme verification)' },
    });
  } catch (e) {
    const why = e.cause ? `${e.cause.code || e.cause.name}: ${e.cause.message}` : e.message;
    throw new Error(`unreachable (${why})`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return htmlToText(await res.text());
}

function htmlToText(html) {
  return html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#?\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_CHARS);
}

const INSTRUCTIONS = `You extract ONE Indian government scheme into JSON from the official page text provided.
Rules:
- Use ONLY facts stated in the text. If a fact is not stated, use null. Never guess or use outside knowledge.
- amount is a number in rupees (or null). deadline is YYYY-MM-DD (or null). null means "no limit/unknown".
- eligibility keys: minAge, maxAge, gender (any|female|male), occupations (array, ["any"] if unrestricted),
  maxAnnualIncome, requiresLand (bool|null), maritalStatus ("any" if unrestricted), categories (array, ["any"] if unrestricted), requiresBPL (bool|null).
- category is one of: agriculture, health, energy, housing, insurance, pension, social-welfare, entrepreneurship, skill-development, education, women-child, other.
- level is "central" or "state"; state is "all" or a lowercase state name.
- name, benefitSummary: objects {en, hi, mr}; give en from the text, hi/mr null unless the text has them.
- documents: array of strings; howToApply: short string or null.
Return ONLY a JSON object with keys: id, name, category, level, state, amount, frequency, benefitSummary, eligibility, documents, deadline, howToApply, officialUrl.`;

async function draftFromText(text, { url, id } = {}) {
  if (!process.env.MISTRAL_API_KEY) throw new Error('MISTRAL_API_KEY is not set (backend/.env)');
  const { Mistral } = fromBackend('@mistralai/mistralai');
  const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  const response = await mistral.chat.complete({
    model: process.env.MISTRAL_MODEL || 'mistral-large-latest',
    messages: [
      { role: 'system', content: INSTRUCTIONS },
      { role: 'user', content: `Page URL: ${url || 'unknown'}\n${id ? `Use id: ${id}\n` : ''}Page text:\n${text}` },
    ],
    responseFormat: { type: 'json_object' },
    temperature: 0,
    maxTokens: 2000,
  });
  const raw = response.choices[0].message.content;
  const match = String(raw).match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Model did not return JSON');
  const draft = JSON.parse(match[0]);
  if (id) draft.id = id;
  draft.officialUrl = draft.officialUrl || url;
  draft.sourceUrl = url || null;
  draft.verified = false;
  draft.lastVerified = null;
  return draft;
}

function schemaErrors(record) {
  const Ajv = fromBackend('ajv');
  const check = new Ajv({ allErrors: true }).compile(JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8')));
  return check(record) ? [] : check.errors.map((e) => `${e.instancePath || '/'} ${e.message}`);
}

module.exports = { fetchPageText, htmlToText, draftFromText, schemaErrors };
