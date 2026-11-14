-- Department team hierarchy + scoped admin access.
-- Run this in the Supabase SQL editor after 002_admin_content_fixes.sql.

alter table public.global_officers
  add column if not exists scope text not null default 'global',
  add column if not exists department_slug text,
  add column if not exists level_key text,
  add column if not exists person_key text,
  add column if not exists supervisor_key text,
  add column if not exists is_active boolean not null default true;

alter table public.profiles
  add column if not exists department_slug text;

-- Backfill existing global rows so the current team page keeps working.
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
      || regexp_replace(lower(role), '[^a-z0-9]+', '', 'g')
  else regexp_replace(lower(name), '[^a-z0-9]+', '', 'g')
end
where person_key is null;

create index if not exists global_officers_scope_department_level_idx
  on public.global_officers (scope, department_slug, level_key, sort_order);

-- Treat the legacy 'admin' role as a super admin.
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

drop policy if exists "Authenticated users can manage global officers" on public.global_officers;
drop policy if exists "Admins can manage global officers" on public.global_officers;
create policy "Admins can manage global officers"
on public.global_officers for all to authenticated
using (public.can_manage_team_row(scope, department_slug))
with check (public.can_manage_team_row(scope, department_slug));

drop policy if exists "Super admins can read all profiles" on public.profiles;
create policy "Super admins can read all profiles"
on public.profiles for select to authenticated
using (public.is_super_admin());

drop policy if exists "Super admins can update profiles" on public.profiles;
create policy "Super admins can update profiles"
on public.profiles for update to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists "Authenticated users can manage media records" on public.media;
create policy "Admins can manage media records"
on public.media for all to authenticated
using (public.can_manage_content() or public.current_profile_role() = 'department_admin')
with check (public.can_manage_content() or public.current_profile_role() = 'department_admin');

drop policy if exists "Authenticated users can manage courses" on public.courses;
create policy "Super admins can manage courses"
on public.courses for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Authenticated users can manage news" on public.news_updates;
create policy "Super admins can manage news"
on public.news_updates for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Authenticated users can manage events" on public.events;
create policy "Super admins can manage events"
on public.events for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Authenticated users can manage achievements" on public.achievements;
create policy "Super admins can manage achievements"
on public.achievements for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Authenticated users can manage news highlights" on public.news_highlights;
create policy "Super admins can manage news highlights"
on public.news_highlights for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Authenticated users can manage webinars" on public.webinars;
create policy "Super admins can manage webinars"
on public.webinars for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Authenticated users can manage event banners" on public.event_banners;
create policy "Super admins can manage event banners"
on public.event_banners for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Authenticated users can manage partners" on public.partners;
create policy "Super admins can manage partners"
on public.partners for all to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

drop policy if exists "Authenticated admins can upload media" on storage.objects;
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
create policy "Admins can delete media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'media'
  and (public.can_manage_content() or public.current_profile_role() = 'department_admin')
);

notify pgrst, 'reload schema';

-- Admin accounts are created manually in two steps.
-- 1. Create the Supabase Auth user (Dashboard > Authentication > Users).
-- 2. Create its profile row, then assign the role:
--
-- insert into public.profiles (id, email, full_name, role, department_slug)
-- select id, email, coalesce(raw_user_meta_data->>'full_name', email), 'super_admin', null
-- from auth.users
-- where email = 'owner@example.com'
-- on conflict (id) do update
--   set role = excluded.role,
--       department_slug = excluded.department_slug;
--
-- Department admins also set department_slug (research, education,
-- medical-exchange, technology, partnerships, medx-minds):
--
-- update public.profiles
-- set role = 'department_admin', department_slug = 'research'
-- where email = 'research-head@example.com';
