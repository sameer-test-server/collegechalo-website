'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type AnalyticsData = {
  totalUsers: number;
  adminUsers: number;
  studentUsers: number;
  newUsers7d: number;
  totalApplications: number;
  applicationStatus: {
    pending: number;
    accepted: number;
    rejected: number;
    submitted: number;
    waitlisted: number;
  };
  conversionRate: number;
};

export default function AdminAnalyticsPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('adminToken') || '';
    if (!t) {
      window.location.href = '/admin/login';
      return;
    }
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');
    fetch('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json?.success) throw new Error(json?.error || 'Failed to load analytics');
        setData(json.data);
      })
      .catch((err) => setError(err?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [token]);

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
            <h1 className="text-2xl font-semibold tracking-tight">Admin Analytics</h1>
          </div>
          <ul className="flex gap-6 items-center">
            <li><Link href="/admin/colleges" className="text-slate-200 hover:text-white">Colleges</Link></li>
            <li><Link href="/admin/analytics" className="text-white font-semibold">Analytics</Link></li>
            <li><Link href="/admin/system-health" className="text-slate-200 hover:text-white">System Health</Link></li>
            <li><button onClick={logout} className="text-slate-200 hover:text-white">Logout</button></li>
          </ul>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {loading && <p className="text-slate-600">Loading analytics...</p>}
        {error && <p className="text-rose-700">{error}</p>}

        {!loading && data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard label="Total Users" value={String(data.totalUsers)} />
              <MetricCard label="Students" value={String(data.studentUsers)} />
              <MetricCard label="Admins" value={String(data.adminUsers)} />
              <MetricCard label="New Users (7d)" value={String(data.newUsers7d)} />
              <MetricCard label="Total Applications" value={String(data.totalApplications)} />
              <MetricCard label="Applications / User" value={`${data.conversionRate}%`} />
            </div>

            <div className="bg-white border border-slate-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Application Status Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <StatusCard label="Pending" value={data.applicationStatus.pending} color="text-amber-700" />
                <StatusCard label="Submitted" value={data.applicationStatus.submitted} color="text-indigo-700" />
                <StatusCard label="Accepted" value={data.applicationStatus.accepted} color="text-emerald-700" />
                <StatusCard label="Rejected" value={data.applicationStatus.rejected} color="text-rose-700" />
                <StatusCard label="Waitlisted" value={data.applicationStatus.waitlisted} color="text-slate-700" />
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl p-5">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function StatusCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

