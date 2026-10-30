-- MEDX site content migration.
-- Run this in the Supabase SQL editor after the base admin schema exists.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public media files are readable" on storage.objects;
create policy "Public media files are readable"
on storage.objects for select
using (bucket_id = 'media');

alter table public.media enable row level security;
create unique index if not exists media_bucket_path_key on public.media(bucket_path);
drop policy if exists "Authenticated users can manage media records" on public.media;
create policy "Authenticated users can manage media records"
on public.media for all to authenticated
using (true)
with check (true);

insert into public.media (file_name, bucket_path, mime_type, size_bytes, used_in)
select split_part(name, '/', 2), name,
  coalesce(metadata->>'mimetype', 'application/octet-stream'),
  coalesce((metadata->>'size')::bigint, 0), '[]'::jsonb
from storage.objects
where bucket_id = 'media' and name like 'site/%'
on conflict (bucket_path) do nothing;

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

alter table public.global_officers enable row level security;
drop policy if exists "Public global officers are readable" on public.global_officers;
create policy "Public global officers are readable"
on public.global_officers for select
using (true);
drop policy if exists "Authenticated users can manage global officers" on public.global_officers;
create policy "Authenticated users can manage global officers"
on public.global_officers for all to authenticated
using (true)
with check (true);

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

-- Reconnect media uploaded during the original migration. These updates are
-- safe to rerun and preserve the original image locations in the admin view.
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
