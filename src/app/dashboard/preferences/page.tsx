'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../../components/dashboard/Sidebar';

type Preferences = {
  preferredStates: string[];
  preferredType: 'Any' | 'Government' | 'Private';
  maxFees: number;
  minPlacement: number;
  preferredCourse: string;
};

type SavedStatus = 'idle' | 'success' | 'error';

const DEFAULTS: Preferences = {
  preferredStates: [],
  preferredType: 'Any',
  maxFees: 300000,
  minPlacement: 70,
  preferredCourse: '',
};

const COURSE_OPTIONS = ['B.Tech', 'MBBS', 'BDS', 'B.Sc', 'MBA', 'BBA', 'LLB', 'Design'];
const POPULAR_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

const PRESET_FILTERS: Array<{ label: string; values: Preferences }> = [
  {
    label: 'Affordable Focus',
    values: { preferredStates: [], preferredType: 'Any', maxFees: 200000, minPlacement: 65, preferredCourse: '' },
  },
  {
    label: 'Government Priority',
    values: { preferredStates: [], preferredType: 'Government', maxFees: 300000, minPlacement: 75, preferredCourse: 'B.Tech' },
  },
  {
    label: 'Top Placement',
    values: { preferredStates: [], preferredType: 'Any', maxFees: 500000, minPlacement: 90, preferredCourse: '' },
  },
];

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PreferencesPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [form, setForm] = useState<Preferences>(DEFAULTS);
  const [stateInput, setStateInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<SavedStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    fetch('/api/preferences', { headers: { Authorization: token } })
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setForm({
            preferredStates: json.data.preferredStates || [],
            preferredType: json.data.preferredType || 'Any',
            maxFees: Number(json.data.maxFees) || DEFAULTS.maxFees,
            minPlacement: Number(json.data.minPlacement) || DEFAULTS.minPlacement,
            preferredCourse: json.data.preferredCourse || '',
          });
        }
      })
      .catch(() => {
        setStatus('error');
        setStatusMessage('Could not load saved preferences.');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const save = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSaving(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error('Save failed');

      setStatus('success');
      setStatusMessage('Preferences saved. Recommendations will use this profile.');
    } catch (e) {
      setStatus('error');
      setStatusMessage('Could not save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addState = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    if (form.preferredStates.includes(normalized)) return;
    setForm((prev) => ({ ...prev, preferredStates: [...prev.preferredStates, normalized] }));
    setStateInput('');
  };

  const removeState = (state: string) => {
    setForm((prev) => ({ ...prev, preferredStates: prev.preferredStates.filter((x) => x !== state) }));
  };

  const summary = useMemo(() => {
    const stateText = form.preferredStates.length > 0 ? form.preferredStates.join(', ') : 'Any state';
    const courseText = form.preferredCourse || 'Any course';
    return `${form.preferredType} colleges, ${courseText}, max ${formatINR(form.maxFees)}, min placement ${form.minPlacement}% in ${stateText}.`;
  }, [form]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 font-semibold">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <DashboardSidebar
        activePath="/dashboard/preferences"
        onLogout={handleLogout}
        userName={user?.name}
        userEmail={user?.email}
      />

      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Recommendation Preferences</h1>
            <p className="text-slate-600 mt-1">
              Configure once and get cleaner recommendations across dashboard, compare, and quiz.
            </p>
          </div>

          {status !== 'idle' && (
            <div
              className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                status === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              {statusMessage}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white border border-slate-300 rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Quick Presets</h2>
                <p className="text-sm text-slate-600 mt-1">Start with a template and adjust as needed.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {PRESET_FILTERS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setForm(preset.values)}
                      className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-semibold"
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setForm(DEFAULTS)}
                    className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Preferred college type</span>
                    <select
                      value={form.preferredType}
                      onChange={(e) => setForm((prev) => ({ ...prev, preferredType: e.target.value as Preferences['preferredType'] }))}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option value="Any">Any</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Preferred course</span>
                    <select
                      value={form.preferredCourse}
                      onChange={(e) => setForm((prev) => ({ ...prev, preferredCourse: e.target.value }))}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Any course</option>
                      {COURSE_OPTIONS.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Maximum annual fees</span>
                    <span className="text-sm font-semibold text-indigo-700">{formatINR(form.maxFees)}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={1000000}
                    step={10000}
                    value={form.maxFees}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxFees: Number(e.target.value) }))}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-xs text-slate-500 mt-1">Range: ₹50,000 to ₹10,00,000</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Minimum placement target</span>
                    <span className="text-sm font-semibold text-indigo-700">{form.minPlacement}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    step={1}
                    value={form.minPlacement}
                    onChange={(e) => setForm((prev) => ({ ...prev, minPlacement: Number(e.target.value) }))}
                    className="w-full accent-indigo-600"
                  />
                  <p className="text-xs text-slate-500 mt-1">Higher values favor stronger placement records.</p>
                </div>
              </div>

              <div className="bg-white border border-slate-300 rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Preferred States</h2>
                <p className="text-sm text-slate-600 mt-1">Add states manually or pick from quick suggestions.</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {POPULAR_STATES.map((state) => (
                    <button
                      key={state}
                      onClick={() => addState(state)}
                      className="px-3 py-1.5 rounded-full border border-slate-300 text-sm font-medium hover:bg-slate-50"
                    >
                      + {state}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <input
                    value={stateInput}
                    onChange={(e) => setStateInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addState(stateInput);
                      }
                    }}
                    placeholder="Type a state and press Enter"
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={() => addState(stateInput)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {form.preferredStates.length === 0 && <p className="text-sm text-slate-500">No preferred states selected yet.</p>}
                  {form.preferredStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => removeState(state)}
                      className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium"
                    >
                      {state} ×
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-300 rounded-2xl p-6">
                <h2 className="text-lg font-semibold">Current Summary</h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{summary}</p>
              </div>

              <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-3">
                <button
                  onClick={save}
                  disabled={saving}
                  className="w-full px-5 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-semibold disabled:bg-slate-300 disabled:text-slate-600"
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
                <Link
                  href="/dashboard/recommendations"
                  className="block w-full text-center px-5 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Recommendations
                </Link>
                <Link
                  href="/dashboard/quiz"
                  className="block w-full text-center px-5 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Open Discovery Quiz
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
