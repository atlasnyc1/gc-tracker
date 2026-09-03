-- Milestone 8 setup script.
-- Paste this into a new snippet in Supabase's SQL Editor and click "Run" once.

alter table public.companies
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text not null default 'trialing';
