// Usage: npm run validate:schemes  (from backend/). Exit 1 on schema errors, missing officialUrl,
// duplicate ids, or verified records whose lastVerified is missing/older than 180 days.
const fs = require('fs');
const path = require('path');
const Ajv = require(require.resolve('ajv', { paths: [path.join(__dirname, '../backend')] }));

const DIR = path.join(__dirname, '../scheme-data');
const MAX_AGE_DAYS = 180;

function validateRecords(records, schema, today = new Date()) {
  const ajv = new Ajv({ allErrors: true });
  const check = ajv.compile(schema);
  const errors = [];
  const warnings = [];
  const seen = new Set();
  records.forEach((s, i) => {
    const tag = `${s && s.id ? s.id : '#' + i}`;
    if (!check(s)) {
      for (const e of check.errors) errors.push(`${tag}: ${e.instancePath || '/'} ${e.message}`);
    }
    if (!s || typeof s !== 'object') return;
    if (!s.officialUrl) errors.push(`${tag}: missing officialUrl`);
    if (seen.has(s.id)) errors.push(`${tag}: duplicate id`);
    seen.add(s.id);
    if (s.verified) {
      if (!s.sourceUrl) errors.push(`${tag}: verified but sourceUrl is null`);
      if (!s.lastVerified) errors.push(`${tag}: verified but lastVerified is null`);
      else {
        const days = (today - new Date(s.lastVerified)) / 86400000;
        if (days > MAX_AGE_DAYS) errors.push(`${tag}: lastVerified ${s.lastVerified} is ${Math.floor(days)} days old (>${MAX_AGE_DAYS})`);
      }
    } else {
      warnings.push(`${tag}: not verified (ignored by matching unless INCLUDE_UNVERIFIED=true)`);
    }
  });
  return { errors, warnings };
}

module.exports = { validateRecords };

if (require.main === module) {
  const schema = JSON.parse(fs.readFileSync(path.join(DIR, 'scheme.schema.json'), 'utf8'));
  const records = JSON.parse(fs.readFileSync(path.join(DIR, 'schemes.json'), 'utf8'));
  const { errors, warnings } = validateRecords(records, schema);
  warnings.forEach((w) => console.warn('WARN ', w));
  errors.forEach((e) => console.error('ERROR', e));
  const verified = records.filter((r) => r.verified).length;
  console.log(`${records.length} schemes, ${verified} verified, ${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}
