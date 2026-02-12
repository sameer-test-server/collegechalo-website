'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@collegechalo.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        setError(json?.error || 'Login failed');
        return;
      }

      localStorage.setItem('adminToken', json.token);
      localStorage.setItem('adminUser', JSON.stringify(json.user));
      window.location.href = '/admin/colleges';
    } catch (err) {
      setError('Could not login right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/collegechalo-logo.png" alt="College Chalo" className="h-9 w-auto bg-white rounded px-2 py-1" />
          <h1 className="text-2xl font-semibold text-slate-900">Admin Panel</h1>
        </div>
        <p className="text-sm text-slate-600 text-center mb-6">Sign in as administrator to manage data.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="Enter admin password"
            />
          </div>

          {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-lg disabled:bg-slate-300 disabled:text-slate-600"
          >
            {loading ? 'Signing in...' : 'Admin Sign In'}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">
          Default dev admin: <span className="font-semibold">admin@collegechalo.com</span>
        </p>
        <Link href="/" className="block text-sm text-indigo-700 hover:underline mt-3">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

