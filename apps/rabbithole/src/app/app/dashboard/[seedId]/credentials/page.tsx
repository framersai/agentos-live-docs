'use client';

import { use, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRequirePaid } from '@/lib/route-guard';
import { wunderlandAPI, type WunderlandCredential } from '@/lib/wunderland-api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const CREDENTIAL_TYPES = [
  { id: 'telegram_bot_token', label: 'Telegram Bot Token', icon: '🤖' },
  { id: 'discord_token', label: 'Discord Bot Token', icon: '💬' },
  { id: 'openai_key', label: 'OpenAI API Key', icon: '🧠' },
  { id: 'anthropic_key', label: 'Anthropic API Key', icon: '🔮' },
  { id: 'slack_bot_token', label: 'Slack Bot Token', icon: '📡' },
  { id: 'smtp_host', label: 'SMTP Host', icon: '✉️' },
  { id: 'smtp_user', label: 'SMTP Username', icon: '✉️' },
  { id: 'smtp_password', label: 'SMTP Password', icon: '✉️' },
  { id: 'smtp_from', label: 'SMTP From Address', icon: '✉️' },
  { id: 'custom_webhook', label: 'Custom Webhook', icon: '🔗' },
] as const;

type CredentialType = (typeof CREDENTIAL_TYPES)[number]['id'];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CredentialsPage({ params }: { params: Promise<{ seedId: string }> }) {
  const { seedId } = use(params);
  const allowed = useRequirePaid();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<WunderlandCredential[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addType, setAddType] = useState<CredentialType>('telegram_bot_token');
  const [addLabel, setAddLabel] = useState('');
  const [addValue, setAddValue] = useState('');
  const [addBusy, setAddBusy] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteBusyId, setDeleteBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;

    async function loadCredentials() {
      setLoading(true);
      setError('');
      try {
        const res = await wunderlandAPI.credentials.list({ seedId });
        if (cancelled) return;
        setCredentials(res.items);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load credentials');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCredentials();
    return () => {
      cancelled = true;
    };
  }, [allowed, seedId]);

  const handleAdd = useCallback(async () => {
    if (!addValue.trim()) return;
    setAddBusy(true);
    setError('');
    try {
      const { credential } = await wunderlandAPI.credentials.create({
        seedId,
        type: addType,
        label: addLabel.trim() || undefined,
        value: addValue.trim(),
      });
      setCredentials((prev) => [credential, ...prev]);
      setAddValue('');
      setAddLabel('');
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save credential');
    } finally {
      setAddBusy(false);
    }
  }, [addType, addLabel, addValue, seedId]);

  const handleDelete = useCallback(async (credentialId: string) => {
    setDeleteBusyId(credentialId);
    setError('');
    try {
      await wunderlandAPI.credentials.remove(credentialId);
      setCredentials((prev) => prev.filter((c) => c.credentialId !== credentialId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete credential');
    } finally {
      setDeleteBusyId(null);
    }
  }, []);

  if (!allowed) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Checking access...</div>
      </div>
    );
  }

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
          href="/app/dashboard"
          style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          Dashboard
        </Link>
        {' / '}
        <Link
          href={`/app/dashboard/${seedId}`}
          style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          {seedId.slice(0, 16)}...
        </Link>
        {' / '}
        <span style={{ color: 'var(--color-text)' }}>Credentials</span>
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
            <h2 className="wunderland-header__title">Credential Vault</h2>
            <p className="wunderland-header__subtitle">
              Encrypted API keys and tokens for your agent&apos;s integrations
            </p>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => setShowAddForm(true)}>
            + Add Credential
          </button>
        </div>
      </div>

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
        Credentials are encrypted server-side before storage. Only masked values are returned to the
        dashboard.
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
            Add Credential
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: 4,
                }}
              >
                Type
              </label>
              <select
                value={addType}
                onChange={(e) => setAddType(e.target.value as CredentialType)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--input-bg)',
                  border: 'var(--border-subtle)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.8125rem',
                }}
              >
                {CREDENTIAL_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: 4,
                }}
              >
                Label (optional)
              </label>
              <input
                value={addLabel}
                onChange={(e) => setAddLabel(e.target.value)}
                placeholder="My Telegram Bot"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--input-bg)',
                  border: 'var(--border-subtle)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.8125rem',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: 4,
                }}
              >
                Value
              </label>
              <input
                type="password"
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
                placeholder="Paste your API key or token"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--input-bg)',
                  border: 'var(--border-subtle)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.8125rem',
                }}
              />
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
                disabled={addBusy || !addValue.trim()}
              >
                {addBusy ? 'Encrypting...' : 'Save Credential'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="empty-state">
          <div className="empty-state__title">Loading credentials...</div>
        </div>
      )}

      {/* Credentials list */}
      {!loading && credentials.length === 0 && !showAddForm && (
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div className="empty-state__title">No credentials stored</div>
          <p className="empty-state__description">
            Add API keys and tokens for your agent&apos;s integrations.
          </p>
        </div>
      )}

      {!loading && credentials.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {credentials.map((cred) => {
            const typeInfo = CREDENTIAL_TYPES.find((t) => t.id === cred.type);
            const isConfirming = deleteConfirm === cred.credentialId;
            const isDeleteBusy = deleteBusyId === cred.credentialId;

            return (
              <div key={cred.credentialId} className="post-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.5rem' }}>{typeInfo?.icon ?? '🔑'}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      {cred.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.6875rem',
                        color: 'var(--color-text-dim)',
                        marginTop: 2,
                      }}
                    >
                      {typeInfo?.label ?? cred.type}
                    </div>
                  </div>
                  <code
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '4px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {cred.maskedValue}
                  </code>
                  {isConfirming ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="btn btn--sm"
                        style={{
                          background: 'rgba(255,107,107,0.1)',
                          color: 'var(--color-error)',
                          border: '1px solid rgba(255,107,107,0.25)',
                        }}
                        onClick={() => void handleDelete(cred.credentialId)}
                        disabled={isDeleteBusy}
                      >
                        {isDeleteBusy ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => setDeleteConfirm(null)}
                        disabled={isDeleteBusy}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setDeleteConfirm(cred.credentialId)}
                      style={{ color: 'var(--color-error)' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                {cred.lastUsedAt && (
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.625rem',
                      color: 'var(--color-text-dim)',
                      marginTop: 8,
                    }}
                  >
                    Last used: {new Date(cred.lastUsedAt).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
