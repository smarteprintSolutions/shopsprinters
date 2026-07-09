'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const timestamp = Date.now();
        const res = await fetch(`/api/dashboard/analytics?_t=${timestamp}`, { cache: 'no-store' });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error || 'Unable to load analytics');
        setAnalytics(payload?.data ?? payload);
      } catch (err: any) {
        const message = err?.message || 'Unable to load analytics';
        setError(message.includes('401') ? 'Admin analytics are currently unavailable. Please sign in again.' : message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const stats = [
    { label: 'Revenue', value: `$${(analytics?.revenue || 0).toFixed(2)}`, detail: 'Lifetime revenue' },
    { label: 'Paid Orders', value: analytics?.paidOrders ?? 0, detail: 'Completed checkout' },
    { label: 'Delivered Orders', value: analytics?.deliveredOrders ?? 0, detail: 'Fulfilled orders' },
    { label: 'Registered Users', value: analytics?.totalUsers ?? 0, detail: 'Customer accounts' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Analytics</h2>
        <p className="mt-2 text-sm text-slate-500">Understand commerce health and operational performance.</p>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? <p className="text-sm text-slate-400">Loading analytics...</p> : <p className="text-sm text-slate-600">Analytics data is now available through the admin dashboard and order history views.</p>}
      </div>
    </div>
  );
}
