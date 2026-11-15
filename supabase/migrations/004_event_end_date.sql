-- Optional end date for multi-day events, used to show ongoing progress.
-- Run this in the Supabase SQL editor after 003_department_teams.sql.

alter table public.events
  add column if not exists end_date date;

notify pgrst, 'reload schema';
