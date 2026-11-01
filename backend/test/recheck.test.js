const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { compareRecords, recheck, renderReport } = require('../../scripts/recheck-schemes');

const real = JSON.parse(fs.readFileSync(path.join(__dirname, '../../scheme-data/schemes.json'), 'utf8'));
const base = real[0];

test('compare: identical draft has no differences (documents order/case ignored)', () => {
  const draft = { ...base, documents: [...base.documents].reverse().map((d) => d.toUpperCase()) };
  assert.deepStrictEqual(compareRecords(base, draft), []);
});

test('compare: detects amount, deadline, documents and eligibility changes', () => {
  const draft = {
    ...base, amount: 8000, deadline: '2027-03-31', documents: ['Aadhaar Card'],
    eligibility: { ...base.eligibility, maxAnnualIncome: 300000, occupations: ['any'] },
  };
  const fields = compareRecords(base, draft).map((d) => d.field).sort();
  assert.deepStrictEqual(fields, ['amount', 'deadline', 'documents', 'eligibility.maxAnnualIncome', 'eligibility.occupations']);
});

test('recheck: unreachable pages are recorded and skipped, run continues', async () => {
  const schemes = [real[0], real[1], real[2]];
  const deps = {
    fetchPageText: async (url) => {
      if (url === real[0].officialUrl) throw new Error('unreachable (CERT_HAS_EXPIRED)');
      return 'x'.repeat(500);
    },
    draftFromText: async (_t, { id }) => {
      const s = real.find((r) => r.id === id);
      return id === real[1].id ? { ...s, amount: 1 } : s;
    },
  };
  const results = await recheck(schemes, deps, () => {});
  assert.deepStrictEqual(results.map((r) => r.status), ['failed', 'changed', 'unchanged']);
  const report = renderReport(results, { when: 'now', demo: true });
  assert.match(report, /CERT_HAS_EXPIRED/);
  assert.match(report, new RegExp(`\\| ${real[1].id} \\| amount \\|`));
});

test('recheck: a page with almost no text is a failure, not a crash', async () => {
  const deps = { fetchPageText: async () => 'tiny', draftFromText: async () => { throw new Error('should not be called'); } };
  const [r] = await recheck([base], deps, () => {});
  assert.strictEqual(r.status, 'failed');
});
