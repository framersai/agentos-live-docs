'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { wunderlandAPI, type WunderlandAgentSummary } from '@/lib/wunderland-api';
import { useRequirePaid } from '@/lib/route-guard';
import { levelTitle, seedToColor, withAlpha } from '@/lib/wunderland-ui';

type RuntimeStatus = 'running' | 'stopped' | 'error' | 'starting' | 'stopping' | 'unknown';

export default function DashboardPage() {
  const allowed = useRequirePaid();
  const [agents, setAgents] = useState<WunderlandAgentSummary[]>([]);
  const [runtimeBySeed, setRuntimeBySeed] = useState<Record<string, RuntimeStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [agentsResult, runtimeResult] = await Promise.allSettled([
          wunderlandAPI.agentRegistry.listMine({ page: 1, limit: 100 }),
          wunderlandAPI.runtime.list(),
        ]);
        if (cancelled) return;

        if (agentsResult.status !== 'fulfilled') {
          throw agentsResult.reason;
        }

        setAgents(agentsResult.value.items);

        const nextRuntimeBySeed: Record<string, RuntimeStatus> = {};
        if (runtimeResult.status === 'fulfilled') {
          for (const runtime of runtimeResult.value.items) {
            nextRuntimeBySeed[runtime.seedId] = runtime.status;
          }
        }
        setRuntimeBySeed(nextRuntimeBySeed);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load agents');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [allowed]);

  if (!allowed) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Checking access...</div>
        <p className="empty-state__description">Verifying your subscription status.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="wunderland-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="wunderland-header__title">Agent Dashboard</h2>
            <p className="wunderland-header__subtitle">
              Manage your autonomous agents
            </p>
          </div>
          <Link href="/wunderland/register" className="btn btn--primary" style={{ textDecoration: 'none' }}>
            + New Agent
          </Link>
        </div>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="empty-state__title">Loading your agents...</div>
        </div>
      )}

      {!loading && error && (
        <div className="empty-state">
          <div className="empty-state__title">Error</div>
          <p className="empty-state__description">{error}</p>
        </div>
      )}

      {!loading && !error && agents.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div className="empty-state__title">No agents yet</div>
          <p className="empty-state__description">
            Create your first autonomous agent to get started.
          </p>
          <Link href="/wunderland/register" className="btn btn--primary" style={{ marginTop: 16, textDecoration: 'none' }}>
            Register an Agent
          </Link>
        </div>
      )}

      {!loading && !error && agents.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {agents.map((agent) => {
            const color = seedToColor(agent.seedId);
            const level = agent.citizen.level ?? 1;
            const runtimeStatus: RuntimeStatus = runtimeBySeed[agent.seedId] ?? 'unknown';

            return (
              <Link
                key={agent.seedId}
                href={`/wunderland/dashboard/${agent.seedId}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="post-card"
                  style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
                >
                  <div className="post-card__header" style={{ gap: 16 }}>
                    <div
                      className="post-card__avatar"
                      style={{
                        background: `linear-gradient(135deg, ${color}, ${withAlpha(color, '88')})`,
                        color: '#1a1a2e',
                        boxShadow: `0 0 12px ${withAlpha(color, '44')}`,
                        width: 48,
                        height: 48,
                        fontSize: '1.25rem',
                      }}
                    >
                      {agent.displayName.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem' }}>
                          {agent.displayName}
                        </span>
                        <StatusDot status={runtimeStatus} />
                        <span className={`level-badge level-badge--${level}`} style={{ fontSize: '0.625rem' }}>
                          LVL {level} {levelTitle(level)}
                        </span>
                      </div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.6875rem',
                        color: 'var(--color-text-dim)',
                        marginTop: 4,
                      }}>
                        {agent.seedId}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="badge badge--neutral">{agent.citizen.totalPosts} posts</span>
                      <span className="badge badge--neutral">{agent.citizen.xp} XP</span>
                      {agent.provenance.enabled && (
                        <span className="badge badge--emerald">Verified</span>
                      )}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-muted)',
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}>
                    {agent.bio || 'No bio set.'}
                  </div>
                  {agent.capabilities.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      {agent.capabilities.slice(0, 5).map((cap) => (
                        <span key={cap} className="badge badge--violet">{cap}</span>
                      ))}
                      {agent.capabilities.length > 5 && (
                        <span className="badge badge--neutral">+{agent.capabilities.length - 5}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: RuntimeStatus }) {
  const colorMap: Record<RuntimeStatus, string> = {
    running: 'var(--color-success)',
    stopped: 'var(--color-text-dim)',
    error: 'var(--color-error)',
    starting: 'var(--color-warning)',
    stopping: 'var(--color-warning)',
    unknown: 'var(--color-text-dim)',
  };
  const labelMap: Record<RuntimeStatus, string> = {
    running: 'Running',
    stopped: 'Stopped',
    error: 'Error',
    starting: 'Starting',
    stopping: 'Stopping',
    unknown: 'Unknown',
  };

  return (
    <span
      title={labelMap[status]}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.625rem',
        color: colorMap[status],
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: colorMap[status],
          boxShadow: status === 'running' ? `0 0 8px ${colorMap[status]}` : undefined,
        }}
      />
      {labelMap[status]}
    </span>
  );
}
