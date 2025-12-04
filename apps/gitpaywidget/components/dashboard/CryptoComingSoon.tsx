'use client';

import { useState } from 'react';

/**
 * Crypto Provider Coming Soon Component
 * 
 * Displays a placeholder for crypto payment support with:
 * - Coming soon badge
 * - Feature preview
 * - Email signup for notifications
 */

interface CryptoComingSoonProps {
  onNotifyMe?: (email: string) => void;
}

export function CryptoComingSoon({ onNotifyMe }: CryptoComingSoonProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    // In production, this would call an API to store the email
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onNotifyMe?.(email);
    setSubmitted(true);
    setLoading(false);
  };

  const plannedFeatures = [
    {
      icon: '🦊',
      name: 'WalletConnect',
      description: 'MetaMask, Rainbow, and 300+ wallets',
    },
    {
      icon: '💳',
      name: 'Coinbase Commerce',
      description: 'BTC, ETH, USDC, and more',
    },
    {
      icon: '⚡',
      name: 'Lightning Network',
      description: 'Instant Bitcoin payments',
    },
    {
      icon: '🔷',
      name: 'Solana Pay',
      description: 'Fast, low-cost SOL & SPL tokens',
    },
  ];

  return (
    <div className="gpw-card p-6 relative overflow-hidden">
      {/* Coming soon badge */}
      <div className="absolute top-4 right-4">
        <span className="gpw-badge bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mr-1.5" />
          Coming Soon
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-2xl">
          ₿
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gpw-text-primary">
            Crypto Payments
          </h3>
          <p className="text-sm text-gpw-text-muted">
            Accept cryptocurrency payments on your static site
          </p>
        </div>
      </div>

      {/* Planned features */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {plannedFeatures.map((feature) => (
          <div
            key={feature.name}
            className="p-3 rounded-xl bg-gpw-bg-subtle dark:bg-gpw-bg-muted border border-gpw-border opacity-60"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{feature.icon}</span>
              <span className="font-medium text-sm text-gpw-text-primary">
                {feature.name}
              </span>
            </div>
            <p className="text-xs text-gpw-text-muted">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Notification signup */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm text-gpw-text-muted">
            Get notified when crypto payments launch:
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="gpw-input flex-1 text-sm py-2"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="gpw-btn-primary text-sm px-4 py-2 whitespace-nowrap"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Notify me'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">You're on the list!</span>
          </div>
          <p className="text-sm text-gpw-text-muted mt-1">
            We'll email {email} when crypto payments are ready.
          </p>
        </div>
      )}

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 pointer-events-none" />
    </div>
  );
}

export default CryptoComingSoon;


