'use client';

import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadChats = async () => {
      try {
        const timestamp = Date.now();
        const res = await fetch(`/api/chats?_t=${timestamp}`, { cache: 'no-store' });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error || 'Unable to load chats');
        setChats(payload?.data?.chats ?? payload?.chats ?? []);
      } catch (err: any) {
        const message = err?.message || 'Unable to load chats';
        setError(message.includes('401') ? 'Chat history is currently unavailable. Please sign in again.' : message);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Customer Chat</h2>
        <p className="mt-2 text-sm text-slate-500">Review conversations and reply to store inquiries.</p>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</div> : null}

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-400">Loading chat threads...</div>
        ) : chats.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-400">No active chats yet.</div>
        ) : chats.map((chat) => (
          <div key={chat._id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{chat.user?.name || chat.user?.email || 'Customer'}</p>
                <p className="text-sm text-slate-500">{chat.user?.email || ''}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{chat.status}</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{chat.lastMessage || 'No messages yet.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
