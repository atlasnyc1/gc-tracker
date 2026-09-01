-- Milestone 3 setup script.
-- Paste this into Supabase's SQL Editor (a new query) and click "Run" once.
-- This is separate from the first script — run this one in addition to it.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  address text,
  contract_value numeric,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Users can see their own company's projects"
  on public.projects for select
  using (company_id in (select company_id from public.profiles where id = auth.uid()));

create policy "Users can add projects to their own company"
  on public.projects for insert
  with check (company_id in (select company_id from public.profiles where id = auth.uid()));
