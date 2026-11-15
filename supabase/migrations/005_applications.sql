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

alter table public.applications enable row level security;

drop policy if exists "Public can submit applications" on public.applications;
create policy "Public can submit applications"
  on public.applications
  for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "Admins can read applications" on public.applications;
create policy "Admins can read applications"
  on public.applications
  for select
  to authenticated
  using (public.can_manage_content());

drop policy if exists "Admins can update applications" on public.applications;
create policy "Admins can update applications"
  on public.applications
  for update
  to authenticated
  using (public.can_manage_content())
  with check (public.can_manage_content());

drop policy if exists "Admins can delete applications" on public.applications;
create policy "Admins can delete applications"
  on public.applications
  for delete
  to authenticated
  using (public.can_manage_content());

create index if not exists applications_status_created_idx
  on public.applications (status, created_at desc);

notify pgrst, 'reload schema';
