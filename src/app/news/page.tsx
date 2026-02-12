'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  source: string;
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      setError('');
      try {
        const query = category === 'All' ? '' : `?category=${encodeURIComponent(category)}`;
        const res = await fetch(`/api/news${query}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json?.success || !Array.isArray(json?.data)) {
          throw new Error('Failed to load news');
        }
        setItems(json.data);
      } catch (e) {
        setError('Unable to load updates right now.');
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [category]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((item) => item.category)))], [items]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/collegechalo-logo.png" alt="College Chalo" className="h-9 w-auto bg-white rounded px-2 py-1" />
            <h1 className="text-2xl font-semibold tracking-tight">College Chalo</h1>
          </div>
          <ul className="flex gap-6">
            <li><Link href="/colleges" className="text-slate-200 hover:text-white">Colleges</Link></li>
            <li><Link href="/compare" className="text-slate-200 hover:text-white">Compare</Link></li>
            <li><Link href="/news" className="text-white font-semibold">News</Link></li>
            <li><Link href="/quiz" className="text-slate-200 hover:text-white">Quiz</Link></li>
          </ul>
        </nav>
      </header>

      <section className="bg-gradient-to-r from-slate-900 to-indigo-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Admission News & Updates</h2>
          <p className="mt-3 text-slate-100 max-w-3xl">
            Track timely updates, counselling tips, exam planning, and practical admission guides.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white border border-slate-300 rounded-2xl p-5 mb-6">
            <label className="text-sm font-semibold text-slate-700 mr-3">Filter by category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {loading && <p className="text-slate-600">Loading updates...</p>}
          {error && <p className="text-rose-700">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {items.map((item) => (
                <article key={item.id} className="bg-white border border-slate-300 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full">{item.category}</span>
                    <span className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">{item.summary}</p>
                  <p className="text-xs text-slate-500 mt-4">Source: {item.source}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

