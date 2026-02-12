'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Could not send your message.');
      }
      setStatus('success');
      setStatusMessage(json.message || 'Message sent successfully.');
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err?.message || 'Could not send your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <img src="/collegechalo-logo.png" alt="College Chalo" className="h-9 w-auto bg-white rounded px-2 py-1" />
            <h1 className="text-3xl font-bold"><a href="/">College Chalo</a></h1>
          </div>
        </nav>
      </header>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-12 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-slate-700">support@collegechalo.com</p>
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-slate-700">+91 1234567890</p>
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-slate-700">New Delhi, India</p>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={submit} className="space-y-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-700 text-white px-8 py-2 rounded-lg hover:bg-indigo-600 disabled:bg-slate-300 disabled:text-slate-700"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                {status !== 'idle' && (
                  <p className={`text-sm ${status === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {statusMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 College Chalo. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

