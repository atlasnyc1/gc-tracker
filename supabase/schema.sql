-- Milestone 2 setup script.
-- Paste this whole file into Supabase's SQL Editor and click "Run" once.

-- Every GC's account (a "tenant"). One row per company.
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Links a login (auth.users) to exactly one company.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;
alter table public.profiles enable row level security;

create policy "Users can see their own company"
  on public.companies for select
  using (id in (select company_id from public.profiles where id = auth.uid()));

create policy "Users can see their own profile"
  on public.profiles for select
  using (id = auth.uid());

-- Whenever someone signs up, automatically give them their own
-- private company. This is what makes multi-tenancy automatic.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_company_id uuid;
begin
  insert into public.companies (name)
  values (coalesce(nullif(split_part(new.email, '@', 1), ''), 'My Company'))
  returning id into new_company_id;

  insert into public.profiles (id, company_id, role)
  values (new.id, new_company_id, 'owner');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
