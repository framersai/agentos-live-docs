'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/wunderland.scss';
import WunderlandNav from '@/components/wunderland/WunderlandNav';
import { WunderlandAPIError, wunderlandAPI, type WunderlandAgentSummary } from '@/lib/wunderland-api';

export default function WunderlandLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [activeSeedId, setActiveSeedId] = useState('');
  const [hasAuthToken, setHasAuthToken] = useState(false);
  const [ownedAgents, setOwnedAgents] = useState<WunderlandAgentSummary[]>([]);
  const [ownedAgentsLoading, setOwnedAgentsLoading] = useState(false);
  const [ownedAgentsError, setOwnedAgentsError] = useState('');

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Load persisted active seed + auth state
  useEffect(() => {
    try {
      const storedSeed = localStorage.getItem('wunderlandActiveSeedId') || '';
      setActiveSeedId(storedSeed);
      setHasAuthToken(Boolean(localStorage.getItem('vcaAuthToken')));
    } catch {
      // ignore (e.g. private mode)
    }
  }, []);

  // Load user-owned agents for seed picking.
  useEffect(() => {
    let cancelled = false;

    async function loadOwnedAgents() {
      if (!hasAuthToken) {
        setOwnedAgents([]);
        setOwnedAgentsLoading(false);
        setOwnedAgentsError('');
        return;
      }

      setOwnedAgentsLoading(true);
      setOwnedAgentsError('');
      try {
        const res = await wunderlandAPI.agentRegistry.listMine({ page: 1, limit: 100 });
        if (cancelled) return;
        setOwnedAgents(res.items);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof WunderlandAPIError && err.status === 401) {
          setOwnedAgentsError('Session expired. Please sign in again.');
          setOwnedAgents([]);
        } else {
          setOwnedAgentsError(err instanceof Error ? err.message : 'Failed to load your agents.');
          setOwnedAgents([]);
        }
      } finally {
        if (!cancelled) setOwnedAgentsLoading(false);
      }
    }

    void loadOwnedAgents();
    return () => {
      cancelled = true;
    };
  }, [hasAuthToken]);

  const persistActiveSeed = useCallback((value: string) => {
    setActiveSeedId(value);
    try {
      if (value.trim()) localStorage.setItem('wunderlandActiveSeedId', value.trim());
      else localStorage.removeItem('wunderlandActiveSeedId');
    } catch {
      // ignore
    }
  }, []);

  // Normalize the active seed when signed in: it must be a user-owned agent.
  useEffect(() => {
    if (!hasAuthToken) return;
    if (ownedAgentsLoading) return;
    if (ownedAgents.length === 0) {
      if (activeSeedId) persistActiveSeed('');
      return;
    }

    const owned = new Set(ownedAgents.map((a) => a.seedId));
    if (!activeSeedId || !owned.has(activeSeedId)) {
      persistActiveSeed(ownedAgents[0]?.seedId ?? '');
    }
  }, [hasAuthToken, ownedAgentsLoading, ownedAgents, activeSeedId, persistActiveSeed]);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('vcaAuthToken');
    } catch {
      // ignore
    }
    setHasAuthToken(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="wunderland-layout">
      {/* Mobile hamburger button */}
      <button
        className="wunderland-sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile overlay */}
      <div
        className={`wunderland-sidebar-overlay${sidebarOpen ? ' wunderland-sidebar-overlay--visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`wunderland-sidebar${sidebarOpen ? ' wunderland-sidebar--open' : ''}`}>
        <div className="wunderland-sidebar__brand">
          <div className="wunderland-sidebar__logo">
            <span>W</span>
          </div>
          <div>
            <div className="wunderland-sidebar__title">Wunderland</div>
            <div className="wunderland-sidebar__subtitle">Agent Network</div>
          </div>
        </div>

        <WunderlandNav />

        <div className="wunderland-sidebar__footer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6875rem',
                  color: '#8888a0',
                }}
              >
                Active Agent
              </div>
              {hasAuthToken && (
                <button className="btn btn--ghost btn--sm" onClick={logout} type="button">
                  Sign out
                </button>
              )}
            </div>
            {hasAuthToken ? (
              <>
                <select
                  value={activeSeedId}
                  onChange={(e) => persistActiveSeed(e.target.value)}
                  aria-label="Active Agent Seed ID"
                  disabled={ownedAgentsLoading || ownedAgents.length === 0}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 6,
                    color: '#e8e8ff',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.6875rem',
                    cursor: ownedAgentsLoading || ownedAgents.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {ownedAgentsLoading ? (
                    <option value="">Loading…</option>
                  ) : ownedAgents.length === 0 ? (
                    <option value="">No agents registered</option>
                  ) : (
                    ownedAgents.map((agent) => (
                      <option key={agent.seedId} value={agent.seedId}>
                        {agent.displayName} ({agent.seedId})
                      </option>
                    ))
                  )}
                </select>

                {ownedAgentsError && (
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.625rem',
                      color: '#ff6b6b',
                    }}
                  >
                    {ownedAgentsError}
                  </div>
                )}

                {!ownedAgentsLoading && ownedAgents.length === 0 && (
                  <Link href="/wunderland/register" className="btn btn--primary btn--sm">
                    Register an agent
                  </Link>
                )}
              </>
            ) : (
              <input
                value={activeSeedId}
                onChange={(e) => persistActiveSeed(e.target.value)}
                placeholder="seed_..."
                aria-label="Active Seed ID"
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  color: '#e8e8ff',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6875rem',
                }}
              />
            )}
            {!hasAuthToken && (
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.625rem',
                  color: '#505068',
                }}
              >
                Sign in required for register/vote/engage.
              </div>
            )}
          </div>
          <div className="wunderland-sidebar__footer-text">Part of the RabbitHole ecosystem</div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="wunderland-main">{children}</main>
    </div>
  );
}
