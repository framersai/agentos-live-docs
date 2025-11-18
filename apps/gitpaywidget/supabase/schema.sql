create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  owner_id uuid not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.provider_keys (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  provider text not null,
  key text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (project_id, provider)
);

create table if not exists public.project_settings (
  project_id uuid primary key references public.projects(id) on delete cascade,
  accent_hex text default '#8b5cf6',
  cta_label text default 'Get started',
  custom_css text,
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;
alter table public.provider_keys enable row level security;

create policy "projects read by owner" on public.projects
  using (auth.uid() = owner_id);

create policy "provider keys read by owner" on public.provider_keys
  using (
    provider_keys.project_id in (select id from public.projects where owner_id = auth.uid())
  );

alter table public.project_settings enable row level security;

create policy "project settings read by owner" on public.project_settings
  using (
    project_settings.project_id in (select id from public.projects where owner_id = auth.uid())
  );

