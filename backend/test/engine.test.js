const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { evaluate, matchSchemes } = require('../services/eligibility');

const schemes = JSON.parse(fs.readFileSync(path.join(__dirname, '../../scheme-data/schemes.json'), 'utf8'));
const by = (id) => schemes.find((s) => s.id === id);
const level = (profile, id) => evaluate(profile, by(id)).eligible;

// Same strings the registration form produces (see frontend/src/demo/personas.js)
const SAVITRIBAI = { age: 52, gender: 'Female', state: 'Maharashtra', occupation: 'Farmer / Kisan', annualIncome: 50000, annualIncomeMin: 0, category: 'OBC', hasLand: 'Yes', maritalStatus: 'Widow / Widower', hasBPL: 'Yes' };
const AARAV = { age: 18, gender: 'Male', state: 'Maharashtra', occupation: 'Student', annualIncome: 200000, annualIncomeMin: 150001, category: 'OBC', maritalStatus: 'Single', hasBPL: 'No' };
const RAHUL = { age: 26, gender: 'Male', state: 'Maharashtra', occupation: 'Self-Employed (Small Business)', annualIncome: 500000, annualIncomeMin: 300001, category: 'General', maritalStatus: 'Single', hasBPL: 'No' };

const yesIds = (p) => schemes.filter((s) => evaluate(p, s).eligible === 'yes').map((s) => s.id);

test('Savitribai (widow farmer, Maharashtra): confident matches', () => {
  const ids = yesIds(SAVITRIBAI);
  for (const id of ['pm-kisan', 'sanjay-gandhi-niradhar', 'ignwps', 'majhi-ladki-bahin', 'namo-shetkari', 'pmfby']) {
    assert.ok(ids.includes(id), `${id} should be a clear yes`);
  }
  assert.ok(!ids.includes('pm-jay-vay-vandana'), 'under 70');
});

test('Aarav (18, student): no widow/farmer/women schemes', () => {
  const ids = matchSchemes(AARAV, schemes).map((s) => s.id);
  for (const id of ['sanjay-gandhi-niradhar', 'ignwps', 'pm-kisan', 'majhi-ladki-bahin', 'pmuy', 'ignoaps']) {
    assert.ok(!ids.includes(id), `${id} must not match`);
  }
});

test('Rahul (entrepreneur): sees business schemes, not pensions for the elderly', () => {
  const ids = matchSchemes(RAHUL, schemes).map((s) => s.id);
  assert.ok(ids.includes('mudra-loan'));
  assert.ok(!ids.includes('ignoaps'));
});

test('age boundary is inclusive: 60 qualifies for old-age pension, 59 does not', () => {
  const base = { gender: 'Male', state: 'Bihar', hasBPL: 'Yes' };
  assert.notStrictEqual(level({ ...base, age: 60 }, 'ignoaps'), 'no');
  assert.strictEqual(level({ ...base, age: 59 }, 'ignoaps'), 'no');
});

test('wrong state is a blocker; missing state is only "maybe"', () => {
  const p = { age: 40, gender: 'Female' };
  assert.strictEqual(level({ ...p, state: 'Punjab' }, 'majhi-ladki-bahin'), 'no');
  assert.strictEqual(level(p, 'majhi-ladki-bahin'), 'maybe');
});

test('widow under 40 is not shown the national widow pension', () => {
  assert.strictEqual(level({ age: 35, gender: 'Female', maritalStatus: 'Widow / Widower', annualIncome: 50000 }, 'ignwps'), 'no');
});

test('missing income gives "maybe", never a silent yes', () => {
  assert.strictEqual(level({ age: 30, gender: 'Female', state: 'Maharashtra' }, 'majhi-ladki-bahin'), 'maybe');
});

test('income range that straddles the limit is "maybe"; fully above is "no"', () => {
  const base = { age: 30, gender: 'Female', state: 'Maharashtra' };
  // limit is 250000: range 2,00,001-3,00,000 straddles it, range 3,00,001-5,00,000 is above it
  assert.strictEqual(level({ ...base, annualIncome: 300000, annualIncomeMin: 200001 }, 'majhi-ladki-bahin'), 'maybe');
  assert.strictEqual(level({ ...base, annualIncome: 500000, annualIncomeMin: 300001 }, 'majhi-ladki-bahin'), 'no');
});

test('PM-KISAN: farm-land question unanswered is "maybe", answered No is "no"', () => {
  const farmer = { age: 40, occupation: 'Farmer / Kisan', annualIncome: 50000 };
  assert.strictEqual(level(farmer, 'pm-kisan'), 'maybe');
  assert.strictEqual(level({ ...farmer, hasLand: 'No' }, 'pm-kisan'), 'no');
  assert.strictEqual(level({ ...farmer, hasLand: 'Yes' }, 'pm-kisan'), 'yes');
});

test('every result explains itself', () => {
  const r = evaluate(SAVITRIBAI, by('sanjay-gandhi-niradhar'));
  assert.ok(r.reasons.length > 0);
  const n = evaluate(AARAV, by('sanjay-gandhi-niradhar'));
  assert.ok(n.blockers.length > 0);
});
