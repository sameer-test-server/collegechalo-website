'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type HealthData = {
  app: string;
  timestamp: string;
  uptimeSeconds: number;
  nodeVersion: string;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers?: number;
  };
  env: {
    nodeEnv: string;
    mongoConfigured: boolean;
  };
  mongodb: {
    status: string;
    latencyMs: number | null;
  };
};

function formatMB(value: number) {
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminSystemHealthPage() {
  const [token, setToken] = useState('');
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const load = () => {
      setLoading(true);
      fetch('/api/admin/health', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((json) => {
          if (!json?.success) throw new Error(json?.error || 'Failed to load health');
          setData(json.data);
          setError('');
        })
        .catch((err) => setError(err?.message || 'Failed to load health'))
        .finally(() => setLoading(false));
    };

    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
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
            <h1 className="text-2xl font-semibold tracking-tight">System Health</h1>
          </div>
          <ul className="flex gap-6 items-center">
            <li><Link href="/admin/colleges" className="text-slate-200 hover:text-white">Colleges</Link></li>
            <li><Link href="/admin/analytics" className="text-slate-200 hover:text-white">Analytics</Link></li>
            <li><Link href="/admin/system-health" className="text-white font-semibold">System Health</Link></li>
            <li><button onClick={logout} className="text-slate-200 hover:text-white">Logout</button></li>
          </ul>
        </nav>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {loading && <p className="text-slate-600">Loading system health...</p>}
        {error && <p className="text-rose-700">{error}</p>}

        {!loading && data && (
          <>
            <div className="bg-white border border-slate-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Runtime Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HealthRow label="App Status" value={data.app.toUpperCase()} />
                <HealthRow label="Timestamp" value={new Date(data.timestamp).toLocaleString()} />
                <HealthRow label="Uptime" value={`${data.uptimeSeconds}s`} />
                <HealthRow label="Node Version" value={data.nodeVersion} />
                <HealthRow label="NODE_ENV" value={data.env.nodeEnv} />
                <HealthRow label="Mongo Configured" value={data.env.mongoConfigured ? 'Yes' : 'No'} />
              </div>
            </div>

            <div className="bg-white border border-slate-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Memory Usage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HealthRow label="RSS" value={formatMB(data.memory.rss)} />
                <HealthRow label="Heap Total" value={formatMB(data.memory.heapTotal)} />
                <HealthRow label="Heap Used" value={formatMB(data.memory.heapUsed)} />
                <HealthRow label="External" value={formatMB(data.memory.external)} />
              </div>
            </div>

            <div className="bg-white border border-slate-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Database Health</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HealthRow label="MongoDB Status" value={data.mongodb.status} />
                <HealthRow
                  label="MongoDB Latency"
                  value={data.mongodb.latencyMs === null ? '-' : `${data.mongodb.latencyMs} ms`}
                />
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

