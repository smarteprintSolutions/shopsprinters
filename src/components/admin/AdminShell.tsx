'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/chat', label: 'Chat', icon: '💬' },
  // Settings route removed per request
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [todayLabel, setTodayLabel] = useState('Loading...');

  useEffect(() => {
    setTodayLabel(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  }, []);

  const activeLabel = useMemo(() => {
    const match = navItems.find((item) => pathname?.startsWith(item.href));
    return match?.label ?? 'Admin';
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-[#111827] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-24 items-center justify-between border-b border-white/10 px-6">
            <div>
              <p className="text-lg font-semibold tracking-tight">ShopsPrinters</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
            <button className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 lg:hidden" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <nav className="space-y-1 px-4 py-6">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-[#ff2d46] text-white shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-6">
            <button
              onClick={() => {
                document.cookie = 'admin-auth=; path=/; max-age=0';
                document.cookie = 'auth_token=; path=/; max-age=0';
                window.location.href = '/admin/login';
              }}
              className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/20"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {isOpen ? <button className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setIsOpen(false)} /> : null}

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden" onClick={() => setIsOpen(true)}>
                  ☰
                </button>
                <div>
                  <p className="text-sm font-medium text-slate-400">Admin / {activeLabel}</p>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900">{activeLabel}</h1>
                </div>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                {todayLabel}
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
