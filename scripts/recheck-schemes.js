// Re-check verified schemes against their official pages. Read-only for schemes.json.
//   npm run recheck:schemes              all verified schemes
//   npm run recheck:schemes -- --demo    3 schemes (first 3 verified; if fewer are verified, topped up from the file)
// Writes scheme-data/recheck-report.md and scheme-data/needs-review.json. Never edits schemes.json.
// Limits: only re-checks URLs already in our list. It does not discover new schemes or crawl the web.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA = path.join(__dirname, '../scheme-data');
const SCHEMES_FILE = path.join(DATA, 'schemes.json');
const REPORT_FILE = path.join(DATA, 'recheck-report.md');
const NEEDS_REVIEW_FILE = path.join(DATA, 'needs-review.json');

const norm = (v) => (v === undefined ? null : v);
const sameSet = (a, b) => {
  const f = (x) => [...new Set((x || []).map((d) => String(d).trim().toLowerCase()))].sort();
  return JSON.stringify(f(a)) === JSON.stringify(f(b));
};

// Compare the stored record with a fresh draft on eligibility, amount, documents, deadline.
function compareRecords(stored, draft) {
  const diffs = [];
  const add = (field, oldV, newV) => diffs.push({ field, old: oldV, new: newV });
  if (norm(stored.amount) !== norm(draft.amount)) add('amount', stored.amount, draft.amount);
  if (norm(stored.deadline) !== norm(draft.deadline)) add('deadline', stored.deadline, draft.deadline);
  if (!sameSet(stored.documents, draft.documents)) add('documents', stored.documents, draft.documents);
  const keys = new Set([...Object.keys(stored.eligibility || {}), ...Object.keys(draft.eligibility || {})]);
  for (const k of keys) {
    const o = norm((stored.eligibility || {})[k]);
    const n = norm((draft.eligibility || {})[k]);
    const same = Array.isArray(o) || Array.isArray(n) ? sameSet(o, n) : o === n;
    if (!same) add(`eligibility.${k}`, o, n);
  }
  return diffs;
}

// deps = { fetchPageText, draftFromText } (injectable for tests)
async function recheck(schemes, deps, log = console.log) {
  const results = [];
  for (const s of schemes) {
    const url = s.sourceUrl || s.officialUrl;
    try {
      const text = await deps.fetchPageText(url);
      if (!text || text.length < 200) throw new Error('page had almost no readable text (JS-rendered or blocked?)');
      const draft = await deps.draftFromText(text, { url, id: s.id });
      const diffs = compareRecords(s, draft);
      results.push({ id: s.id, url, status: diffs.length ? 'changed' : 'unchanged', diffs });
      log(`${diffs.length ? 'CHANGED  ' : 'unchanged'} ${s.id} (${diffs.length} differences)`);
    } catch (e) {
      results.push({ id: s.id, url, status: 'failed', error: e.message, diffs: [] });
      log(`FAILED    ${s.id}: ${e.message}`);
    }
  }
  return results;
}

const fmt = (v) => '`' + (v === undefined ? 'null' : JSON.stringify(v)).replace(/\|/g, '\\|') + '`';

function renderReport(results, meta) {
  const changed = results.filter((r) => r.status === 'changed');
  const failed = results.filter((r) => r.status === 'failed');
  const ok = results.filter((r) => r.status === 'unchanged');
  const L = [];
  L.push('# Scheme re-check report', '');
  L.push(`Run: ${meta.when}${meta.demo ? ' (demo run)' : ''}`);
  if (meta.note) L.push('', `> ${meta.note}`);
  L.push('', `Checked ${results.length}: ${ok.length} unchanged, ${changed.length} changed (needs_review), ${failed.length} could not be checked.`);
  L.push('', 'schemes.json was NOT modified. A human compares each difference with the official page, edits schemes.json, and only then sets `verified: true` and `lastVerified`.', '');
  L.push('## Differences (needs_review: true)', '');
  if (!changed.length) L.push('None.', '');
  else {
    L.push('| scheme id | field | old value | new value | URL |', '|---|---|---|---|---|');
    for (const r of changed) for (const d of r.diffs) L.push(`| ${r.id} | ${d.field} | ${fmt(d.old)} | ${fmt(d.new)} | ${r.url} |`);
    L.push('');
  }
  L.push('## Could not be checked (skipped)', '');
  if (!failed.length) L.push('None.', '');
  else {
    L.push('| scheme id | URL | reason |', '|---|---|---|');
    failed.forEach((r) => L.push(`| ${r.id} | ${r.url} | ${String(r.error).replace(/\|/g, '/')} |`));
    L.push('');
  }
  L.push('## Unchanged', '', ok.length ? ok.map((r) => `- ${r.id}`).join('\n') : 'None.', '');
  L.push('Note: an AI draft can be wrong. "Unchanged" means the draft matched our record, not that it is correct.', '');
  return L.join('\n');
}

const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

async function main() {
  const demo = process.argv.includes('--demo');
  const before = sha(SCHEMES_FILE);
  const all = JSON.parse(fs.readFileSync(SCHEMES_FILE, 'utf8'));
  let targets = all.filter((s) => s.verified);
  let note = null;
  if (demo) {
    if (targets.length < 3) {
      note = `Only ${targets.length} scheme(s) are verified, so this demo also used unverified ones to reach 3.`;
      targets = [...targets, ...all.filter((s) => !s.verified)];
    }
    targets = targets.slice(0, 3);
  } else if (!targets.length) {
    note = 'No scheme has verified:true yet, so there was nothing to re-check.';
  }

  const deps = require('./lib/draft');
  const results = await recheck(targets, deps);

  fs.writeFileSync(REPORT_FILE, renderReport(results, { when: new Date().toISOString(), demo, note }));
  fs.writeFileSync(NEEDS_REVIEW_FILE, JSON.stringify({
    generated: new Date().toISOString(),
    needs_review: results.filter((r) => r.status === 'changed').map((r) => r.id),
    unreachable: results.filter((r) => r.status === 'failed').map((r) => r.id),
  }, null, 2) + '\n');

  if (sha(SCHEMES_FILE) !== before) { console.error('BUG: schemes.json changed during recheck'); process.exit(3); }
  const c = (st) => results.filter((r) => r.status === st).length;
  console.log(`\nDone: ${c('unchanged')} unchanged, ${c('changed')} changed, ${c('failed')} failed. Report: ${REPORT_FILE}`);
}

module.exports = { compareRecords, recheck, renderReport };

if (require.main === module) {
  main().catch((e) => { console.error('recheck-schemes crashed:', e); process.exit(1); });
}
