const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_KEY is missing from .env. Database features will be disabled.');
}

// Service role key bypasses Row Level Security — safe for server-side only
// Node 20 has no built-in WebSocket (added in Node 22); the realtime client needs one even
// though this app never opens a realtime subscription, so it is given one explicitly here.
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, { realtime: { transport: WebSocket } })
  : null;

module.exports = supabase;
