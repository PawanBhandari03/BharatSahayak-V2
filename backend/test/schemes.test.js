const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const real = JSON.parse(fs.readFileSync(path.join(__dirname, '../../scheme-data/schemes.json'), 'utf8'));
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../../scheme-data/scheme.schema.json'), 'utf8'));
const { validateRecords } = require('../../scripts/validate-schemes');
const { matchSchemes } = require('../services/eligibility');

const tmpFile = (data) => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'schemes-')), 'schemes.json');
  fs.writeFileSync(f, JSON.stringify(data));
  return f;
};
const freshStore = (file, includeUnverified) => {
  process.env.SCHEMES_FILE = file;
  process.env.INCLUDE_UNVERIFIED = includeUnverified ? 'true' : 'false';
  delete require.cache[require.resolve('../services/schemeStore')];
  return require('../services/schemeStore');
};

test('shipped schemes.json passes the schema', () => {
  const { errors } = validateRecords(real, schema);
  assert.deepStrictEqual(errors, []);
});

test('validator rejects bad records', () => {
  const bad = [{ ...real[0], officialUrl: '' }, { ...real[1], verified: true, sourceUrl: 'https://x.gov.in', lastVerified: '2020-01-01' }];
  const { errors } = validateRecords(bad, schema, new Date('2026-11-01'));
  assert.ok(errors.some((e) => /officialUrl/.test(e)));
  assert.ok(errors.some((e) => /days old/.test(e)));
});

test('store hides unverified records by default and shows them with the flag', () => {
  const file = tmpFile([{ ...real[0], verified: true }, { ...real[1], verified: false }]);
  assert.strictEqual(freshStore(file, false).getAll().length, 1);
  assert.strictEqual(freshStore(file, true).getAll().length, 2);
});

test('store reloads when the file changes', async () => {
  const file = tmpFile([{ ...real[0], verified: true }]);
  const store = freshStore(file, false);
  assert.strictEqual(store.getAll().length, 1);
  await new Promise((r) => setTimeout(r, 20));
  fs.writeFileSync(file, JSON.stringify([{ ...real[0], verified: true }, { ...real[1], verified: true }]));
  fs.utimesSync(file, new Date(), new Date(Date.now() + 5000));
  assert.strictEqual(store.getAll().length, 2);
});

test('eligibility: Savitribai-style widow in Maharashtra matches Niradhar, a 25yo man does not', () => {
  const savitribai = { age: 52, gender: 'female', state: 'maharashtra', maritalStatus: 'widow / widower', occupation: 'farmer / kisan', annualIncome: 50000 };
  const ids = matchSchemes(savitribai, real).map((s) => s.id);
  assert.ok(ids.includes('sanjay-gandhi-niradhar'));
  assert.ok(ids.includes('pm-kisan'));
  const man = { age: 25, gender: 'male', state: 'maharashtra', maritalStatus: 'single', occupation: 'student', annualIncome: 50000 };
  const manIds = matchSchemes(man, real).map((s) => s.id);
  assert.ok(!manIds.includes('sanjay-gandhi-niradhar'));
  assert.ok(!manIds.includes('pmuy'));
});

test('eligibility: out-of-state user is excluded from state scheme', () => {
  const p = { age: 40, gender: 'female', state: 'punjab', maritalStatus: 'widow / widower', annualIncome: 50000 };
  assert.ok(!matchSchemes(p, real).some((s) => s.id === 'sanjay-gandhi-niradhar'));
});
