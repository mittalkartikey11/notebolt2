import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Database Schema Setup SQL (run once in Supabase SQL editor) ─────────────
export const SCHEMA_SQL = `
-- Enable pgvector for future AI support
-- create extension if not exists vector;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text default '📁',
  color text default '#ea580c',
  description text,
  note_count int default 0,
  is_archived boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  icon text default '📝',
  description text,
  note_count int default 0,
  progress int default 0,
  is_pinned boolean default false,
  is_archived boolean default false,
  sort_order int default 0,
  last_activity_at timestamptz default now(),
  telegram_topic_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  color text default '#ea580c',
  usage_count int default 0,
  created_at timestamptz default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  title text,
  content jsonb,
  content_text text,
  bg_color text,
  is_pinned boolean default false,
  is_starred boolean default false,
  is_deleted boolean default false,
  is_completed boolean default false,
  progress int default 0,
  difficulty text check (difficulty in ('easy','medium','hard')),
  review_status text default 'not_started' check (review_status in ('not_started','in_progress','reviewed')),
  revision_count int default 0,
  telegram_message_id text unique,
  telegram_date timestamptz,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists note_tags (
  note_id uuid references notes(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid references notes(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  file_size int,
  telegram_file_id text,
  created_at timestamptz default now()
);

create table if not exists app_settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

create table if not exists progress_tracking (
  id uuid primary key default gen_random_uuid(),
  entity_type text check (entity_type in ('note','topic','category')),
  entity_id uuid,
  action text,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists revision_history (
  id uuid primary key default gen_random_uuid(),
  note_id uuid references notes(id) on delete cascade,
  content jsonb,
  changed_by text default 'user',
  created_at timestamptz default now()
);
`;
