const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Free/sandbox Twilio accounts have a small daily message allowance. Stop sending before it runs out.
// WHATSAPP_DAILY_CAP (default 80) counts outbound messages per server-day; resets at midnight (server time).
const usage = { day: '', count: 0 };
function checkAndCount(today = new Date().toDateString()) {
  const cap = Number(process.env.WHATSAPP_DAILY_CAP || 80);
  if (usage.day !== today) { usage.day = today; usage.count = 0; }
  if (usage.count >= cap) {
    throw new Error(`WhatsApp daily cap reached (${cap}). Raise WHATSAPP_DAILY_CAP or wait until tomorrow.`);
  }
  usage.count += 1;
  return usage.count;
}
function resetUsage() { usage.day = ''; usage.count = 0; }

/**
 * Send a WhatsApp template message via Twilio Sandbox
 * @param {string} to - Recipient phone number e.g. '+917057167045'
 * @param {Object} variables - Template variables e.g. { "1": "12/1", "2": "3pm" }
 */
async function sendWhatsAppTemplate(to, variables = {}) {
  checkAndCount();
  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,        // whatsapp:+14155238886
    to: `whatsapp:${to}`,
    contentSid: process.env.TWILIO_TEMPLATE_SID,   // HXb5b...
    contentVariables: JSON.stringify(variables),
  });

  console.log(`[Twilio] Message sent. SID: ${message.sid}`);
  return message.sid;
}

/**
 * Send a plain WhatsApp text message
 * @param {string} to - Recipient phone number e.g. '+917057167045'
 * @param {string} body - Message text
 */
async function sendWhatsAppText(to, body) {
  checkAndCount();
  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
  });

  console.log(`[Twilio] Message sent. SID: ${message.sid}`);
  return message.sid;
}

module.exports = { sendWhatsAppTemplate, sendWhatsAppText, checkAndCount, resetUsage };
