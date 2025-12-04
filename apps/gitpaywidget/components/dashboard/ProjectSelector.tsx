'use client';

import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  slug: string;
  name: string;
  created_at: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: string | null;
  onSelect: (slug: string) => void;
  loading: boolean;
}

export function ProjectSelector({
  projects,
  selectedProject,
  onSelect,
  loading,
}: ProjectSelectorProps) {
  if (loading) {
    return (
      <div className="gpw-card p-4 flex items-center justify-between">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    );
  }

  return (
    <div className="gpw-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
      <div className="flex items-center gap-4">
        <label htmlFor="project-select" className="text-sm font-medium text-gpw-text-muted">
          Project:
        </label>
        <select
          id="project-select"
          value={selectedProject ?? ''}
          onChange={(e) => onSelect(e.target.value)}
          disabled={projects.length === 0}
          className="gpw-select max-w-xs"
          aria-label="Select project"
        >
          {projects.length === 0 ? (
            <option value="">No projects</option>
          ) : (
            projects.map((project) => (
              <option key={project.slug} value={project.slug}>
                {project.name} ({project.slug})
              </option>
            ))
          )}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/projects"
          className="gpw-btn-ghost text-sm"
        >
          Manage projects
        </Link>
        <Link
          href="/projects?new=true"
          className="gpw-btn-primary text-sm px-4 py-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Project
        </Link>
      </div>
    </div>
  );
}





