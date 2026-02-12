'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });

      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/90 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/collegechalo-logo.png" alt="College Chalo" className="h-8 w-auto bg-white rounded px-2 py-1" />
              <a href="/" className="text-2xl font-semibold hover:text-slate-200">College Chalo</a>
            </div>
            <div className="flex gap-4">
              <a href="/" className="text-slate-200 hover:text-white">Home</a>
              <a href="/auth/login" className="text-slate-200 hover:text-white">Login</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Register Form */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img src="/collegechalo-logo.png" alt="College Chalo" className="h-8 w-auto bg-white rounded px-2 py-1" />
          <h1 className="text-2xl font-semibold text-gray-800">College Chalo</h1>
        </div>
        <p className="text-center text-slate-600 mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              minLength={6}
              required
            />
            {formData.password && formData.password.length < 6 && (
              <p className="text-sm text-yellow-600 mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              minLength={6}
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && (
              <p className="text-sm text-green-600 mt-1">✓ Passwords match</p>
            )}
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-700 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-700 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
