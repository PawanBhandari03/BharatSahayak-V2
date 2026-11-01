// Single module every channel (web API, WhatsApp, voice) uses to read schemes.
// Reads scheme-data/schemes.json, keeps only verified:true records (unless INCLUDE_UNVERIFIED=true),
// caches in memory and reloads when the file's mtime changes.
const fs = require('fs');
const path = require('path');

const FILE = process.env.SCHEMES_FILE || path.join(__dirname, '../../scheme-data/schemes.json');

let cache = null; // { mtimeMs, all }

function includeUnverified() {
  return String(process.env.INCLUDE_UNVERIFIED || '').toLowerCase() === 'true';
}

function load() {
  const mtimeMs = fs.statSync(FILE).mtimeMs;
  if (cache && cache.mtimeMs === mtimeMs) return cache.all;
  try {
    const all = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (!Array.isArray(all)) throw new Error('schemes file must be a JSON array');
    cache = { mtimeMs, all };
    console.log(`[schemeStore] loaded ${all.length} schemes (${all.filter((s) => s.verified).length} verified)`);
  } catch (e) {
    console.error('[schemeStore] failed to load schemes:', e.message);
    if (!cache) cache = { mtimeMs, all: [] }; // keep last good data if a reload fails
  }
  return cache.all;
}

function getAll() {
  const all = load();
  return includeUnverified() ? all : all.filter((s) => s.verified === true);
}

function getById(id) {
  return getAll().find((s) => s.id === id) || null;
}

function reload() {
  cache = null;
  return getAll();
}

// Pick a language with fallback to English.
function t(field, lang = 'en') {
  if (!field || typeof field !== 'object') return field ?? '';
  return field[lang] || field.en || '';
}

module.exports = { getAll, getById, reload, t };
