const test = require('node:test');
const assert = require('node:assert');

process.env.TWILIO_ACCOUNT_SID = 'ACtest';
process.env.TWILIO_AUTH_TOKEN = 'test';
const { checkAndCount, resetUsage } = require('../services/twilioService');

test('daily WhatsApp cap stops sending once reached and resets the next day', () => {
  process.env.WHATSAPP_DAILY_CAP = '3';
  resetUsage();
  assert.strictEqual(checkAndCount('Mon'), 1);
  assert.strictEqual(checkAndCount('Mon'), 2);
  assert.strictEqual(checkAndCount('Mon'), 3);
  assert.throws(() => checkAndCount('Mon'), /daily cap reached/);
  assert.strictEqual(checkAndCount('Tue'), 1);
  delete process.env.WHATSAPP_DAILY_CAP;
});
