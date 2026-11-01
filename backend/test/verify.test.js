const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { verifyRecord } = require('../../scripts/verify-scheme');

const list = JSON.parse(fs.readFileSync(path.join(__dirname, '../../scheme-data/schemes.json'), 'utf8'));

test('verifyRecord stamps verified, the page checked and the date, and touches nothing else', () => {
  const next = verifyRecord(list, 'pm-kisan', { source: 'https://pmkisan.gov.in/page', today: '2026-11-01' });
  const a = next.find((s) => s.id === 'pm-kisan');
  assert.strictEqual(a.verified, true);
  assert.strictEqual(a.sourceUrl, 'https://pmkisan.gov.in/page');
  assert.strictEqual(a.lastVerified, '2026-11-01');
  const before = list.find((s) => s.id === 'pm-kisan');
  assert.deepStrictEqual(a.eligibility, before.eligibility);
  assert.strictEqual(next.filter((s) => s.verified).length, 1, 'only that scheme changes');
  assert.strictEqual(before.verified, false, 'original list is not mutated');
});

test('verifyRecord refuses a missing or non-URL source and unknown ids', () => {
  assert.throws(() => verifyRecord(list, 'pm-kisan', { source: '' }), /source/);
  assert.throws(() => verifyRecord(list, 'pm-kisan', { source: 'not a url' }), /source/);
  assert.throws(() => verifyRecord(list, 'no-such-scheme', { source: 'https://x.gov.in' }), /No scheme/);
});
