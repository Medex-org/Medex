-- MEDX admin content fixes.
-- Run this in the Supabase SQL editor after 001_site_content.sql.
-- Safe to rerun: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- Managed content tables: create if missing (defensive), then add any columns
-- the admin UI writes that older versions of the schema did not include.
-- ---------------------------------------------------------------------------

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  badge text,
  description text not null,
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.webinars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cadence text,
  description text not null,
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_banners (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text,
  description text,
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  linkedin_url text,
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.global_officers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  intro text,
  linkedin_url text,
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Columns the admin payload expects but older installs are missing.
alter table public.news_highlights add column if not exists image_path text;
alter table public.webinars add column if not exists image_path text;
alter table public.event_banners add column if not exists description text;

-- GPS coordinates for in-person and hybrid events.
alter table public.events add column if not exists latitude double precision;
alter table public.events add column if not exists longitude double precision;

-- ---------------------------------------------------------------------------
-- Row level security and policies (recreated so reruns converge).
-- ---------------------------------------------------------------------------

alter table public.achievements enable row level security;
alter table public.news_highlights enable row level security;
alter table public.webinars enable row level security;
alter table public.event_banners enable row level security;
alter table public.partners enable row level security;
alter table public.global_officers enable row level security;

drop policy if exists "Public achievements are readable" on public.achievements;
create policy "Public achievements are readable"
on public.achievements for select using (true);
drop policy if exists "Authenticated users can manage achievements" on public.achievements;
create policy "Authenticated users can manage achievements"
on public.achievements for all to authenticated using (true) with check (true);

drop policy if exists "Public news highlights are readable" on public.news_highlights;
create policy "Public news highlights are readable"
on public.news_highlights for select using (true);
drop policy if exists "Authenticated users can manage news highlights" on public.news_highlights;
create policy "Authenticated users can manage news highlights"
on public.news_highlights for all to authenticated using (true) with check (true);

drop policy if exists "Public webinars are readable" on public.webinars;
create policy "Public webinars are readable"
on public.webinars for select using (true);
drop policy if exists "Authenticated users can manage webinars" on public.webinars;
create policy "Authenticated users can manage webinars"
on public.webinars for all to authenticated using (true) with check (true);

drop policy if exists "Public event banners are readable" on public.event_banners;
create policy "Public event banners are readable"
on public.event_banners for select using (true);
drop policy if exists "Authenticated users can manage event banners" on public.event_banners;
create policy "Authenticated users can manage event banners"
on public.event_banners for all to authenticated using (true) with check (true);

drop policy if exists "Public partners are readable" on public.partners;
create policy "Public partners are readable"
on public.partners for select using (true);
drop policy if exists "Authenticated users can manage partners" on public.partners;
create policy "Authenticated users can manage partners"
on public.partners for all to authenticated using (true) with check (true);

drop policy if exists "Public global officers are readable" on public.global_officers;
create policy "Public global officers are readable"
on public.global_officers for select using (true);
drop policy if exists "Authenticated users can manage global officers" on public.global_officers;
create policy "Authenticated users can manage global officers"
on public.global_officers for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Media bucket: allow documents and video, not just images.
-- 25 MB cap matches the admin upload limit.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

update storage.buckets
set file_size_limit = 26214400,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4', 'video/webm', 'video/quicktime'
    ]
where id = 'media';

drop policy if exists "Public media files are readable" on storage.objects;
create policy "Public media files are readable"
on storage.objects for select using (bucket_id = 'media');

drop policy if exists "Authenticated admins can upload media" on storage.objects;
create policy "Authenticated admins can upload media"
on storage.objects for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "Authenticated admins can update media" on storage.objects;
create policy "Authenticated admins can update media"
on storage.objects for update to authenticated using (bucket_id = 'media');

drop policy if exists "Authenticated admins can delete media" on storage.objects;
create policy "Authenticated admins can delete media"
on storage.objects for delete to authenticated using (bucket_id = 'media');

notify pgrst, 'reload schema';
