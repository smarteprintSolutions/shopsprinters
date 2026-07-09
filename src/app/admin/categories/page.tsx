'use client';

import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      const res = await fetch(`/api/categories?_t=${timestamp}`, { cache: 'no-store' });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Unable to load categories');
      setCategories(
        Array.isArray(payload.data) 
          ? payload.data 
          : (payload.data?.categories ?? payload.categories ?? [])
      );
    } catch (err: any) {
      setError(err.message || 'Unable to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, image }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Unable to save category');
      setName('');
      setDescription('');
      setImage('');
      await loadCategories();
    } catch (err: any) {
      setError(err.message || 'Unable to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Categories</h2>
        <p className="mt-2 text-sm text-slate-500">Organize products into printer categories.</p>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</div> : null}

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
        <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        <textarea className="rounded-2xl border border-slate-200 px-4 py-3 lg:col-span-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        <button type="submit" disabled={saving} className="rounded-2xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70 lg:col-span-2">{saving ? 'Saving...' : 'Create Category'}</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center text-slate-400">Loading categories...</div>
        ) : categories.map((category) => (
          <div key={category._id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{category.description || 'No description provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
