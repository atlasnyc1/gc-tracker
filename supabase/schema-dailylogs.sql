-- Milestone 4 setup script.
-- Paste this into a new snippet in Supabase's SQL Editor and click "Run" once.
-- Separate from the earlier scripts — run this one in addition to them.

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  notes text,
  weather text,
  crew_count integer,
  photo_url text,
  created_at timestamptz not null default now()
);

alter table public.daily_logs enable row level security;

create policy "Users can see daily logs for their own company's projects"
  on public.daily_logs for select
  using (
    project_id in (
      select p.id from public.projects p
      join public.profiles pr on pr.company_id = p.company_id
      where pr.id = auth.uid()
    )
  );

create policy "Users can add daily logs to their own company's projects"
  on public.daily_logs for insert
  with check (
    project_id in (
      select p.id from public.projects p
      join public.profiles pr on pr.company_id = p.company_id
      where pr.id = auth.uid()
    )
  );

-- A storage "bucket" is just a place to keep uploaded photos.
-- This creates one named "daily-log-photos" and made public.
insert into storage.buckets (id, name, public)
values ('daily-log-photos', 'daily-log-photos', true)
on conflict (id) do nothing;

create policy "Anyone can view daily log photos"
  on storage.objects for select
  using (bucket_id = 'daily-log-photos');

create policy "Authenticated users can upload daily log photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'daily-log-photos');
