-- MEDX consolidated schema.
--
-- This is the single source of truth for the MEDX Supabase project. Run the
-- whole file in the Supabase SQL editor. It is safe to rerun: tables, columns,
-- functions, indexes, policies, bucket settings, seeds, and backfills all
-- converge to the same state.
--
-- Upload limits are enforced in two places:
--   * This file: storage.buckets.file_size_limit = 52428800 (50 MB).
--   * src/admin/media-utils.ts: MAX_VIDEO_BYTES = 50 MB, MAX_UPLOAD_BYTES = 25 MB.
-- Keep those values in sync. 50 MB is the Supabase Free plan maximum per file.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text,
  full_name text,
  department_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  bucket_path text not null,
  mime_type text,
  size_bytes bigint not null default 0,
  uploaded_by uuid references auth.users(id) on delete set null,
  used_in jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text not null,
  start_date date,
  status text not null default 'draft' check (status in ('draft', 'published')),
  image_path text,
  registration_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  body text not null,
  date date,
  status text not null default 'draft' check (status in ('draft', 'published')),
  image_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  date date,
  end_date date,
  time time,
  timezone text,
  location_type text not null default 'Virtual' check (location_type in ('Virtual', 'In person', 'Hybrid')),
  location text,
  latitude double precision,
  longitude double precision,
  description text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  registration_url text,
  image_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  scope text not null default 'global',
  department_slug text,
  level_key text,
  person_key text,
  supervisor_key text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 200),
  email text not null check (char_length(trim(email)) between 3 and 320),
  position text not null check (char_length(trim(position)) between 1 and 200),
  department text,
  message text,
  portfolio_url text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Repair columns
--
-- These are deliberately additive and nullable where old rows might not have a
-- value. The admin app always supplies the required values on insert/update.
-- This section is what makes an older project converge without dropping data.
-- Note: do NOT add a description column to global_officers. The app uses intro.
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists email text,
  add column if not exists role text,
  add column if not exists full_name text,
  add column if not exists department_slug text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.media
  add column if not exists file_name text,
  add column if not exists bucket_path text,
  add column if not exists mime_type text,
  add column if not exists size_bytes bigint not null default 0,
  add column if not exists uploaded_by uuid references auth.users(id) on delete set null,
  add column if not exists used_in jsonb not null default '[]'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.courses
  add column if not exists title text,
  add column if not exists category text,
  add column if not exists description text,
  add column if not exists start_date date,
  add column if not exists status text not null default 'draft',
  add column if not exists image_path text,
  add column if not exists registration_url text,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.news_updates
  add column if not exists title text,
  add column if not exists category text,
  add column if not exists body text,
  add column if not exists date date,
  add column if not exists status text not null default 'draft',
  add column if not exists image_path text,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.events
  add column if not exists title text,
  add column if not exists category text,
  add column if not exists date date,
  add column if not exists end_date date,
  add column if not exists time time,
  add column if not exists timezone text,
  add column if not exists location_type text not null default 'Virtual',
  add column if not exists location text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists description text,
  add column if not exists status text not null default 'draft',
  add column if not exists registration_url text,
  add column if not exists image_path text,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.achievements
  add column if not exists title text,
  add column if not exists badge text,
  add column if not exists description text,
  add column if not exists image_path text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.news_highlights
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists image_path text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.webinars
  add column if not exists title text,
  add column if not exists cadence text,
  add column if not exists description text,
  add column if not exists image_path text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.event_banners
  add column if not exists label text,
  add column if not exists href text,
  add column if not exists description text,
  add column if not exists image_path text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.partners
  add column if not exists name text,
  add column if not exists description text,
  add column if not exists linkedin_url text,
  add column if not exists image_path text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.global_officers
  add column if not exists name text,
  add column if not exists role text,
  add column if not exists intro text,
  add column if not exists linkedin_url text,
  add column if not exists image_path text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists scope text not null default 'global',
  add column if not exists department_slug text,
  add column if not exists level_key text,
  add column if not exists person_key text,
  add column if not exists supervisor_key text,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.applications
  add column if not exists name text,
  add column if not exists email text,
  add column if not exists position text,
  add column if not exists department text,
  add column if not exists message text,
  add column if not exists portfolio_url text,
  add column if not exists status text not null default 'new',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Backfill defaults for rows created before the newer columns existed.
update public.media set used_in = '[]'::jsonb where used_in is null;
update public.media set size_bytes = 0 where size_bytes is null;
update public.courses set status = 'draft' where status is null;
update public.news_updates set status = 'draft' where status is null;
update public.events set status = 'draft' where status is null;
update public.events set location_type = 'Virtual' where location_type is null;
update public.applications set status = 'new' where status is null;
update public.global_officers set scope = 'global' where scope is null;
update public.global_officers set is_active = true where is_active is null;
update public.global_officers set sort_order = 0 where sort_order is null;

-- ---------------------------------------------------------------------------
-- 3. Access helper functions
-- ---------------------------------------------------------------------------

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_profile_department()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select department_slug from public.profiles where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('admin', 'super_admin'), false);
$$;

create or replace function public.can_manage_team_row(row_scope text, row_department text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_super_admin()
    or (
      public.current_profile_role() = 'department_admin'
      and row_scope = 'department'
      and row_department = public.current_profile_department()
    );
$$;

create or replace function public.can_manage_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('admin', 'super_admin', 'editor'), false);
$$;

-- ---------------------------------------------------------------------------
-- 4. Indexes
-- ---------------------------------------------------------------------------

create unique index if not exists media_bucket_path_key on public.media(bucket_path);
create index if not exists global_officers_scope_department_level_idx
  on public.global_officers (scope, department_slug, level_key, sort_order);
create index if not exists applications_status_created_idx
  on public.applications (status, created_at desc);

-- ---------------------------------------------------------------------------
-- 5. Row level security and policies
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.media enable row level security;
alter table public.courses enable row level security;
alter table public.news_updates enable row level security;
alter table public.events enable row level security;
alter table public.achievements enable row level security;
alter table public.news_highlights enable row level security;
alter table public.webinars enable row level security;
alter table public.event_banners enable row level security;
alter table public.partners enable row level security;
alter table public.global_officers enable row level security;
alter table public.applications enable row level security;

-- Profiles: users can read themselves; super admins can read and update all.
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = auth.uid());

drop policy if exists "Super admins can read all profiles" on public.profiles;
create policy "Super admins can read all profiles"
on public.profiles for select to authenticated
using (public.is_super_admin());

drop policy if exists "Super admins can update profiles" on public.profiles;
create policy "Super admins can update profiles"
on public.profiles for update to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

-- Media records: public read; content managers and department admins write.
drop policy if exists "Public media records are readable" on public.media;
create policy "Public media records are readable"
on public.media for select
using (true);

drop policy if exists "Authenticated users can manage media records" on public.media;
drop policy if exists "Admins can manage media records" on public.media;
create policy "Admins can manage media records"
on public.media for all to authenticated
using (public.can_manage_content() or public.current_profile_role() = 'department_admin')
with check (public.can_manage_content() or public.current_profile_role() = 'department_admin');

-- Courses.
drop policy if exists "Public published courses are readable" on public.courses;
create policy "Public published courses are readable"
on public.courses for select
using (status = 'published');

drop policy if exists "Authenticated users can manage courses" on public.courses;
drop policy if exists "Super admins can manage courses" on public.courses;
create policy "Super admins can manage courses"
on public.courses for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

-- News updates.
drop policy if exists "Public published news is readable" on public.news_updates;
create policy "Public published news is readable"
on public.news_updates for select
using (status = 'published');

drop policy if exists "Authenticated users can manage news" on public.news_updates;
drop policy if exists "Super admins can manage news" on public.news_updates;
create policy "Super admins can manage news"
on public.news_updates for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

-- Events.
drop policy if exists "Public published events are readable" on public.events;
create policy "Public published events are readable"
on public.events for select
using (status = 'published');

drop policy if exists "Authenticated users can manage events" on public.events;
drop policy if exists "Super admins can manage events" on public.events;
create policy "Super admins can manage events"
on public.events for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

-- Achievements.
drop policy if exists "Public achievements are readable" on public.achievements;
create policy "Public achievements are readable"
on public.achievements for select
using (true);

drop policy if exists "Authenticated users can manage achievements" on public.achievements;
drop policy if exists "Super admins can manage achievements" on public.achievements;
create policy "Super admins can manage achievements"
on public.achievements for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

-- News highlights.
drop policy if exists "Public news highlights are readable" on public.news_highlights;
create policy "Public news highlights are readable"
on public.news_highlights for select
using (true);

drop policy if exists "Authenticated users can manage news highlights" on public.news_highlights;
drop policy if exists "Super admins can manage news highlights" on public.news_highlights;
create policy "Super admins can manage news highlights"
on public.news_highlights for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

-- Webinars.
drop policy if exists "Public webinars are readable" on public.webinars;
create policy "Public webinars are readable"
on public.webinars for select
using (true);

drop policy if exists "Authenticated users can manage webinars" on public.webinars;
drop policy if exists "Super admins can manage webinars" on public.webinars;
create policy "Super admins can manage webinars"
on public.webinars for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

-- Event banners.
drop policy if exists "Public event banners are readable" on public.event_banners;
create policy "Public event banners are readable"
on public.event_banners for select
using (true);

drop policy if exists "Authenticated users can manage event banners" on public.event_banners;
drop policy if exists "Super admins can manage event banners" on public.event_banners;
create policy "Super admins can manage event banners"
on public.event_banners for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

-- Partners.
drop policy if exists "Public partners are readable" on public.partners;
create policy "Public partners are readable"
on public.partners for select
using (true);

drop policy if exists "Authenticated users can manage partners" on public.partners;
drop policy if exists "Super admins can manage partners" on public.partners;
create policy "Super admins can manage partners"
on public.partners for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

-- Global officers and department teams.
drop policy if exists "Public global officers are readable" on public.global_officers;
create policy "Public global officers are readable"
on public.global_officers for select
using (true);

drop policy if exists "Authenticated users can manage global officers" on public.global_officers;
drop policy if exists "Admins can manage global officers" on public.global_officers;
create policy "Admins can manage global officers"
on public.global_officers for all to authenticated
using (public.can_manage_team_row(scope, department_slug))
with check (public.can_manage_team_row(scope, department_slug));

-- Applications: public insert, admin read/update/delete.
drop policy if exists "Public can submit applications" on public.applications;
create policy "Public can submit applications"
on public.applications for insert to anon, authenticated
with check (status = 'new');

drop policy if exists "Admins can read applications" on public.applications;
create policy "Admins can read applications"
on public.applications for select to authenticated
using (public.can_manage_content());

drop policy if exists "Admins can update applications" on public.applications;
create policy "Admins can update applications"
on public.applications for update to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Admins can delete applications" on public.applications;
create policy "Admins can delete applications"
on public.applications for delete to authenticated
using (public.can_manage_content());

-- ---------------------------------------------------------------------------
-- 6. Storage bucket and object policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public media files are readable" on storage.objects;
create policy "Public media files are readable"
on storage.objects for select
using (bucket_id = 'media');

drop policy if exists "Authenticated admins can upload media" on storage.objects;
drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'media'
  and (public.can_manage_content() or public.current_profile_role() = 'department_admin')
);

drop policy if exists "Authenticated admins can update media" on storage.objects;
drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media"
on storage.objects for update to authenticated
using (
  bucket_id = 'media'
  and (public.can_manage_content() or public.current_profile_role() = 'department_admin')
)
with check (
  bucket_id = 'media'
  and (public.can_manage_content() or public.current_profile_role() = 'department_admin')
);

drop policy if exists "Authenticated admins can delete media" on storage.objects;
drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'media'
  and (public.can_manage_content() or public.current_profile_role() = 'department_admin')
);

-- ---------------------------------------------------------------------------
-- 7. Seed content
-- ---------------------------------------------------------------------------

insert into public.achievements (title, badge, description, sort_order)
select * from (values
  ('6-Lecture SRMA Workshop Series', 'Flagship', 'A structured six-lecture series on systematic review and meta-analysis methodology, from basics to publication.', 0),
  ('LTE Recap & Interactive Q&A', 'Completed', 'A recap session on Letter to the Editor writing with live, interactive Q&A - held in collaboration with NSRI.', 1),
  ('Basics of Research & Publication', 'Ongoing', 'A free introductory workshop covering research fundamentals and why structured mentorship matters.', 2),
  ('Collaborative Research Week × NSRI BUMHS-LC', 'Featured', 'A multi-day intensive research program co-hosted with NSRI BUMHS-LC, covering the full research pipeline.', 3)
) as seed(title, badge, description, sort_order)
where not exists (select 1 from public.achievements);

insert into public.news_highlights (title, description, sort_order)
select * from (values
  ('SRMA Project-1 underway, led by Tarooba Khan', 'MEDX''s flagship active systematic review is progressing toward its September completion target.', 0),
  ('Research Week wraps with NSRI BUMHS-LC', 'Students completed the full pipeline - from topic selection to manuscript writing and SPSS analysis.', 1),
  ('GradMeta partnership brings members free SR tooling', 'MEDX members now get access to GradMeta''s professional systematic review tool at no cost.', 2)
) as seed(title, description, sort_order)
where not exists (select 1 from public.news_highlights);

insert into public.webinars (title, cadence, description, sort_order)
select * from (values
  ('SRMA Free Lecture Series', 'Recurring', 'Free introductory lectures on systematic review and meta-analysis methodology, open to all.', 0),
  ('LTE Lecture Series', 'Ongoing Cohorts', 'Structured lectures on Letter to the Editor writing and long-term mentorship engagement.', 1)
) as seed(title, cadence, description, sort_order)
where not exists (select 1 from public.webinars);

insert into public.event_banners (label, href, sort_order)
select * from (values
  ('Global Main Officer Recruitment', '/team', 0),
  ('City Representative Slots Open', '/city-reps', 1),
  ('Campus Ambassador Recruitment', '/city-reps', 2),
  ('MEDX Minds - Speakers & Storytellers', '/medx-minds', 3)
) as seed(label, href, sort_order)
where not exists (select 1 from public.event_banners);

insert into public.partners (name, description, linkedin_url, sort_order)
select * from (values
  ('Metasphere Global', 'AI-Powered Research & Education for Clinician-Scientists.', 'https://www.linkedin.com/company/metasphere-global/', 0),
  ('GradMeta', 'AI-Powered Research Solutions', 'https://www.linkedin.com/company/gradmeta/', 1),
  ('SRF AKU', 'Student Research Forum, Aga Khan University', null, 2),
  ('NSRI BUMHS-LC', 'National Students Research Institution', null, 3)
) as seed(name, description, linkedin_url, sort_order)
where not exists (select 1 from public.partners);

insert into public.global_officers (name, role, intro, sort_order)
select * from (values
  ('Sangeen Khan Mandokhail', 'Founder & Chief Executive Officer (CEO)', 'Founded MEDX R&Ed to give medical students structured access to research methodology, mentorship, and a global peer network.', 0),
  ('Ifza Zia', 'Co-Founder & Chief Operational Officer (COO)', 'Co-founder overseeing MEDX''s day-to-day operations across departments and chapters.', 1),
  ('Soham Biren', 'Chief Internal Officer (CIO)', 'Co-founder shaping MEDX''s information and technology strategy.', 2),
  ('Smyan Reddy', 'Chief Advisor (CA)', 'Advises MEDX leadership across strategy and program direction.', 3),
  ('Tarooba Khan', 'Chief Research Officer (CRO)', 'Leads MEDX''s research strategy and currently heads SRMA Project-1.', 4),
  ('Aruzhan Maratova', 'Chief Tech Officer (CTO)', 'Leads MEDX''s technology direction, including the centralized LMS.', 5),
  ('Imad Khan', 'Chief Officer MEDX Education (CO.ME)', 'Leads MEDX''s education strategy across academic programs and Higher Pathways guidance.', 6),
  ('Shaikh Kamil', 'Chief External Affairs and Partnerships Officer (CEPO)', 'Leads MEDX''s strategic partnerships and external collaborations.', 7),
  ('Open Position', 'Chief Officer MEDX Minds (Co.MM)', null, 8),
  ('Open Position', 'Chief Officer Medical Exchange (CO.MX)', null, 9)
) as seed(name, role, intro, sort_order)
where not exists (select 1 from public.global_officers);

insert into public.courses (title, category, description, status, registration_url)
select * from (values
  ('SRMA Foundations', 'Research', 'Systematic review and meta-analysis methodology.', 'published', 'https://forms.gle/yJzGnk4DwmWysygv9'),
  ('Manuscript Writing Essentials', 'Research', 'Practical manuscript writing skills for medical research.', 'published', 'https://forms.gle/yJzGnk4DwmWysygv9'),
  ('SPSS for Medical Research', 'Technology', 'A practical introduction to SPSS data analysis.', 'published', 'https://forms.gle/yJzGnk4DwmWysygv9')
) as seed(title, category, description, status, registration_url)
where not exists (select 1 from public.courses);

insert into public.events (title, category, date, time, timezone, location_type, description, status, registration_url)
select * from (values
  ('ASH Annual Meeting', 'Conference', null::date, null::time, null, 'Virtual', 'MEDX R&Ed is preparing participants for the American Society of Hematology Annual Meeting - one of the premier global conferences in blood disorders research. Apply for mentorship and abstract preparation support.', 'published', 'https://forms.gle/yJzGnk4DwmWysygv9'),
  ('SVIN Annual Meeting', 'Conference', null::date, null::time, null, 'Virtual', 'Society of Vascular and Interventional Neurology Annual Meeting. MEDX is coordinating participation and abstract submissions for students.', 'published', 'https://forms.gle/yJzGnk4DwmWysygv9'),
  ('MEDX × NSRI Complete Research Week', 'Workshop', '2026-07-20'::date, '22:00'::time, 'PKT', 'Virtual', '6-day intensive online research program in collaboration with NSRI BUMHS-LC. Covering Cross-Sectional Studies, SPSS Data Analysis, Manuscript Writing, and more. Mentors: Dr. Rida Noor & Abdul Moiz.', 'published', 'https://docs.google.com/forms/d/e/1FAIpQLSfCvfQnpyB96EkLhmeIVv8JZl3VOeSBSQITBiBNa3R5FydsBQ/viewform'),
  ('LTE Free Workshop - Letter to the Editor', 'Workshop', '2026-07-18'::date, '22:00'::time, 'PKT', 'Virtual', 'Free session on Letter to the Editor writing - what it is, structure, journal selection, and submission process. Speaker: Imad Khan.', 'published', null),
  ('SRMA Free Lecture Series', 'Workshop', null::date, '20:00'::time, 'PKT', 'Virtual', 'Free introductory lectures on systematic review and meta-analysis methodology. Open to all. Sessions are held regularly.', 'published', 'https://forms.gle/yJzGnk4DwmWysygv9'),
  ('MEDX Website Official Launch', 'Community', null::date, null::time, null, 'Virtual', 'Official MEDX website launch - a live session with the global team and a guest speaker.', 'published', 'https://forms.gle/yJzGnk4DwmWysygv9'),
  ('Campus Ambassador Recruitment Drive', 'Recruitment', null::date, null::time, null, 'Virtual', 'MEDX is recruiting Campus Ambassadors across institutions worldwide.', 'published', 'https://forms.gle/yJzGnk4DwmWysygv9')
) as seed(title, category, date, time, timezone, location_type, description, status, registration_url)
where not exists (select 1 from public.events);

-- ---------------------------------------------------------------------------
-- 8. Media backfills
-- ---------------------------------------------------------------------------

insert into public.media (file_name, bucket_path, mime_type, size_bytes, used_in)
select split_part(name, '/', 2), name,
  coalesce(metadata->>'mimetype', 'application/octet-stream'),
  coalesce((metadata->>'size')::bigint, 0), '[]'::jsonb
from storage.objects
where bucket_id = 'media' and name like 'site/%'
on conflict (bucket_path) do nothing;

update public.achievements
set image_path = (
  select bucket_path from public.media
  where file_name = 'medx-systematic-review-and-meta-analysis-project.webp'
  limit 1
)
where title = '6-Lecture SRMA Workshop Series'
  and image_path is null;

update public.achievements
set image_path = (
  select bucket_path from public.media
  where file_name = 'collaboration-nsri-and-medx-LTE-recap-and-question-and-answer.webp'
  limit 1
)
where title = 'LTE Recap & Interactive Q&A'
  and image_path is null;

update public.achievements
set image_path = (
  select bucket_path from public.media
  where file_name = 'medx-invites-you-to-join-free-workshop-basics-of-research-and-why-srma-mentorship-is-essential.webp'
  limit 1
)
where title = 'Basics of Research & Publication'
  and image_path is null;

update public.achievements
set image_path = (
  select bucket_path from public.media
  where file_name = 'nsri-and-medx-announces-complete-research-week.webp'
  limit 1
)
where title = 'Collaborative Research Week × NSRI BUMHS-LC'
  and image_path is null;

update public.event_banners b
set image_path = (
  select bucket_path from public.media m
  where m.file_name = case b.label
    when 'Global Main Officer Recruitment' then 'medx-calls-main-officers.webp'
    when 'City Representative Slots Open' then 'medx-announces-slots-for-city-representative.webp'
    when 'Campus Ambassador Recruitment' then 'medx-join-us-as-campus-ambassadors.webp'
    when 'MEDX Minds - Speakers & Storytellers' then 'medx-minds-join-us-as-speakers-or-story-tellers.webp'
  end
  limit 1
)
where b.image_path is null;

update public.events
set image_path = (
  select bucket_path from public.media
  where file_name = 'nsri-and-medx-announces-complete-research-week.webp'
  limit 1
)
where title = 'MEDX × NSRI Complete Research Week'
  and image_path is null;

update public.events
set image_path = (
  select bucket_path from public.media
  where file_name = 'collaboration-nsri-and-medx-LTE-recap-and-question-and-answer.webp'
  limit 1
)
where title = 'LTE Free Workshop - Letter to the Editor'
  and image_path is null;

update public.events
set image_path = (
  select bucket_path from public.media
  where file_name = 'medx-join-us-as-campus-ambassadors.webp'
  limit 1
)
where title = 'Campus Ambassador Recruitment Drive'
  and image_path is null;

-- ---------------------------------------------------------------------------
-- 9. Officer hierarchy backfills
-- ---------------------------------------------------------------------------

update public.global_officers
set level_key = case
  when sort_order < 100 then 'executive'
  when sort_order < 200 then 'director'
  when sort_order < 300 then 'head'
  when sort_order < 400 then 'mentor'
  else 'mentor'
end
where level_key is null
  and scope = 'global';

update public.global_officers
set person_key = case
  when lower(trim(name)) = 'open position'
    then regexp_replace(lower(name), '[^a-z0-9]+', '', 'g')
      || '|'
      || regexp_replace(lower(coalesce(role, '')), '[^a-z0-9]+', '', 'g')
  else regexp_replace(lower(coalesce(name, '')), '[^a-z0-9]+', '', 'g')
end
where person_key is null
  and name is not null;

-- ---------------------------------------------------------------------------
-- 10. Reload PostgREST's schema cache
-- ---------------------------------------------------------------------------

notify pgrst, 'reload schema';

-- ---------------------------------------------------------------------------
-- 11. Admin account setup (run manually after creating the Auth user)
-- ---------------------------------------------------------------------------
--
-- Super admin:
-- insert into public.profiles (id, email, full_name, role, department_slug)
-- select id, email, coalesce(raw_user_meta_data->>'full_name', email), 'super_admin', null
-- from auth.users
-- where email = 'owner@example.com'
-- on conflict (id) do update
--   set role = excluded.role,
--       department_slug = excluded.department_slug;
--
-- Department admin (research, education, medical-exchange, technology,
-- partnerships, medx-minds):
-- update public.profiles
-- set role = 'department_admin', department_slug = 'research'
-- where email = 'research-head@example.com';
