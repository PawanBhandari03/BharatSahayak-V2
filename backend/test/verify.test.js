const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { verifyRecord } = require('../../scripts/verify-scheme');

const list = JSON.parse(fs.readFileSync(path.join(__dirname, '../../scheme-data/schemes.json'), 'utf8'));

test('verifyRecord stamps verified, the page checked and the date, and touches nothing else', () => {
  const target = list.find((s) => !s.verified); // any scheme that is not verified yet
  const verifiedBefore = list.filter((s) => s.verified).length;
  const next = verifyRecord(list, target.id, { source: 'https://example.gov.in/page', today: '2026-11-01' });
  const a = next.find((s) => s.id === target.id);
  assert.strictEqual(a.verified, true);
  assert.strictEqual(a.sourceUrl, 'https://example.gov.in/page');
  assert.strictEqual(a.lastVerified, '2026-11-01');
  assert.deepStrictEqual(a.eligibility, target.eligibility);
  assert.strictEqual(next.filter((s) => s.verified).length, verifiedBefore + 1, 'only that scheme changes');
  assert.strictEqual(target.verified, false, 'original list is not mutated');
});

test('verifyRecord refuses a missing or non-URL source and unknown ids', () => {
  assert.throws(() => verifyRecord(list, 'pm-kisan', { source: '' }), /source/);
  assert.throws(() => verifyRecord(list, 'pm-kisan', { source: 'not a url' }), /source/);
  assert.throws(() => verifyRecord(list, 'no-such-scheme', { source: 'https://x.gov.in' }), /No scheme/);
});
