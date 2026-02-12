'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type AdminCollege = {
  id: string;
  name: string;
  location: string;
  state?: string;
  founded: number;
  ranking: number;
  fees: number;
  placement_rate: number;
  rating: number;
  description: string;
  courses: string[] | string;
  reviews_count: number;
  image_url: string;
  type: string;
  website?: string;
};

const EMPTY_FORM: Omit<AdminCollege, 'id'> = {
  name: '',
  location: '',
  state: '',
  founded: 2000,
  ranking: 999,
  fees: 0,
  placement_rate: 0,
  rating: 0,
  description: '',
  courses: '',
  reviews_count: 0,
  image_url: '',
  type: 'Government',
  website: '',
};

export default function AdminCollegesPage() {
  const [token, setToken] = useState('');
  const [items, setItems] = useState<AdminCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('adminToken') || '';
    if (!t) {
      window.location.href = '/admin/login';
      return;
    }
    setToken(t);
  }, []);

  const load = async (authToken: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/colleges', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const json = await res.json();
      if (!res.ok || !json?.success || !Array.isArray(json?.data)) {
        throw new Error(json?.error || 'Failed to load colleges');
      }
      setItems(json.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.state || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {
        ...form,
        courses: typeof form.courses === 'string' ? form.courses : form.courses.join(','),
      };
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch('/api/admin/colleges', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Operation failed');

      setStatus(editingId ? 'College updated.' : 'College created.');
      setEditingId('');
      setForm(EMPTY_FORM);
      load(token);
    } catch (err: any) {
      setError(err?.message || 'Operation failed');
    }
  };

  const onEdit = (item: AdminCollege) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      location: item.location,
      state: item.state || '',
      founded: Number(item.founded || 2000),
      ranking: Number(item.ranking || 999),
      fees: Number(item.fees || 0),
      placement_rate: Number(item.placement_rate || 0),
      rating: Number(item.rating || 0),
      description: item.description || '',
      courses: Array.isArray(item.courses) ? item.courses.join(', ') : item.courses || '',
      reviews_count: Number(item.reviews_count || 0),
      image_url: item.image_url || '',
      type: item.type || 'Government',
      website: item.website || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this college?');
    if (!ok) return;
    setStatus('');
    setError('');
    try {
      const res = await fetch(`/api/admin/colleges?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Delete failed');
      setStatus('College deleted.');
      load(token);
    } catch (err: any) {
      setError(err?.message || 'Delete failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/collegechalo-logo.png" alt="College Chalo" className="h-9 w-auto bg-white rounded px-2 py-1" />
            <h1 className="text-2xl font-semibold tracking-tight">Admin Colleges</h1>
          </div>
          <ul className="flex gap-6 items-center">
            <li><Link href="/" className="text-slate-200 hover:text-white">Home</Link></li>
            <li><Link href="/colleges" className="text-slate-200 hover:text-white">Public Colleges</Link></li>
            <li><Link href="/admin/analytics" className="text-slate-200 hover:text-white">Analytics</Link></li>
            <li><Link href="/admin/system-health" className="text-slate-200 hover:text-white">System Health</Link></li>
            <li><button onClick={logout} className="text-slate-200 hover:text-white">Logout</button></li>
          </ul>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white border border-slate-300 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit College' : 'Create College'}</h2>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="border border-slate-300 rounded-lg px-3 py-2" />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" required className="border border-slate-300 rounded-lg px-3 py-2" />
            <input value={form.state || ''} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="border border-slate-300 rounded-lg px-3 py-2" />
            <input type="number" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: Number(e.target.value) })} placeholder="Ranking" className="border border-slate-300 rounded-lg px-3 py-2" />
            <input type="number" value={form.founded} onChange={(e) => setForm({ ...form, founded: Number(e.target.value) })} placeholder="Founded" className="border border-slate-300 rounded-lg px-3 py-2" />
            <input type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: Number(e.target.value) })} placeholder="Fees" className="border border-slate-300 rounded-lg px-3 py-2" />
            <input type="number" value={form.placement_rate} onChange={(e) => setForm({ ...form, placement_rate: Number(e.target.value) })} placeholder="Placement %" className="border border-slate-300 rounded-lg px-3 py-2" />
            <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} placeholder="Rating" className="border border-slate-300 rounded-lg px-3 py-2" />
            <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type (Government/Private)" className="border border-slate-300 rounded-lg px-3 py-2" />
            <input value={String(form.courses)} onChange={(e) => setForm({ ...form, courses: e.target.value })} placeholder="Courses (comma separated)" className="md:col-span-2 border border-slate-300 rounded-lg px-3 py-2" />
            <input value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Website" className="border border-slate-300 rounded-lg px-3 py-2" />
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="md:col-span-3 border border-slate-300 rounded-lg px-3 py-2" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-3 border border-slate-300 rounded-lg px-3 py-2 min-h-24" />
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" className="bg-indigo-700 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg">
                {editingId ? 'Update College' : 'Create College'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId('');
                    setForm(EMPTY_FORM);
                  }}
                  className="border border-slate-300 px-5 py-2.5 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {status && <p className="text-sm text-emerald-700 mt-3">{status}</p>}
          {error && <p className="text-sm text-rose-700 mt-3">{error}</p>}
        </div>

        <div className="bg-white border border-slate-300 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold">Manage Colleges ({filtered.length})</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name/state/location"
              className="border border-slate-300 rounded-lg px-3 py-2 w-full md:w-80"
            />
          </div>
          {loading ? (
            <p className="text-slate-600">Loading colleges...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-300">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="text-left p-2 border border-slate-300">Name</th>
                    <th className="text-left p-2 border border-slate-300">Location</th>
                    <th className="text-left p-2 border border-slate-300">Rank</th>
                    <th className="text-left p-2 border border-slate-300">Fees</th>
                    <th className="text-left p-2 border border-slate-300">Placement</th>
                    <th className="text-left p-2 border border-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="odd:bg-white even:bg-slate-50">
                      <td className="p-2 border border-slate-300">{item.name}</td>
                      <td className="p-2 border border-slate-300">{item.location}</td>
                      <td className="p-2 border border-slate-300">#{item.ranking}</td>
                      <td className="p-2 border border-slate-300">₹{Number(item.fees).toLocaleString('en-IN')}</td>
                      <td className="p-2 border border-slate-300">{item.placement_rate}%</td>
                      <td className="p-2 border border-slate-300">
                        <div className="flex gap-2">
                          <button onClick={() => onEdit(item)} className="px-3 py-1.5 text-sm bg-indigo-700 text-white rounded">Edit</button>
                          <button onClick={() => onDelete(item.id)} className="px-3 py-1.5 text-sm bg-rose-600 text-white rounded">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
