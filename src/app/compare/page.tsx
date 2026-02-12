'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type College = {
  id: string;
  name: string;
  location: string;
  state?: string;
  type?: string;
  founded: number;
  ranking: number;
  fees: number;
  placement_rate: number;
  description: string;
  courses: string[];
  reviews_count: number;
  rating: number;
  image_url: string;
};

const MAX_COMPARE = 3;

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function metricValue(college: College, key: string) {
  switch (key) {
    case 'ranking':
      return `#${college.ranking}`;
    case 'location':
      return college.location;
    case 'founded':
      return String(college.founded);
    case 'fees':
      return formatINR(college.fees);
    case 'placement_rate':
      return `${college.placement_rate}%`;
    case 'rating':
      return `${college.rating}/5`;
    case 'reviews_count':
      return String(college.reviews_count);
    case 'type':
      return college.type || '-';
    case 'courses':
      return college.courses.join(', ');
    default:
      return '-';
  }
}

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    async function loadColleges() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/colleges', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json?.success || !Array.isArray(json?.data)) {
          throw new Error(json?.error || 'Failed to load colleges');
        }
        setColleges(json.data);
      } catch (e) {
        setError('Could not load colleges for comparison.');
      } finally {
        setLoading(false);
      }
    }
    loadColleges();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const queryIds = (params.get('ids') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, MAX_COMPARE);

    if (queryIds.length > 0) {
      setSelectedIds(queryIds);
    }
  }, []);

  const filteredColleges = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return colleges;
    return colleges.filter(
      (college) =>
        college.name.toLowerCase().includes(q) ||
        college.location.toLowerCase().includes(q) ||
        (college.state || '').toLowerCase().includes(q)
    );
  }, [colleges, search]);

  const selectedColleges = useMemo(() => {
    return selectedIds
      .map((id) => colleges.find((college) => college.id === id))
      .filter(Boolean) as College[];
  }, [selectedIds, colleges]);

  const updateSelected = (index: number, id: string) => {
    const next = [...selectedIds];
    next[index] = id;
    const cleaned = next.filter(Boolean);
    const unique = Array.from(new Set(cleaned));
    setSelectedIds(unique.slice(0, MAX_COMPARE));
  };

  const clearAll = () => {
    setSelectedIds([]);
    setShareMessage('');
  };

  const exportPdf = () => {
    if (selectedColleges.length < 2) return;

    const date = new Date().toLocaleString('en-IN');
    const headers = selectedColleges.map((c) => `<th>${c.name}</th>`).join('');
    const rows = [
      ['NIRF / Internal Rank', 'ranking'],
      ['Location', 'location'],
      ['Founded', 'founded'],
      ['Annual Fees', 'fees'],
      ['Placement Rate', 'placement_rate'],
      ['Rating', 'rating'],
      ['Reviews', 'reviews_count'],
      ['Type', 'type'],
      ['Courses', 'courses'],
    ]
      .map(
        ([label, key]) =>
          `<tr><td>${label}</td>${selectedColleges
            .map((college) => `<td>${metricValue(college, key)}</td>`)
            .join('')}</tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>College Comparison Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    p { margin: 0 0 16px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; vertical-align: top; }
    th { background: #e2e8f0; }
    td:first-child { background: #f8fafc; font-weight: 600; width: 220px; }
  </style>
</head>
<body>
  <h1>College Chalo - Comparison Report</h1>
  <p>Generated on ${date}</p>
  <table>
    <thead><tr><th>Metric</th>${headers}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1024,height=720');
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const shareComparison = async () => {
    if (selectedIds.length < 2) return;
    const url = `${window.location.origin}/compare?ids=${encodeURIComponent(selectedIds.join(','))}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'College Chalo Comparison',
          text: 'Check this college comparison',
          url,
        });
        setShareMessage('Comparison link shared.');
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareMessage('Comparison link copied to clipboard.');
    } catch (e) {
      setShareMessage('Could not share the comparison link.');
    }
  };

  const metricRows = [
    { label: 'NIRF / Internal Rank', key: 'ranking' },
    { label: 'Location', key: 'location' },
    { label: 'Founded', key: 'founded' },
    { label: 'Annual Fees', key: 'fees' },
    { label: 'Placement Rate', key: 'placement_rate' },
    { label: 'Rating', key: 'rating' },
    { label: 'Reviews', key: 'reviews_count' },
    { label: 'Type', key: 'type' },
    { label: 'Courses', key: 'courses' },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/collegechalo-logo.png" alt="College Chalo" className="h-9 w-auto bg-white rounded px-2 py-1" />
              <h1 className="text-2xl font-semibold tracking-tight">College Chalo</h1>
            </div>
            <ul className="flex gap-6">
              <li><a href="/colleges" className="text-slate-200 hover:text-white">Colleges</a></li>
              <li><a href="/students" className="text-slate-200 hover:text-white">Students</a></li>
              <li><a href="/compare" className="text-white font-semibold">Compare</a></li>
              <li><a href="/news" className="text-slate-200 hover:text-white">News</a></li>
              <li><a href="/quiz" className="text-slate-200 hover:text-white">Quiz</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <section className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Compare Colleges Side-by-Side</h2>
          <p className="mt-3 text-slate-100 max-w-3xl">
            Select up to {MAX_COMPARE} colleges and evaluate fees, placement, ranking, ratings, and courses in one view.
            Export as PDF for counselling discussions.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="bg-white border border-slate-300 rounded-2xl p-5">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold">Build Comparison</h3>
                <p className="text-sm text-slate-600 mt-1">Pick at least 2 colleges for PDF export and sharing.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportPdf}
                  disabled={selectedColleges.length < 2}
                  className="px-4 py-2 rounded-lg bg-indigo-700 text-white font-semibold disabled:bg-slate-300 disabled:text-slate-600"
                >
                  Export PDF
                </button>
                <button
                  onClick={shareComparison}
                  disabled={selectedColleges.length < 2}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold disabled:bg-slate-300 disabled:text-slate-600"
                >
                  Share
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 font-semibold"
                >
                  Clear
                </button>
              </div>
            </div>
            {shareMessage && <p className="text-sm text-emerald-700 mt-3">{shareMessage}</p>}
          </div>

          <div className="bg-white border border-slate-300 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <h3 className="text-xl font-semibold">Select Colleges</h3>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by college or location..."
                className="w-full md:w-80 border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>

            {loading && <p className="text-slate-600">Loading colleges...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Array.from({ length: MAX_COMPARE }).map((_, idx) => (
                  <select
                    key={idx}
                    value={selectedIds[idx] || ''}
                    onChange={(e) => updateSelected(idx, e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select college {idx + 1}</option>
                    {filteredColleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name} ({college.location})
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            )}
          </div>

          {selectedColleges.length > 0 && (
            <div className="bg-white border border-slate-300 rounded-2xl p-5 overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4">Comparison Table</h3>
              <table className="min-w-full border border-slate-300">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="text-left p-3 border border-slate-300 min-w-48">Metric</th>
                    {selectedColleges.map((college) => (
                      <th key={college.id} className="text-left p-3 border border-slate-300 min-w-72">
                        <div className="space-y-1">
                          <Link href={`/colleges/${college.id}`} className="text-indigo-700 font-semibold hover:underline">
                            {college.name}
                          </Link>
                          <p className="text-xs text-slate-500">{college.location}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metricRows.map((row) => (
                    <tr key={row.key} className="odd:bg-white even:bg-slate-50">
                      <td className="p-3 border border-slate-300 font-semibold">{row.label}</td>
                      {selectedColleges.map((college) => (
                        <td key={`${college.id}-${row.key}`} className="p-3 border border-slate-300 text-sm text-slate-700">
                          {metricValue(college, row.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 College Chalo. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
