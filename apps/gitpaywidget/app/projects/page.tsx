'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Create, edit, and delete GitPayWidget projects linked to your GitHub Pages and sites.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/projects' },
};

interface Project {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

/**
 * Project management page that lists all sites owned by the signed-in user.
 */
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const res = await fetch('/api/projects');
    if (!res.ok) {
      setError('Failed to load projects');
      setLoading(false);
      return;
    }
    const json = await res.json();
    setProjects(json.projects ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const createProject = async () => {
    setError(null);
    setCreating(true);
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? 'Failed to create project');
      setCreating(false);
      return;
    }
    setName('');
    setSlug('');
    await refresh();
    setCreating(false);
  };

  const deleteProject = async (slug: string) => {
    setBusySlug(slug);
    const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? 'Failed to delete project');
    } else {
      await refresh();
    }
    setBusySlug(null);
  };

  const startEdit = (project: Project) => {
    setEditingSlug(project.slug);
    setEditName(project.name);
    setEditSlug(project.slug);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setEditName('');
    setEditSlug('');
  };

  const saveEdit = async () => {
    if (!editingSlug) return;
    const res = await fetch(`/api/projects/${encodeURIComponent(editingSlug)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, slug: editSlug }),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? 'Failed to update project');
      return;
    }
    await refresh();
    cancelEdit();
  };

  return (
    <section className="mx-auto max-w-4xl px-4 pb-24 pt-12 space-y-10 sm:px-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-ink-200/60 bg-white/90 p-6 shadow-gpw-card backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-500">Projects</p>
          <h1 className="font-display text-4xl text-transparent bg-clip-text bg-gpw-gradient">
            Sites & repos
          </h1>
          <p className="text-sm text-ink-500">
            Each project represents one deployment using the widget SDK.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="self-start rounded-full border border-gpw-primary/40 px-4 py-2 text-sm font-semibold text-gpw-primary transition hover:-translate-y-0.5"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="rounded-3xl border border-ink-200/70 bg-white/90 p-6 shadow-gpw-card backdrop-blur space-y-4">
        <h2 className="text-xl font-semibold">Create new project</h2>
        <label className="flex flex-col gap-1 text-sm font-semibold text-left">
          Name
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-gpw-primary/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-left">
          Slug
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-gpw-primary/40"
            placeholder="org/site"
          />
        </label>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          onClick={createProject}
          disabled={creating}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gpw-primary px-5 py-2 font-semibold text-white shadow-lg shadow-gpw-primary/30"
        >
          {creating ? (
            <>
              <Spinner size={18} />
              Creating…
            </>
          ) : (
            'Create project'
          )}
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your projects</h2>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200/70 bg-white/80 px-4 py-10 text-center text-sm text-ink-500">
            No projects yet. Create one above to get started.
          </div>
        ) : (
          <ul className="space-y-2">
            {projects.map(project => {
              const isEditing = editingSlug === project.slug;
              return (
                <li
                  key={project.id}
                  className="flex flex-col gap-3 rounded-2xl border border-ink-200/60 bg-white/90 px-4 py-3 shadow-sm"
                >
                  {isEditing ? (
                    <>
                      <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                        <label className="flex flex-col text-sm font-semibold flex-1">
                          Name
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-gpw-primary/40"
                          />
                        </label>
                        <label className="flex flex-col text-sm font-semibold flex-1">
                          Slug
                          <input
                            value={editSlug}
                            onChange={e => setEditSlug(e.target.value)}
                            className="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-gpw-primary/40"
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={saveEdit}
                          className="rounded-full bg-gpw-primary px-4 py-2 text-white font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-full border border-ink-200 px-4 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold">{project.name}</p>
                        <p className="text-sm text-ink-500">{project.slug}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-400">
                        <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                        <button
                          onClick={() => startEdit(project)}
                          className="rounded-full border border-ink-200 px-3 py-1 text-ink-600 hover:bg-ink-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProject(project.slug)}
                          disabled={busySlug === project.slug}
                          className="rounded-full border border-red-200 px-3 py-1 text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          {busySlug === project.slug ? (
                            <span className="inline-flex items-center gap-1">
                              <Spinner size={14} /> Removing…
                            </span>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
