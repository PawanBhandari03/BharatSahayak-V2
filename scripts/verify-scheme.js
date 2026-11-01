// Records that a HUMAN has checked a scheme against its official page.
//   npm run verify:scheme -- --list                         show schemes that are not verified yet
//   npm run verify:scheme -- <id>                           show what must be compared (changes nothing)
//   npm run verify:scheme -- <id> --source <url> --yes      mark verified (needs the page you checked + --yes)
// It never decides anything itself: it only stamps verified:true, the source page and today's date,
// after re-checking the record against the schema.
const fs = require('fs');
const path = require('path');
const { validateRecords } = require('./validate-schemes');

const DIR = path.join(__dirname, '../scheme-data');
const FILE = process.env.SCHEMES_FILE || path.join(DIR, 'schemes.json');
const SCHEMA = path.join(DIR, 'scheme.schema.json');

function verifyRecord(list, id, { source, today = new Date().toISOString().slice(0, 10) }) {
  const i = list.findIndex((s) => s.id === id);
  if (i < 0) throw new Error(`No scheme with id "${id}"`);
  if (!/^https?:\/\//.test(source || '')) throw new Error('--source must be the http(s) URL of the official page you checked');
  const next = list.map((s) => ({ ...s }));
  next[i].verified = true;
  next[i].sourceUrl = source;
  next[i].lastVerified = today;
  const schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'));
  const { errors } = validateRecords(next, schema, new Date(today));
  const mine = errors.filter((e) => e.startsWith(id + ':'));
  if (mine.length) throw new Error('Record is not valid after verifying:\n - ' + mine.join('\n - '));
  return next;
}

function describe(s) {
  const el = s.eligibility;
  return [
    `${s.id}: ${s.name.en}`,
    `  Official site : ${s.officialUrl}`,
    `  Age           : ${el.minAge ?? 'no min'} to ${el.maxAge ?? 'no max'}`,
    `  Gender        : ${el.gender}   State: ${s.state}   Marital: ${el.maritalStatus}`,
    `  Work          : ${el.occupations.join(', ')}`,
    `  Category      : ${el.categories.join(', ')}`,
    `  Income limit  : ${el.maxAnnualIncome ?? 'none'}   Land needed: ${el.requiresLand ?? 'not stated'}   BPL needed: ${el.requiresBPL ?? 'not stated'}`,
    `  Benefit       : ${s.amount ?? 'no fixed amount'} (${s.frequency ?? 'n/a'})  ${s.benefitSummary.en}`,
    `  Documents     : ${s.documents.join('; ')}`,
  ].join('\n');
}

module.exports = { verifyRecord, describe };

if (require.main === module) {
  const args = process.argv.slice(2);
  const list = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };

  if (args.includes('--list') || !args.length) {
    const todo = list.filter((s) => !s.verified);
    todo.forEach((s) => console.log(`${s.id.padEnd(24)} ${s.name.en}`));
    console.log(`\n${list.length - todo.length} verified, ${todo.length} not verified yet.`);
    process.exit(0);
  }
  const id = args.find((a) => !a.startsWith('--') && a !== opt('--source'));
  const scheme = list.find((s) => s.id === id);
  if (!scheme) { console.error(`No scheme with id "${id}". Run with --list.`); process.exit(2); }
  console.log(describe(scheme));
  if (!args.includes('--yes') || !opt('--source')) {
    console.log('\nNothing changed. Compare EVERY line above with the official page, correct scheme-data/schemes.json if anything differs, then run:');
    console.log(`  npm run verify:scheme -- ${id} --source <URL of the page you checked> --yes`);
    process.exit(1);
  }
  try {
    fs.writeFileSync(FILE, JSON.stringify(verifyRecord(list, id, { source: opt('--source') }), null, 2) + '\n');
    console.log(`\n${id} marked verified (source recorded, dated today).`);
  } catch (e) { console.error(e.message); process.exit(1); }
}
