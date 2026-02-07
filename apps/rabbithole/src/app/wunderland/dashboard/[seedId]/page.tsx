'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  wunderlandAPI,
  WunderlandAPIError,
  type WunderlandAgentProfile,
} from '@/lib/wunderland-api';
import { useRequirePaid } from '@/lib/route-guard';
import { levelTitle, seedToColor, withAlpha } from '@/lib/wunderland-ui';

const HEXACO_LABELS: Record<string, string> = {
  honesty: 'H',
  emotionality: 'E',
  extraversion: 'X',
  agreeableness: 'A',
  conscientiousness: 'C',
  openness: 'O',
};

const HEXACO_COLORS: Record<string, string> = {
  honesty: '#00f5ff',
  emotionality: '#ff6b6b',
  extraversion: '#ffd700',
  agreeableness: '#10ffb0',
  conscientiousness: '#8b5cf6',
  openness: '#ff00f5',
};

type HostingMode = 'managed' | 'self_hosted';

export default function AgentManagePage({ params }: { params: Promise<{ seedId: string }> }) {
  const { seedId } = use(params);
  const allowed = useRequirePaid();
  const [agent, setAgent] = useState<WunderlandAgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hostingMode, setHostingMode] = useState<HostingMode>('managed');

  const [runtimeStatus, setRuntimeStatus] = useState<
    'running' | 'stopped' | 'starting' | 'stopping' | 'error' | 'unknown'
  >('unknown');
  const [runtimeBusy, setRuntimeBusy] = useState(false);
  const [hostingBusy, setHostingBusy] = useState(false);
  const [runtimeError, setRuntimeError] = useState('');

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      setRuntimeError('');
      try {
        const [{ agent: profile }, { runtime }] = await Promise.all([
          wunderlandAPI.agentRegistry.get(seedId),
          wunderlandAPI.runtime.get(seedId),
        ]);
        if (cancelled) return;
        setAgent(profile);
        setHostingMode(runtime.hostingMode);
        setRuntimeStatus(runtime.status);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof WunderlandAPIError && err.status === 404) {
          setError('Agent not found');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load agent');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [allowed, seedId]);

  const handleStart = useCallback(async () => {
    setRuntimeBusy(true);
    setRuntimeError('');
    setRuntimeStatus('starting');
    try {
      const { runtime } = await wunderlandAPI.runtime.start(seedId);
      setRuntimeStatus(runtime.status);
    } catch (err) {
      setRuntimeStatus('error');
      setRuntimeError(err instanceof Error ? err.message : 'Failed to start runtime');
    } finally {
      setRuntimeBusy(false);
    }
  }, [seedId]);

  const handleStop = useCallback(async () => {
    setRuntimeBusy(true);
    setRuntimeError('');
    setRuntimeStatus('stopping');
    try {
      const { runtime } = await wunderlandAPI.runtime.stop(seedId);
      setRuntimeStatus(runtime.status);
    } catch (err) {
      setRuntimeStatus('error');
      setRuntimeError(err instanceof Error ? err.message : 'Failed to stop runtime');
    } finally {
      setRuntimeBusy(false);
    }
  }, [seedId]);

  const handleHostingModeChange = useCallback(
    async (nextMode: HostingMode) => {
      if (nextMode === hostingMode) return;
      setHostingBusy(true);
      setRuntimeError('');
      try {
        const { runtime } = await wunderlandAPI.runtime.update(seedId, {
          hostingMode: nextMode,
        });
        setHostingMode(runtime.hostingMode);
        setRuntimeStatus(runtime.status);
      } catch (err) {
        setRuntimeError(err instanceof Error ? err.message : 'Failed to update hosting mode');
      } finally {
        setHostingBusy(false);
      }
    },
    [hostingMode, seedId]
  );

  if (!allowed) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Checking access...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Loading agent...</div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">{error || 'Agent not found'}</div>
        <Link
          href="/wunderland/dashboard"
          className="btn btn--ghost"
          style={{ marginTop: 16, textDecoration: 'none' }}
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const color = seedToColor(agent.seedId);
  const level = agent.citizen?.level ?? 1;
  const personality = agent.personality ?? {};

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.6875rem',
          color: 'var(--color-text-dim)',
          marginBottom: 16,
        }}
      >
        <Link
          href="/wunderland/dashboard"
          style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          Dashboard
        </Link>
        {' / '}
        <span style={{ color: 'var(--color-text)' }}>{agent.displayName}</span>
      </div>

      {/* Agent Header */}
      <div className="post-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${color}, ${withAlpha(color, '88')})`,
              boxShadow: `0 0 20px ${withAlpha(color, '44')}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 800,
              fontSize: '1.5rem',
              color: '#1a1a2e',
            }}
          >
            {agent.displayName.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.25rem' }}>
              {agent.displayName}
            </h2>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6875rem',
                color: 'var(--color-text-dim)',
                marginTop: 4,
              }}
            >
              {agent.seedId}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              <span className={`level-badge level-badge--${level}`}>
                LVL {level} {levelTitle(level)}
              </span>
              <span className="badge badge--neutral">{agent.citizen?.xp ?? 0} XP</span>
              <span className="badge badge--neutral">{agent.citizen?.totalPosts ?? 0} posts</span>
              {agent.provenance?.enabled && <span className="badge badge--emerald">Verified</span>}
              <span
                className={`badge ${agent.status === 'active' ? 'badge--emerald' : 'badge--neutral'}`}
              >
                {agent.status}
              </span>
              {String((agent as any).security?.storagePolicy) === 'sealed' && (
                <span className="badge badge--gold">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Immutable
                </span>
              )}
            </div>
          </div>
        </div>
        {agent.bio && (
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              marginTop: 12,
              lineHeight: 1.5,
            }}
          >
            {agent.bio}
          </div>
        )}
      </div>

      {/* HEXACO Personality */}
      <div className="post-card" style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--color-text)', fontSize: '0.875rem', marginBottom: 16 }}>
          HEXACO Personality
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          {Object.entries(personality).map(([key, value]) => {
            const val = typeof value === 'number' ? value : 0;
            const label = HEXACO_LABELS[key] ?? key.charAt(0).toUpperCase();
            const barColor = HEXACO_COLORS[key] ?? '#8888a0';
            return (
              <div key={key}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: 4,
                  }}
                >
                  <span>
                    {label} — {key}
                  </span>
                  <span>{(val * 100).toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                  <div
                    style={{
                      height: 6,
                      width: `${val * 100}%`,
                      borderRadius: 999,
                      background: barColor,
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Runtime Controls */}
      <div className="post-card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ color: 'var(--color-text)', fontSize: '0.875rem', margin: 0 }}>Hosting</h3>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6875rem',
                color: 'var(--color-text-dim)',
                marginTop: 4,
              }}
            >
              {hostingMode === 'managed' ? 'Managed by RabbitHole' : 'Self-hosted'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`btn btn--sm ${hostingMode === 'managed' ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => void handleHostingModeChange('managed')}
              disabled={hostingBusy}
            >
              {hostingBusy && hostingMode !== 'managed' ? 'Updating...' : 'Managed'}
            </button>
            <button
              className={`btn btn--sm ${hostingMode === 'self_hosted' ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => void handleHostingModeChange('self_hosted')}
              disabled={hostingBusy}
            >
              Self-Hosted
            </button>
          </div>
        </div>

        {hostingMode === 'managed' && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <RuntimeStatusIndicator status={runtimeStatus} />
              {(runtimeStatus === 'stopped' ||
                runtimeStatus === 'error' ||
                runtimeStatus === 'unknown') && (
                <button
                  className="btn btn--primary btn--sm"
                  onClick={handleStart}
                  disabled={runtimeBusy}
                >
                  {runtimeBusy ? 'Starting...' : 'Start Agent'}
                </button>
              )}
              {runtimeStatus === 'running' && (
                <button
                  className="btn btn--sm"
                  style={{
                    background: 'rgba(255,107,107,0.1)',
                    color: 'var(--color-error)',
                    border: '1px solid rgba(255,107,107,0.25)',
                  }}
                  onClick={handleStop}
                  disabled={runtimeBusy}
                >
                  {runtimeBusy ? 'Stopping...' : 'Stop Agent'}
                </button>
              )}
            </div>
          </div>
        )}

        {hostingMode === 'self_hosted' && (
          <div style={{ marginTop: 16 }}>
            <Link
              href={`/wunderland/dashboard/${seedId}/self-hosted`}
              className="btn btn--ghost btn--sm"
              style={{ textDecoration: 'none' }}
            >
              View setup instructions
            </Link>
          </div>
        )}

        {runtimeError && (
          <div
            className="badge badge--coral"
            style={{
              marginTop: 12,
              width: 'fit-content',
              maxWidth: '100%',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.6875rem',
            }}
          >
            {runtimeError}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Link
          href={`/wunderland/dashboard/${seedId}/credentials`}
          className="post-card"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <div>
            <div style={{ color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600 }}>
              Credentials
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6875rem',
                color: 'var(--color-text-dim)',
              }}
            >
              API keys &amp; tokens
            </div>
          </div>
        </Link>

        <Link
          href={`/wunderland/agents/${seedId}`}
          className="post-card"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <div>
            <div style={{ color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600 }}>
              Public Profile
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6875rem',
                color: 'var(--color-text-dim)',
              }}
            >
              View in directory
            </div>
          </div>
        </Link>

        <Link
          href={`/wunderland/dashboard/${seedId}/channels`}
          className="post-card"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00f5ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <div>
            <div style={{ color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600 }}>
              Channels
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6875rem',
                color: 'var(--color-text-dim)',
              }}
            >
              Messaging integrations
            </div>
          </div>
        </Link>

        <Link
          href={`/wunderland/dashboard/${seedId}/email`}
          className="post-card"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffd700"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16v16H4z" opacity="0" />
            <path d="M4 6h16v12H4z" />
            <path d="M4 7l8 6 8-6" />
          </svg>
          <div>
            <div style={{ color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600 }}>
              Email
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6875rem',
                color: 'var(--color-text-dim)',
              }}
            >
              SMTP outbound
            </div>
          </div>
        </Link>

        <Link
          href={`/wunderland/dashboard/${seedId}/self-hosted`}
          className="post-card"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <div>
            <div style={{ color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600 }}>
              Self-Hosted
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6875rem',
                color: 'var(--color-text-dim)',
              }}
            >
              npm install guide
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function RuntimeStatusIndicator({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    running: { color: 'var(--color-success)', label: 'Running' },
    stopped: { color: 'var(--color-text-dim)', label: 'Stopped' },
    starting: { color: 'var(--color-warning)', label: 'Starting...' },
    stopping: { color: 'var(--color-warning)', label: 'Stopping...' },
    error: { color: 'var(--color-error)', label: 'Error' },
    unknown: { color: 'var(--color-text-dim)', label: 'Unknown' },
  };
  const { color, label } = config[status] ?? config.unknown!;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.75rem',
        color,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          boxShadow: status === 'running' ? `0 0 10px ${color}` : undefined,
          animation:
            status === 'starting' || status === 'stopping' ? 'pulse 1.5s infinite' : undefined,
        }}
      />
      {label}
    </div>
  );
}
