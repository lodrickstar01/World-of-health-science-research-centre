-- World of Health Science Research Centre: starter schema
-- Run in Supabase SQL Editor. Review and test policies before production.
-- These forms collect contact/application metadata only; never store patient records here.

create extension if not exists pgcrypto;

create table if not exists public.researcher_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) <= 254),
  institution text,
  role_title text,
  research_interests text not null check (char_length(research_interests) between 10 and 3000),
  status text not null default 'pending' check (status in ('pending','reviewing','accepted','declined')),
  created_at timestamptz not null default now()
);

create table if not exists public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 240),
  lead_name text not null check (char_length(lead_name) between 1 and 120),
  email text not null check (char_length(email) <= 254),
  research_area text not null,
  summary text not null check (char_length(summary) between 30 and 5000),
  ethics_status text not null default 'not_applicable',
  status text not null default 'submitted' check (status in ('submitted','under_review','needs_revision','approved_for_development','declined')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 254),
  organisation text,
  enquiry_type text not null default 'general',
  message text not null check (char_length(message) between 10 and 4000),
  created_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text not null,
  publication_name text,
  publication_year integer,
  abstract text,
  doi_or_url text,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.health_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text not null,
  body text not null,
  sources jsonb not null default '[]'::jsonb,
  reviewed_by text,
  review_date date,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'researcher' check (role in ('researcher','editor','admin')),
  created_at timestamptz not null default now()
);

alter table public.researcher_applications enable row level security;
alter table public.project_submissions enable row level security;
alter table public.contact_messages enable row level security;
alter table public.publications enable row level security;
alter table public.health_articles enable row level security;
alter table public.profiles enable row level security;

-- Public form inserts only. No public reads or updates are granted.
create policy "Public can submit researcher application"
on public.researcher_applications for insert to anon, authenticated
with check (
  char_length(full_name) between 1 and 120
  and char_length(email) <= 254
  and char_length(research_interests) between 10 and 3000
  and status = 'pending'
);

create policy "Public can submit project proposal"
on public.project_submissions for insert to anon, authenticated
with check (
  char_length(title) between 1 and 240
  and char_length(summary) between 30 and 5000
  and status = 'submitted'
);

create policy "Public can send contact message"
on public.contact_messages for insert to anon, authenticated
with check (
  char_length(name) between 1 and 120
  and char_length(message) between 10 and 4000
);

-- Published content is publicly readable. Admin/editor write policies must be added
-- only after trusted role management and server-side authorization are configured.
create policy "Public can read published publications"
on public.publications for select to anon, authenticated
using (status = 'published');

create policy "Public can read published health articles"
on public.health_articles for select to anon, authenticated
using (status = 'published');

-- Do not add a public select policy to profiles or submission/contact tables.
-- Before production, implement and test admin/editor policies using a trusted role
-- assignment flow. Do not allow users to self-promote their profile role.
