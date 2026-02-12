'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type LeadForm = {
  name: string;
  email: string;
  mobile: string;
  state: string;
};

const DISMISS_KEY = 'lead_popup_dismissed_until';
const SUBMITTED_KEY = 'lead_popup_submitted';

export default function LeadCapturePopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [form, setForm] = useState<LeadForm>({
    name: '',
    email: '',
    mobile: '',
    state: '',
  });

  const blockedPaths = useMemo(
    () => ['/dashboard', '/admin', '/auth/login', '/auth/register'],
    []
  );

  useEffect(() => {
    if (!pathname) return;
    if (blockedPaths.some((prefix) => pathname.startsWith(prefix))) {
      setShowLauncher(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      setShowLauncher(false);
      return;
    }

    const forceOpen = new URLSearchParams(window.location.search).get('lead') === '1';
    const alreadySubmitted = localStorage.getItem(SUBMITTED_KEY) === '1';
    setShowLauncher(!alreadySubmitted);
    if (forceOpen) {
      setVisible(true);
      return;
    }

    if (alreadySubmitted) return;

    const dismissedUntil = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedUntil > Date.now()) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 15000);

    return () => window.clearTimeout(timer);
  }, [pathname, blockedPaths]);

  const closeForToday = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
    setVisible(false);
  };

  const updateField = (field: keyof LeadForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: '15s-popup',
          path: pathname || '',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Unable to submit details.');
      }

      localStorage.setItem(SUBMITTED_KEY, '1');
      setStatus('success');
      setStatusMessage('Thanks. Our team will contact you shortly.');
      setForm({ name: '', email: '', mobile: '', state: '' });

      window.setTimeout(() => {
        setVisible(false);
      }, 900);
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible && !showLauncher) return null;

  return (
    <>
      {!visible && showLauncher && (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="fixed bottom-5 right-5 z-[999] rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-600"
        >
          Need Help?
        </button>
      )}
      {visible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Need Help Choosing a College?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Share your details and our team will contact you.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForToday}
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Full name"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Email address"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
              />
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => updateField('mobile', e.target.value)}
                placeholder="Mobile number"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="State"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white transition hover:bg-indigo-600 disabled:bg-slate-300 disabled:text-slate-700"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>

              {status !== 'idle' && (
                <p className={`text-sm ${status === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
