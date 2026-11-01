// Usage:
//   node scripts/draft-scheme.js <url> [--id my-scheme-id]
//   node scripts/draft-scheme.js --text-file page.txt --url <source-url> [--id my-scheme-id]
// Writes scheme-data/drafts/<id>.json with verified:false. A human must compare it with the
// official page and move/merge it into schemes.json, setting verified:true and lastVerified.
const fs = require('fs');
const path = require('path');
const { fetchPageText, draftFromText, schemaErrors } = require('./lib/draft');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

async function main() {
  const textFile = opt('--text-file');
  const url = opt('--url') || args.find((a) => /^https?:\/\//.test(a));
  if (!textFile && !url) {
    console.error('Give a URL, or --text-file <file> --url <source-url>');
    process.exit(2);
  }
  const text = textFile ? fs.readFileSync(textFile, 'utf8') : await fetchPageText(url);
  const draft = await draftFromText(text, { url, id: opt('--id') });
  const errs = schemaErrors(draft);
  const outDir = path.join(__dirname, '../scheme-data/drafts');
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${draft.id || 'draft-' + Date.now()}.json`);
  fs.writeFileSync(out, JSON.stringify(draft, null, 2) + '\n');
  console.log(`Draft written to ${out} (verified:false)`);
  if (errs.length) console.warn('Schema problems to fix by hand:\n - ' + errs.join('\n - '));
}

main().catch((e) => { console.error('draft-scheme failed:', e.message); process.exit(1); });
