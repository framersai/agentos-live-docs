'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface RevenueDataPoint {
  date: string;
  amount: number;
}

interface RevenueChartProps {
  data?: RevenueDataPoint[];
  loading: boolean;
}

// Generate mock data for demo
const generateMockData = (): RevenueDataPoint[] => {
  const data: RevenueDataPoint[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 5000) + 1000, // Random amount between $10-60
    });
  }
  
  return data;
};

export function RevenueChart({ data, loading }: RevenueChartProps) {
  const chartData = data ?? generateMockData();
  const maxAmount = Math.max(...chartData.map(d => d.amount));
  const totalRevenue = chartData.reduce((sum, d) => sum + d.amount, 0);

  if (loading) {
    return <Skeleton className="h-80 rounded-2xl" />;
  }

  return (
    <div className="gpw-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gpw-text-muted mb-1">Total Revenue (30 days)</p>
          <p className="text-3xl font-bold gpw-text-gradient">
            ${(totalRevenue / 100).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {['7D', '30D', '90D', '1Y'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === '30D'
                  ? 'bg-gpw-purple-600 text-white'
                  : 'text-gpw-text-muted hover:bg-gpw-purple-500/10'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="h-48 flex items-end gap-1">
        {chartData.map((point, index) => {
          const height = (point.amount / maxAmount) * 100;
          return (
            <div
              key={point.date}
              className="flex-1 group relative"
            >
              <div
                className="w-full rounded-t transition-all duration-300 bg-gradient-to-t from-gpw-purple-600 to-gpw-pink-500 opacity-70 hover:opacity-100"
                style={{ height: `${height}%` }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gpw-surface-raised rounded-lg shadow-gpw-lg px-3 py-2 text-xs whitespace-nowrap">
                  <p className="font-semibold">${(point.amount / 100).toFixed(2)}</p>
                  <p className="text-gpw-text-muted">
                    {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-gpw-text-muted">
        <span>
          {new Date(chartData[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span>
          {new Date(chartData[chartData.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}





