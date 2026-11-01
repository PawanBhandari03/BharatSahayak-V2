const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { fitWhatsApp, MAX_CHARS, extractProfile, formatMatches } = require('../services/replyFormat');
const { matchSchemes } = require('../services/eligibility');

const schemes = JSON.parse(fs.readFileSync(path.join(__dirname, '../../scheme-data/schemes.json'), 'utf8'));
const t = (f) => (f && typeof f === 'object' ? f.en : f);

test('short replies are unchanged', () => {
  assert.strictEqual(fitWhatsApp('  नमस्ते  '), 'नमस्ते');
});

test('long replies are cut under the WhatsApp limit at a line break', () => {
  const out = fitWhatsApp('योजना का नाम और लाभ की जानकारी यहाँ दी गई है।\n'.repeat(200));
  assert.ok(out.length <= MAX_CHARS + 2, `length ${out.length}`);
  assert.ok(out.endsWith('…'));
});

test('a very long text with no breaks is still cut', () => {
  assert.ok(fitWhatsApp('a'.repeat(5000)).length < 1600);
});

test('extractProfile reads the AI hand-off line and normalises values', () => {
  const p = extractProfile('PROFILE_JSON {"age":"30","gender":"male","state":"Maharashtra","occupation":"student","annualIncome":100000,"category":"OBC","maritalStatus":"","language":"hi"}');
  assert.strictEqual(p.age, 30);
  assert.strictEqual(p.gender, 'Male');
  assert.strictEqual(p.occupation, 'Student');
  assert.strictEqual(p.language, 'hi');
  assert.strictEqual(extractProfile('just chatting'), null);
  assert.strictEqual(extractProfile('PROFILE_JSON {broken'), null);
});

test('a male student is never shown women-only schemes (the bug seen on WhatsApp)', () => {
  const p = extractProfile('PROFILE_JSON {"age":30,"gender":"Male","state":"Maharashtra","occupation":"Student","annualIncome":100000,"category":"OBC","language":"en"}');
  const matches = matchSchemes(p, schemes);
  const ids = matches.map((s) => s.id);
  for (const womenOnly of ['majhi-ladki-bahin', 'pmuy', 'pm-matru-vandana', 'sanjay-gandhi-niradhar', 'sukanya-samriddhi']) {
    assert.ok(!ids.includes(womenOnly), womenOnly + ' should not match a man');
  }
  assert.ok(formatMatches(matches, 'en', t).length < 1400);
});

test('formatMatches handles no matches and other languages', () => {
  assert.match(formatMatches([], 'hi', t), /योजना/);
  assert.match(formatMatches([schemes[0]], 'mr', t), /योजनांसाठी/);
});

test('most specific schemes are listed first (student sees student schemes before generic ones)', () => {
  const p = { age: 20, gender: 'Male', state: 'Maharashtra', occupation: 'Student', annualIncome: 100000, category: 'SC', language: 'en' };
  const msg = formatMatches(matchSchemes(p, schemes), 'en', t);
  const firstLine = msg.split('\n').find((l) => l.startsWith('•'));
  assert.match(firstLine, /Scholarship|Post-Matric/i);
});
