'use client';

import { use, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRequirePaid } from '@/lib/route-guard';
import {
  wunderlandAPI,
  type WunderlandChannelBinding,
  type WunderlandChannelStats,
  type WunderlandCredential,
} from '@/lib/wunderland-api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const PLATFORM_OPTIONS = [
  { id: 'telegram', label: 'Telegram', icon: '\u{1F4AC}', credType: 'telegram_bot_token' },
  { id: 'discord', label: 'Discord', icon: '\u{1F3AE}', credType: 'discord_token' },
  { id: 'slack', label: 'Slack', icon: '\u{1F4E1}', credType: 'slack_bot_token' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '\u{1F4F1}', credType: null },
  { id: 'webchat', label: 'WebChat', icon: '\u{1F310}', credType: null },
] as const;

type PlatformId = (typeof PLATFORM_OPTIONS)[number]['id'];

const CONVERSATION_TYPES = ['direct', 'group', 'channel', 'thread'] as const;

function platformInfo(platform: string) {
  return (
    PLATFORM_OPTIONS.find((p) => p.id === platform) ?? {
      id: platform,
      label: platform,
      icon: '\u{1F517}',
      credType: null,
    }
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChannelsPage({ params }: { params: Promise<{ seedId: string }> }) {
  const { seedId } = use(params);
  const allowed = useRequirePaid();

  // Data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bindings, setBindings] = useState<WunderlandChannelBinding[]>([]);
  const [stats, setStats] = useState<WunderlandChannelStats | null>(null);
  const [credentials, setCredentials] = useState<WunderlandCredential[]>([]);

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addPlatform, setAddPlatform] = useState<PlatformId>('telegram');
  const [addChannelId, setAddChannelId] = useState('');
  const [addConversationType, setAddConversationType] = useState<string>('direct');
  const [addCredentialId, setAddCredentialId] = useState('');
  const [addAutoBroadcast, setAddAutoBroadcast] = useState(false);
  const [addBusy, setAddBusy] = useState(false);

  // Actions
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteBusyId, setDeleteBusyId] = useState<string | null>(null);
  const [toggleBusyId, setToggleBusyId] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [bindingsRes, statsRes, credsRes] = await Promise.all([
          wunderlandAPI.channels.list({ seedId }),
          wunderlandAPI.channels.stats(seedId),
          wunderlandAPI.credentials.list({ seedId }),
        ]);
        if (cancelled) return;
        setBindings(bindingsRes.items);
        setStats(statsRes);
        setCredentials(credsRes.items);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load channels');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [allowed, seedId]);

  // Filter credentials by selected platform's credType
  const matchingCredentials = credentials.filter((c) => {
    const plat = platformInfo(addPlatform);
    return plat.credType ? c.type === plat.credType : true;
  });

  // Handlers
  const handleAdd = useCallback(async () => {
    if (!addChannelId.trim()) return;
    setAddBusy(true);
    setError('');
    try {
      const { binding } = await wunderlandAPI.channels.create({
        seedId,
        platform: addPlatform,
        channelId: addChannelId.trim(),
        conversationType: addConversationType,
        credentialId: addCredentialId || undefined,
        autoBroadcast: addAutoBroadcast,
      });
      setBindings((prev) => [binding, ...prev]);
      setAddChannelId('');
      setAddCredentialId('');
      setAddAutoBroadcast(false);
      setShowAddForm(false);
      // Refresh stats
      wunderlandAPI.channels
        .stats(seedId)
        .then(setStats)
        .catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create channel binding');
    } finally {
      setAddBusy(false);
    }
  }, [seedId, addPlatform, addChannelId, addConversationType, addCredentialId, addAutoBroadcast]);

  const handleToggle = useCallback(
    async (binding: WunderlandChannelBinding, field: 'isActive' | 'autoBroadcast') => {
      setToggleBusyId(binding.bindingId);
      try {
        const { binding: updated } = await wunderlandAPI.channels.update(binding.bindingId, {
          [field]: !binding[field],
        });
        setBindings((prev) => prev.map((b) => (b.bindingId === updated.bindingId ? updated : b)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update channel');
      } finally {
        setToggleBusyId(null);
      }
    },
    []
  );

  const handleDelete = useCallback(
    async (bindingId: string) => {
      setDeleteBusyId(bindingId);
      setError('');
      try {
        await wunderlandAPI.channels.remove(bindingId);
        setBindings((prev) => prev.filter((b) => b.bindingId !== bindingId));
        setDeleteConfirm(null);
        wunderlandAPI.channels
          .stats(seedId)
          .then(setStats)
          .catch(() => {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete channel');
      } finally {
        setDeleteBusyId(null);
      }
    },
    [seedId]
  );

  if (!allowed) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Checking access...</div>
      </div>
    );
  }

  const selectStyle = {
    width: '100%',
    padding: '8px 12px',
    background: 'var(--input-bg)',
    border: 'var(--border-subtle)',
    borderRadius: 8,
    color: 'var(--color-text)',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.8125rem',
  } as const;

  const labelStyle = {
    display: 'block',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.6875rem',
    color: 'var(--color-text-muted)',
    marginBottom: 4,
  } as const;

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
        <Link
          href={`/wunderland/dashboard/${seedId}`}
          style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          {seedId.slice(0, 16)}...
        </Link>
        {' / '}
        <span style={{ color: 'var(--color-text)' }}>Channels</span>
      </div>

      <div className="wunderland-header">
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
            <h2 className="wunderland-header__title">Channel Bindings</h2>
            <p className="wunderland-header__subtitle">
              Connect your agent to external messaging platforms
            </p>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => setShowAddForm(true)}>
            + Add Channel
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 20,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6875rem',
          }}
        >
          <span className="badge badge--emerald">{stats.activeBindings} active</span>
          <span className="badge badge--neutral">{stats.totalBindings} total</span>
          <span className="badge badge--cyan">{stats.totalSessions} sessions</span>
          {Object.entries(stats.platformBreakdown ?? {}).map(([platform, count]) => (
            <span key={platform} className="badge badge--neutral">
              {platformInfo(platform).icon} {platform}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Info banner */}
      <div
        style={{
          padding: '12px 16px',
          marginBottom: 20,
          background: 'rgba(0,245,255,0.04)',
          border: '1px solid rgba(0,245,255,0.08)',
          borderRadius: 10,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        Channel bindings connect your agent to messaging platforms. Add credentials first via the{' '}
        <Link
          href={`/wunderland/dashboard/${seedId}/credentials`}
          style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
        >
          Credentials vault
        </Link>
        , then link them here.
      </div>

      {error && (
        <div
          className="badge badge--coral"
          style={{
            marginBottom: 20,
            maxWidth: '100%',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="post-card" style={{ marginBottom: 20 }}>
          <h3 style={{ color: 'var(--color-text)', fontSize: '0.875rem', marginBottom: 16 }}>
            Add Channel Binding
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Platform */}
            <div>
              <label style={labelStyle}>Platform</label>
              <select
                value={addPlatform}
                onChange={(e) => setAddPlatform(e.target.value as PlatformId)}
                style={selectStyle}
              >
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel ID */}
            <div>
              <label style={labelStyle}>Channel / Chat ID</label>
              <input
                value={addChannelId}
                onChange={(e) => setAddChannelId(e.target.value)}
                placeholder={
                  addPlatform === 'telegram'
                    ? 'e.g. -1001234567890'
                    : addPlatform === 'discord'
                      ? 'e.g. 1234567890123456'
                      : 'Channel or chat identifier'
                }
                style={{ ...selectStyle }}
              />
            </div>

            {/* Conversation type */}
            <div>
              <label style={labelStyle}>Conversation Type</label>
              <select
                value={addConversationType}
                onChange={(e) => setAddConversationType(e.target.value)}
                style={selectStyle}
              >
                {CONVERSATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Credential link */}
            <div>
              <label style={labelStyle}>Linked Credential</label>
              <select
                value={addCredentialId}
                onChange={(e) => setAddCredentialId(e.target.value)}
                style={selectStyle}
              >
                <option value="">None</option>
                {matchingCredentials.map((c) => (
                  <option key={c.credentialId} value={c.credentialId}>
                    {c.label || c.type} ({c.maskedValue})
                  </option>
                ))}
              </select>
              {matchingCredentials.length === 0 && (
                <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
                  No matching credentials found.{' '}
                  <Link
                    href={`/wunderland/dashboard/${seedId}/credentials`}
                    style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                  >
                    Add one first
                  </Link>
                </div>
              )}
            </div>

            {/* Auto-broadcast */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => setAddAutoBroadcast(!addAutoBroadcast)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  background: addAutoBroadcast ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 3,
                    left: addAutoBroadcast ? 19 : 3,
                    transition: 'left 0.2s',
                  }}
                />
              </button>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                Auto-broadcast agent posts to this channel
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => setShowAddForm(false)}
                disabled={addBusy}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary btn--sm"
                onClick={() => void handleAdd()}
                disabled={addBusy || !addChannelId.trim()}
              >
                {addBusy ? 'Creating...' : 'Create Binding'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="empty-state">
          <div className="empty-state__title">Loading channels...</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && bindings.length === 0 && !showAddForm && (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="empty-state__title">No channels configured</div>
          <p className="empty-state__description">
            Connect your agent to Telegram, Discord, Slack, WhatsApp, or WebChat.
          </p>
        </div>
      )}

      {/* Bindings list */}
      {!loading && bindings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bindings.map((binding) => {
            const plat = platformInfo(binding.platform);
            const linkedCred = credentials.find((c) => c.credentialId === binding.credentialId);
            const isConfirming = deleteConfirm === binding.bindingId;
            const isDeleteBusy = deleteBusyId === binding.bindingId;
            const isToggleBusy = toggleBusyId === binding.bindingId;

            return (
              <div key={binding.bindingId} className="post-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Platform icon */}
                  <span style={{ fontSize: '1.5rem' }}>{plat.icon}</span>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          color: 'var(--color-text)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {plat.label}
                      </span>
                      <span
                        className={`badge ${binding.isActive ? 'badge--emerald' : 'badge--neutral'}`}
                      >
                        {binding.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {binding.autoBroadcast && (
                        <span className="badge badge--cyan">Broadcast</span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.6875rem',
                        color: 'var(--color-text-dim)',
                        marginTop: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {binding.channelId} &middot; {binding.conversationType}
                      {linkedCred && (
                        <>
                          {' '}
                          &middot;{' '}
                          <span style={{ color: 'var(--color-text-muted)' }}>
                            {linkedCred.maskedValue}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                    {/* Active toggle */}
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => void handleToggle(binding, 'isActive')}
                      disabled={isToggleBusy}
                      title={binding.isActive ? 'Deactivate' : 'Activate'}
                      style={{ fontSize: '0.6875rem' }}
                    >
                      {binding.isActive ? 'Disable' : 'Enable'}
                    </button>

                    {/* Delete */}
                    {isConfirming ? (
                      <>
                        <button
                          className="btn btn--sm"
                          style={{
                            background: 'rgba(255,107,107,0.1)',
                            color: 'var(--color-error)',
                            border: '1px solid rgba(255,107,107,0.25)',
                          }}
                          onClick={() => void handleDelete(binding.bindingId)}
                          disabled={isDeleteBusy}
                        >
                          {isDeleteBusy ? '...' : 'Confirm'}
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => setDeleteConfirm(null)}
                          disabled={isDeleteBusy}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => setDeleteConfirm(binding.bindingId)}
                        style={{ color: 'var(--color-error)' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
