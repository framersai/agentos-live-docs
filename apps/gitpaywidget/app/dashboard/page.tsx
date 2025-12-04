'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { 
  OnboardingWizard, 
  AnalyticsCards, 
  RevenueChart, 
  ProjectSelector, 
  ProviderKeysForm, 
  ThemeSettings, 
  QuickActions,
  CryptoComingSoon,
  TestModeToggle,
} from '@/components/dashboard';

interface Project {
  slug: string;
  name: string;
  created_at: string;
}

interface ProjectAnalytics {
  mrr: number;
  checkoutsToday: number;
  checkoutsThisMonth: number;
  conversionRate: number;
  activeSubscriptions: number;
  churnRate: number;
  updatedAt: string;
  revenueHistory: Array<{ date: string; amount: number }>;
}

interface ProjectSettings {
  accent_hex?: string;
  cta_label?: string;
  custom_css?: string;
}

interface ProviderKey {
  provider: string;
  updatedAt: string;
  isTestMode?: boolean;
}

export default function Dashboard() {
  const supabase = createClientComponentClient();
  
  // State
  const [email, setEmail] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [settings, setSettings] = useState<ProjectSettings>({});
  const [keys, setKeys] = useState<ProviderKey[]>([]);
  
  // Loading states
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setLoadingUser(false);
      
      // Check if first-time user
      const onboardingDone = localStorage.getItem('gpw:onboarding-complete');
      if (!onboardingDone) {
        setShowOnboarding(true);
      }
    };
    fetchUser();
  }, [supabase.auth]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const json = await res.json();
        const list: Project[] = json.projects ?? [];
        setProjects(list);
        
        if (list.length > 0) {
          const stored = localStorage.getItem('gpw:lastProject');
          const slug = stored && list.find(p => p.slug === stored) ? stored : list[0].slug;
          setSelectedProject(slug);
        }
      }
      setLoadingProjects(false);
    };
    fetchProjects();
  }, []);

  // Fetch project data when selected project changes
  useEffect(() => {
    if (!selectedProject) return;
    
    localStorage.setItem('gpw:lastProject', selectedProject);
    
    const fetchProjectData = async () => {
      setLoadingAnalytics(true);
      
      // Fetch analytics, settings, and keys in parallel
      const [analyticsRes, settingsRes, keysRes] = await Promise.all([
        fetch(`/api/projects/${encodeURIComponent(selectedProject)}/analytics`),
        fetch(`/api/projects/${encodeURIComponent(selectedProject)}/settings`),
        fetch(`/api/projects/${encodeURIComponent(selectedProject)}/keys`),
      ]);
      
      if (analyticsRes.ok) {
        const json = await analyticsRes.json();
        setAnalytics(json);
      }
      
      if (settingsRes.ok) {
        const json = await settingsRes.json();
        setSettings(json ?? {});
      }
      
      if (keysRes.ok) {
        const json = await keysRes.json();
        setKeys(json.keys ?? []);
      }
      
      setLoadingAnalytics(false);
    };
    
    fetchProjectData();
  }, [selectedProject]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setOnboardingComplete(true);
    localStorage.setItem('gpw:onboarding-complete', 'true');
  };

  // Show onboarding wizard for new users
  if (showOnboarding && !loadingProjects) {
    return (
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        hasProjects={projects.length > 0}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gpw-bg-base pt-20">
      <div className="gpw-container py-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gpw-text-muted mb-1">
              GitPayWidget Studio
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="gpw-text-gradient">Dashboard</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {loadingUser ? (
              <Skeleton className="h-9 w-32 rounded-full" />
            ) : (
              <>
                <span className="hidden sm:inline-flex gpw-badge-primary">
                  {email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="gpw-btn-ghost text-sm"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </header>

        {/* Project selector */}
        <div className="mb-8">
          <ProjectSelector
            projects={projects}
            selectedProject={selectedProject}
            onSelect={setSelectedProject}
            loading={loadingProjects}
          />
        </div>

        {/* Main content */}
        {!selectedProject && !loadingProjects ? (
          <div className="gpw-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gpw-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gpw-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Create your first project</h2>
            <p className="text-gpw-text-muted mb-6">
              Get started by creating a project to connect your payment providers.
            </p>
            <Link href="/projects" className="gpw-btn-primary">
              Create Project
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick actions */}
            <QuickActions projectSlug={selectedProject} />

            {/* Analytics overview */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gpw-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics Overview
              </h2>
              <AnalyticsCards
                analytics={analytics}
                loading={loadingAnalytics}
              />
            </section>

            {/* Revenue chart */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gpw-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Revenue Trend
              </h2>
              <RevenueChart
                data={analytics?.revenueHistory}
                loading={loadingAnalytics}
              />
            </section>

            {/* Two-column layout for settings */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Provider keys */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gpw-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Provider Keys
                </h2>
                <ProviderKeysForm
                  projectSlug={selectedProject}
                  existingKeys={keys}
                  onKeysUpdated={(newKeys) => setKeys(newKeys)}
                />
              </section>

              {/* Theme settings */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gpw-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Widget Theme
                </h2>
                <ThemeSettings
                  projectSlug={selectedProject}
                  settings={settings}
                  onSettingsUpdated={(newSettings) => setSettings(newSettings)}
                />
              </section>
            </div>

            {/* Crypto Coming Soon section */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Crypto Payments
              </h2>
              <CryptoComingSoon 
                onNotifyMe={(email) => console.log('Notify:', email)} 
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
