-- Nexus Copilot Supabase Schema
create extension if not exists vector;

create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text,
  plan text default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  title text,
  mode text check (mode in ('meeting', 'coding', 'interview', 'general')),
  status text check (status in ('active', 'ended', 'paused')),
  started_at timestamptz default now(),
  ended_at timestamptz,
  summary text,
  metadata jsonb default '{}'::jsonb
);

create table transcripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  session_id uuid references sessions(id) on delete cascade,
  source text,
  speaker_label text,
  text text not null,
  is_final boolean default false,
  provider text,
  confidence numeric,
  timestamp_start numeric,
  timestamp_end numeric,
  created_at timestamptz default now()
);

create index idx_transcripts_session on transcripts(session_id);
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table transcripts enable row level security;
