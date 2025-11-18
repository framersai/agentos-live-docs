'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage GitPayWidget projects, provider keys, analytics, and widget theme settings.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard' },
};

interface ProviderKeySummary {
  provider: string;
  updatedAt: string;
}

interface Project {
  slug: string;
  name: string;
}

interface ProjectAnalytics {
  mrr: number;
  checkoutsToday: number;
  conversionRate: number;
  updatedAt: string;
}

interface ProjectSettings {
  accent_hex?: string;
  cta_label?: string;
  custom_css?: string;
}

/**
 * Dashboard controlling provider credentials & analytics for a selected project.
 */
export default function Dashboard() {
  const supabase = createClientComponentClient();
  const [keys, setKeys] = useState<ProviderKeySummary[]>([]);
  const [secret, setSecret] = useState('');
  const [provider, setProvider] = useState('stripe');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProjectSettings>({});
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [savingSecret, setSavingSecret] = useState(false);

  const refreshKeys = async (slug: string) => {
    setLoadingKeys(true);
    const res = await fetch(`/api/projects/${encodeURIComponent(slug)}/keys`);
    const json = await res.json();
    setKeys(json.keys ?? []);
    setLoadingKeys(false);
  };

  const refreshAnalytics = async (slug: string) => {
    setLoadingAnalytics(true);
    const res = await fetch(`/api/projects/${encodeURIComponent(slug)}/analytics`);
    if (!res.ok) {
      setAnalytics(null);
    } else {
      const json = await res.json();
      setAnalytics(json);
    }
    setLoadingAnalytics(false);
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    const res = await fetch('/api/projects');
    if (!res.ok) {
      setLoadingProjects(false);
      return;
    }
    const json = await res.json();
    const list: Project[] = json.projects ?? [];
    setProjects(list);
    setLoadingProjects(false);
    if (list.length === 0) return;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('gpw:lastProject') : null;
    const slug = stored && list.find(p => p.slug === stored) ? stored : list[0].slug;
    setSelectedProject(slug);
  };

  useEffect(() => {
    void loadProjects();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    void refreshKeys(selectedProject);
    void refreshAnalytics(selectedProject);
    fetch(`/api/projects/${encodeURIComponent(selectedProject)}/settings`)
      .then(res => res.json())
      .then(json => setSettings(json ?? {}));
    localStorage.setItem('gpw:lastProject', selectedProject);
  }, [selectedProject]);

  const submit = async () => {
    if (!selectedProject) return;
    setSavingSecret(true);
    await fetch(`/api/projects/${encodeURIComponent(selectedProject)}/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, secret }),
    });
    setSecret('');
    setSavingSecret(false);
    await refreshKeys(selectedProject);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    location.href = '/login';
  };

  const saveSettings = async () => {
    if (!selectedProject) return;
    setSettingsSaving(true);
    await fetch(`/api/projects/${encodeURIComponent(selectedProject)}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSettingsSaving(false);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 pb-24 pt-12 space-y-8 sm:px-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-ink-200/60 bg-white/90 p-6 shadow-gpw-card backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-500">GitPayWidget Studio</p>
            <h1 className="font-display text-4xl text-transparent bg-clip-text bg-gpw-gradient motion-safe:animate-fade-in">
              Dashboard (alpha)
            </h1>
            <p className="text-ink-600 dark:text-ink-300">
              Manage projects, secrets, and paywall analytics.
            </p>
          </div>
          <a
            href="/projects"
            className="self-start rounded-full border border-gpw-primary/30 px-4 py-2 text-sm font-semibold text-gpw-primary transition hover:-translate-y-0.5"
          >
            View projects →
          </a>
        </div>
        <div className="flex flex-col gap-3 text-sm text-ink-500 xs:flex-row xs:items-center xs:justify-between">
          <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-600">
            {email ?? 'Loading account…'}
          </span>
          <button
            onClick={signOut}
            className="text-gpw-primary underline-offset-4 transition hover:text-gpw-tertiary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gpw-primary"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-ink-200/70 p-6 space-y-4 shadow-gpw-card bg-white/90 backdrop-blur">
        <h2 className="text-xl font-semibold">Project</h2>
        <select
          value={selectedProject ?? ''}
          onChange={e => setSelectedProject(e.target.value)}
          className="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-gpw-primary/40"
          disabled={projects.length === 0 || loadingProjects}
          aria-busy={loadingProjects}
        >
          {loadingProjects ? <option>Loading projects…</option> : null}
          {projects.map(project => (
            <option key={project.slug} value={project.slug}>
              {project.name} ({project.slug})
            </option>
          ))}
        </select>
        <p className="text-sm text-ink-500">Secrets below apply to the selected project.</p>
      </div>

      {loadingAnalytics ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : analytics ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-ink-200/60 bg-white/80 p-4 text-left shadow-sm">
            <p className="text-sm text-ink-500">Monthly Recurring Revenue</p>
            <p className="text-3xl font-semibold">${(analytics.mrr / 100).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-ink-200/60 bg-white/80 p-4 text-left shadow-sm">
            <p className="text-sm text-ink-500">Checkouts today</p>
            <p className="text-3xl font-semibold">{analytics.checkoutsToday}</p>
          </div>
          <div className="rounded-2xl border border-ink-200/60 bg-white/80 p-4 text-left shadow-sm">
            <p className="text-sm text-ink-500">Conversion rate</p>
            <p className="text-3xl font-semibold">{(analytics.conversionRate * 100).toFixed(1)}%</p>
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-ink-200/70 bg-white/90 p-6 shadow-gpw-card backdrop-blur space-y-4">
        <h2 className="text-xl font-semibold">Provider credentials</h2>
        <p className="text-sm text-ink-500">
          Paste Stripe/Lemon secrets (JSON). We encrypt them with AES-256-GCM before storage.
        </p>
        <label className="flex flex-col text-left text-sm font-semibold gap-1">
          Provider
          <select
            value={provider}
            onChange={e => setProvider(e.target.value)}
            className="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-gpw-primary/40"
          >
            <option value="stripe">Stripe</option>
            <option value="lemonsqueezy">Lemon Squeezy</option>
          </select>
        </label>
        <label className="flex flex-col text-left text-sm font-semibold gap-1">
          Secret JSON
          <textarea
            value={secret}
            onChange={e => setSecret(e.target.value)}
            rows={4}
            className="rounded-xl border px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-gpw-primary/40"
            placeholder='{"secretKey":"sk_live_...","priceId":"price_123"}'
          />
        </label>
        <button
          onClick={submit}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gpw-primary px-5 py-2 font-semibold text-white shadow-lg shadow-gpw-primary/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gpw-primary"
          disabled={!selectedProject || savingSecret}
        >
          {savingSecret ? (
            <>
              <Spinner size={18} />
              Saving
            </>
          ) : (
            'Save secret'
          )}
        </button>
      </div>

      <div className="rounded-3xl border border-ink-200/70 p-6 space-y-4 shadow-gpw-card bg-white/90 backdrop-blur">
        <h2 className="text-xl font-semibold">Widget Theme</h2>
        <label className="flex flex-col gap-1 text-sm font-semibold text-left">
          Accent color (hex)
          <input
            value={settings.accent_hex ?? ''}
            onChange={e => setSettings(prev => ({ ...prev, accent_hex: e.target.value }))}
            className="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-gpw-primary/40"
            placeholder="#8b5cf6"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-left">
          CTA label
          <input
            value={settings.cta_label ?? ''}
            onChange={e => setSettings(prev => ({ ...prev, cta_label: e.target.value }))}
            className="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-gpw-primary/40"
            placeholder="Get started"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-left">
          Custom CSS (optional)
          <textarea
            value={settings.custom_css ?? ''}
            onChange={e => setSettings(prev => ({ ...prev, custom_css: e.target.value }))}
            rows={3}
            className="rounded-xl border px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-gpw-primary/40"
          />
        </label>
        <button
          onClick={saveSettings}
          disabled={settingsSaving}
          className="inline-flex items-center gap-2 rounded-full bg-gpw-primary px-5 py-2 font-semibold text-white shadow-lg shadow-gpw-primary/30"
        >
          {settingsSaving ? (
            <>
              <Spinner size={18} />
              Saving…
            </>
          ) : (
            'Save theme'
          )}
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Saved keys</h2>
        {loadingKeys ? (
          <div className="space-y-2">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : (
          <ul className="space-y-2">
            {keys.map(key => (
              <li
                key={key.provider}
                className="flex items-center justify-between rounded-2xl border border-ink-200/60 bg-white/80 px-4 py-3 shadow-sm"
              >
                <span className="font-semibold capitalize">{key.provider}</span>
                <span className="text-sm text-ink-500">
                  {new Date(key.updatedAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
