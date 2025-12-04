'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface ProviderKey {
  provider: string;
  updatedAt: string;
  isTestMode?: boolean;
}

interface ProviderKeysFormProps {
  projectSlug: string | null;
  existingKeys: ProviderKey[];
  onKeysUpdated: (keys: ProviderKey[]) => void;
}

const providers = [
  { id: 'stripe', name: 'Stripe', icon: '💳' },
  { id: 'lemonsqueezy', name: 'Lemon Squeezy', icon: '🍋' },
  { id: 'paddle', name: 'Paddle', icon: '🏓', comingSoon: true },
  { id: 'coinbase', name: 'Coinbase Commerce', icon: '₿', comingSoon: true },
];

export function ProviderKeysForm({
  projectSlug,
  existingKeys,
  onKeysUpdated,
}: ProviderKeysFormProps) {
  const [selectedProvider, setSelectedProvider] = useState('stripe');
  const [secret, setSecret] = useState('');
  const [isTestMode, setIsTestMode] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectSlug || !secret) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectSlug)}/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          secret,
          metadata: { isTestMode },
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save');
      }

      setSecret('');
      setSuccess(true);

      // Refresh keys
      const keysRes = await fetch(`/api/projects/${encodeURIComponent(projectSlug)}/keys`);
      if (keysRes.ok) {
        const json = await keysRes.json();
        onKeysUpdated(json.keys ?? []);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getProviderStatus = (providerId: string) => {
    return existingKeys.find((k) => k.provider === providerId);
  };

  return (
    <div className="gpw-card p-6 space-y-6">
      {/* Provider tabs */}
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => {
          const status = getProviderStatus(provider.id);
          const isActive = selectedProvider === provider.id;

          return (
            <button
              key={provider.id}
              onClick={() => !provider.comingSoon && setSelectedProvider(provider.id)}
              disabled={provider.comingSoon}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-gpw-purple-600 text-white'
                  : provider.comingSoon
                  ? 'bg-gray-100 dark:bg-gray-800 text-gpw-text-muted cursor-not-allowed'
                  : 'bg-gpw-purple-500/10 text-gpw-purple-600 dark:text-gpw-purple-400 hover:bg-gpw-purple-500/20'
                }
              `}
            >
              <span>{provider.icon}</span>
              <span>{provider.name}</span>
              {status && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
              )}
              {provider.comingSoon && (
                <span className="text-2xs uppercase tracking-wider opacity-60">Soon</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Test mode toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <span className="text-amber-500">⚠️</span>
            <div>
              <p className="font-medium text-sm">Test Mode</p>
              <p className="text-xs text-gpw-text-muted">
                Use test keys for development
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isTestMode}
              onChange={(e) => setIsTestMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gpw-purple-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gpw-purple-600" />
          </label>
        </div>

        {/* Secret input */}
        <div>
          <label htmlFor="secret" className="gpw-label">
            {selectedProvider === 'stripe' ? 'Stripe Secret Key' : 'API Credentials (JSON)'}
          </label>
          <textarea
            id="secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            rows={4}
            className="gpw-textarea font-mono text-sm"
            placeholder={
              selectedProvider === 'stripe'
                ? '{"secretKey":"sk_test_...","priceId":"price_..."}'
                : '{"apiKey":"...","storeId":"...","variantId":"..."}'
            }
          />
          <p className="text-xs text-gpw-text-muted mt-1">
            Keys are encrypted with AES-256-GCM before storage
          </p>
        </div>

        {/* Error/Success messages */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
            ✓ Keys saved successfully
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!projectSlug || !secret || saving}
          className="gpw-btn-primary w-full"
        >
          {saving ? (
            <>
              <Spinner size={18} />
              Encrypting & Saving...
            </>
          ) : (
            'Save Provider Keys'
          )}
        </button>
      </form>

      {/* Connected providers */}
      {existingKeys.length > 0 && (
        <div className="pt-4 border-t border-gpw-border">
          <p className="text-sm font-medium mb-3">Connected Providers</p>
          <div className="space-y-2">
            {existingKeys.map((key) => {
              const provider = providers.find((p) => p.id === key.provider);
              return (
                <div
                  key={key.provider}
                  className="flex items-center justify-between p-3 rounded-xl bg-gpw-purple-500/5 border border-gpw-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{provider?.icon}</span>
                    <div>
                      <p className="font-medium text-sm capitalize">{key.provider}</p>
                      <p className="text-xs text-gpw-text-muted">
                        Updated {new Date(key.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="gpw-badge-success">Connected</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}





