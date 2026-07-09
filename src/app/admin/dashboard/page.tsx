'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  ShoppingBagIcon,
  SparklesIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalOrders?: number;
  totalUsers?: number;
  totalProducts?: number;
  revenue?: number;
  paidOrders?: number;
  deliveredOrders?: number;
  recentOrders?: Array<any>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

const statusStyles: Record<string, string> = {
  Processing: 'border-blue-200 bg-blue-50 text-blue-700',
  Shipped: 'border-violet-200 bg-violet-50 text-violet-700',
  Delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Cancelled: 'border-rose-200 bg-rose-50 text-rose-700',
};

export default function DashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const timestamp = Date.now();
        const res = await fetch(`/api/dashboard/analytics?_t=${timestamp}`, { cache: 'no-store' });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Failed to load analytics');
        setAnalytics(payload.data ?? payload);
      } catch (err: any) {
        setError(err.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: 'Revenue',
        value: formatCurrency(analytics?.revenue || 0),
        hint: 'Gross sales',
        icon: CurrencyDollarIcon,
        accent: 'bg-emerald-50 text-emerald-700',
      },
      {
        label: 'Orders',
        value: analytics?.totalOrders?.toString() ?? '0',
        hint: 'Total orders',
        icon: ShoppingBagIcon,
        accent: 'bg-sky-50 text-sky-700',
      },
      {
        label: 'Customers',
        value: analytics?.totalUsers?.toString() ?? '0',
        hint: 'Registered users',
        icon: UsersIcon,
        accent: 'bg-violet-50 text-violet-700',
      },
      {
        label: 'Products',
        value: analytics?.totalProducts?.toString() ?? '0',
        hint: 'Live inventory',
        icon: ChartBarIcon,
        accent: 'bg-amber-50 text-amber-700',
      },
    ],
    [analytics]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 rounded-[32px] border border-slate-200 bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151] p-8 text-white shadow-xl lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Operations center</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back, Admin</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Monitor sales, orders, products, and shopper activity from one polished control panel.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <CalendarDaysIcon className="h-4 w-4 text-[#ff2d46]" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <Link href="/admin/products" className="rounded-2xl bg-[#ff2d46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e6283e]">
            + Add Product
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className={`inline-flex rounded-2xl p-3 ${item.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Live</span>
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
              <p className="text-sm text-slate-500">Latest storefront activity</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admin/orders')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#ff2d46] hover:text-[#ff2d46]"
            >
              View all
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-rose-500">
                      {error}
                    </td>
                  </tr>
                ) : (analytics?.recentOrders || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  (analytics?.recentOrders || []).map((order: any) => (
                    <tr key={order._id} className="border-t border-slate-100">
                      <td className="px-6 py-4 font-medium text-slate-700">#{String(order._id).slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{order.user?.name || order.user?.email || 'Guest'}</p>
                        <p className="text-xs text-slate-400">{order.user?.email || ''}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">${(order.totalPrice || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[order.status] || 'border-slate-200 bg-slate-100 text-slate-600'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">System Status</h3>
                <p className="text-sm text-slate-500">Key operational metrics</p>
              </div>
              <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                <SparklesIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: 'Paid Orders', value: analytics?.paidOrders ?? 0, href: '/admin/orders' },
                { label: 'Delivered Orders', value: analytics?.deliveredOrders ?? 0, href: '/admin/analytics' },
                { label: 'Active Chat Queue', value: 'Live', href: '/admin/chat' },
              ].map((card) => (
                <Link key={card.label} href={card.href} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-[#ff2d46] hover:bg-white">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{card.value}</p>
                  </div>
                  <ArrowUpRightIcon className="h-5 w-5 text-[#ff2d46]" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-[#111827] p-6 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <ClockIcon className="h-5 w-5 text-[#ff2d46]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">ShopsPrinters Support</h3>
                <p className="text-sm text-slate-400">Fast help for orders, setup, and printer support</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 text-[#ff2d46]" />
                <span>17807 Lakecrest View Drive, Cypress, TX 77433</span>
              </div>
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="mt-0.5 h-5 w-5 text-[#ff2d46]" />
                <span>support@shopsprinters.com</span>
              </div>
              <div className="flex items-start gap-3">
                <GlobeAltIcon className="mt-0.5 h-5 w-5 text-[#ff2d46]" />
                <span>www.shopsprinters.com</span>
              </div>
            </div>

            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#ff2d46] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e6283e]">
              Open support center
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
