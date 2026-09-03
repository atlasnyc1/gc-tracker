-- Milestone 6 setup script.
-- Paste this into a new snippet in Supabase's SQL Editor and click "Run" once.

create table if not exists public.budget_lines (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  cost_code text not null,
  budgeted numeric not null default 0,
  actual numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.budget_lines enable row level security;

create policy "Users can see budget lines for their own company's projects"
  on public.budget_lines for select
  using (
    project_id in (
      select p.id from public.projects p
      join public.profiles pr on pr.company_id = p.company_id
      where pr.id = auth.uid()
    )
  );

create policy "Users can add budget lines to their own company's projects"
  on public.budget_lines for insert
  with check (
    project_id in (
      select p.id from public.projects p
      join public.profiles pr on pr.company_id = p.company_id
      where pr.id = auth.uid()
    )
  );

create policy "Users can update budget lines on their own company's projects"
  on public.budget_lines for update
  using (
    project_id in (
      select p.id from public.projects p
      join public.profiles pr on pr.company_id = p.company_id
      where pr.id = auth.uid()
    )
  );
