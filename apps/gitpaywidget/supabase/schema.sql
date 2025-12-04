-- ═══════════════════════════════════════════════════════════════════════════
-- GitPayWidget Database Schema
-- ═══════════════════════════════════════════════════════════════════════════

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  owner_id uuid not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Provider keys (encrypted credentials)
create table if not exists public.provider_keys (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  provider text not null,
  key text not null, -- AES-256-GCM encrypted
  metadata jsonb default '{}'::jsonb,
  is_test_mode boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (project_id, provider)
);

-- Project theme settings
create table if not exists public.project_settings (
  project_id uuid primary key references public.projects(id) on delete cascade,
  accent_hex text default '#8b5cf6',
  cta_label text default 'Get started',
  custom_css text,
  updated_at timestamptz default now()
);

-- Webhook events log for analytics and auditing
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  provider text not null,
  event_type text not null,
  session_id text,
  payload jsonb,
  processed_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Create indexes for faster queries
create index if not exists idx_webhook_events_project on public.webhook_events(project_id);
create index if not exists idx_webhook_events_type on public.webhook_events(event_type);
create index if not exists idx_webhook_events_created on public.webhook_events(created_at);
create index if not exists idx_projects_owner on public.projects(owner_id);
create index if not exists idx_projects_slug on public.projects(slug);

-- ═══════════════════════════════════════════════════════════════════════════
-- Row Level Security Policies
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.projects enable row level security;
alter table public.provider_keys enable row level security;
alter table public.project_settings enable row level security;
alter table public.webhook_events enable row level security;

-- Projects: owners can read/write their own projects
create policy "projects read by owner" on public.projects
  for select using (auth.uid() = owner_id);

create policy "projects insert by owner" on public.projects
  for insert with check (auth.uid() = owner_id);

create policy "projects update by owner" on public.projects
  for update using (auth.uid() = owner_id);

create policy "projects delete by owner" on public.projects
  for delete using (auth.uid() = owner_id);

-- Provider keys: access via project ownership
create policy "provider keys read by owner" on public.provider_keys
  for select using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy "provider keys insert by owner" on public.provider_keys
  for insert with check (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy "provider keys update by owner" on public.provider_keys
  for update using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy "provider keys delete by owner" on public.provider_keys
  for delete using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

-- Project settings: access via project ownership
create policy "project settings read by owner" on public.project_settings
  for select using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy "project settings insert by owner" on public.project_settings
  for insert with check (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy "project settings update by owner" on public.project_settings
  for update using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

-- Webhook events: read by project owner
create policy "webhook events read by owner" on public.webhook_events
  for select using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- Functions and Triggers
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach trigger to projects table
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at();

-- Attach trigger to provider_keys table
drop trigger if exists provider_keys_updated_at on public.provider_keys;
create trigger provider_keys_updated_at
  before update on public.provider_keys
  for each row execute function public.update_updated_at();

-- Attach trigger to project_settings table
drop trigger if exists project_settings_updated_at on public.project_settings;
create trigger project_settings_updated_at
  before update on public.project_settings
  for each row execute function public.update_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- Analytics Views (for dashboard)
-- ═══════════════════════════════════════════════════════════════════════════

-- Daily checkout counts per project
create or replace view public.daily_checkouts as
select
  project_id,
  date_trunc('day', created_at) as day,
  count(*) as checkout_count
from public.webhook_events
where event_type = 'checkout.completed'
group by project_id, date_trunc('day', created_at);

-- Monthly revenue estimates (simplified)
create or replace view public.monthly_revenue as
select
  project_id,
  date_trunc('month', created_at) as month,
  count(*) as successful_checkouts,
  -- Estimate revenue based on checkout count (placeholder logic)
  count(*) * 1999 as estimated_revenue_cents
from public.webhook_events
where event_type = 'checkout.completed'
group by project_id, date_trunc('month', created_at);
