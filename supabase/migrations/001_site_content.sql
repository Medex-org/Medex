-- MEDX site content migration.
-- Run this in the Supabase SQL editor after the base admin schema exists.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public media files are readable" on storage.objects;
create policy "Public media files are readable"
on storage.objects for select
using (bucket_id = 'media');

drop policy if exists "Authenticated admins can upload media" on storage.objects;
create policy "Authenticated admins can upload media"
on storage.objects for insert to authenticated
with check (bucket_id = 'media');

drop policy if exists "Authenticated admins can delete media" on storage.objects;
create policy "Authenticated admins can delete media"
on storage.objects for delete to authenticated
using (bucket_id = 'media');

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
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.webinars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cadence text,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_banners (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text,
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
