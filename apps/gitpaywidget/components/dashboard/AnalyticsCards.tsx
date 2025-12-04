'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface Analytics {
  mrr: number;
  checkoutsToday: number;
  checkoutsThisMonth: number;
  conversionRate: number;
  activeSubscriptions: number;
  churnRate: number;
}

interface AnalyticsCardsProps {
  analytics: Analytics | null;
  loading: boolean;
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};

export function AnalyticsCards({ analytics, loading }: AnalyticsCardsProps) {
  const cards = [
    {
      label: 'Monthly Recurring Revenue',
      value: analytics ? formatCurrency(analytics.mrr) : '$0.00',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Checkouts Today',
      value: analytics?.checkoutsToday ?? 0,
      change: '+8',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Conversion Rate',
      value: analytics ? formatPercent(analytics.conversionRate) : '0%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Active Subscriptions',
      value: analytics?.activeSubscriptions ?? 0,
      change: '+5',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="gpw-card p-5 hover:shadow-gpw-lg transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient}`}>
              <span className={card.iconColor}>{card.icon}</span>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                card.changeType === 'positive'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {card.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-gpw-text-primary mb-1">
            {card.value}
          </p>
          <p className="text-sm text-gpw-text-muted">{card.label}</p>
        </div>
      ))}
    </div>
  );
}





