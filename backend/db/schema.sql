-- BharatSahayak database schema (Supabase / PostgreSQL).
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Columns mirror what backend/controllers/schemeController.js and userController.js read and write.

create table if not exists profiles (
  id               uuid primary key default gen_random_uuid(),
  name             text,
  age              integer,
  gender           text,
  marital_status   text,
  category         text,
  aadhaar_last_4   text,
  state            text,
  district         text,
  occupation       text,
  has_land         boolean default false,
  land_acres       numeric default 0,
  has_smartphone   boolean default true,
  income_range     text,
  annual_income    numeric,
  family_size      integer default 1,
  children_count   integer default 0,
  has_bpl_card     boolean default false,
  mobile           text unique,
  whatsapp_opt_in  boolean default true,
  pin_hash         text,
  created_at       timestamptz default now()
);

create table if not exists user_recommendations (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid references profiles(id) on delete cascade,
  matched_schemes  jsonb,
  ai_response      text,
  created_at       timestamptz default now()
);

-- The backend uses the secret (service) key, which bypasses Row Level Security.
-- Turn RLS on so the publishable key can never read these tables from a browser.
alter table profiles enable row level security;
alter table user_recommendations enable row level security;
