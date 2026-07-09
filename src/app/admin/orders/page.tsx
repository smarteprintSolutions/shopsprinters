'use client';

import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const timestamp = Date.now();
        const res = await fetch(`/api/orders?_t=${timestamp}`, { cache: 'no-store' });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Unable to load orders');
        setOrders(payload.data?.orders ?? payload.orders ?? []);
      } catch (err: any) {
        setError(err.message || 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Orders</h2>
        <p className="mt-2 text-sm text-slate-500">Track order status, totals, and customer details.</p>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Loading orders...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-rose-500">{error}</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No orders found.</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-semibold text-slate-800">#{String(order._id).slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{order.user?.name || order.user?.email || 'Guest'}</p>
                    <p className="text-xs text-slate-500">{order.user?.email || ''}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.orderItems?.length || 0}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">${(order.totalPrice || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
