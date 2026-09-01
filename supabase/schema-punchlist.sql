-- Milestone 5 setup script.
-- Paste this into a new snippet in Supabase's SQL Editor and click "Run" once.

create table if not exists public.punch_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  description text not null,
  status text not null default 'open',
  photo_url text,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

alter table public.punch_items enable row level security;

create policy "Users can see punch items for their own company's projects"
  on public.punch_items for select
  using (
    project_id in (
      select p.id from public.projects p
      join public.profiles pr on pr.company_id = p.company_id
      where pr.id = auth.uid()
    )
  );

create policy "Users can add punch items to their own company's projects"
  on public.punch_items for insert
  with check (
    project_id in (
      select p.id from public.projects p
      join public.profiles pr on pr.company_id = p.company_id
      where pr.id = auth.uid()
    )
  );

create policy "Users can update punch items on their own company's projects"
  on public.punch_items for update
  using (
    project_id in (
      select p.id from public.projects p
      join public.profiles pr on pr.company_id = p.company_id
      where pr.id = auth.uid()
    )
  );

-- Reuses the same photo storage bucket created in Milestone 4.
insert into storage.buckets (id, name, public)
values ('daily-log-photos', 'daily-log-photos', true)
on conflict (id) do nothing;
