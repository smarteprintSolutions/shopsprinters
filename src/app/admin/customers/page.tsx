'use client';

import { useEffect, useState } from 'react';

export default function CustomersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const timestamp = Date.now();
        const res = await fetch(`/api/auth/users?fetchAll=true&_t=${timestamp}`, { cache: 'no-store' });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error || 'Unable to load customers');
        setUsers(payload?.data?.users ?? payload?.users ?? []);
      } catch (err: any) {
        const message = err?.message || 'Unable to load customers';
        setError(message.includes('401') ? 'Customer data is currently unavailable. Please sign in again.' : message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Customers</h2>
        <p className="mt-2 text-sm text-slate-500">Browse customer accounts and account activity.</p>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Blocked</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">Loading customers...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-rose-500">{error}</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No customers found.</td></tr>
              ) : users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-semibold text-slate-800">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-slate-600">{user.isAdmin ? 'Admin' : 'Customer'}</td>
                  <td className="px-6 py-4 text-slate-600">{user.isBlocked ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
