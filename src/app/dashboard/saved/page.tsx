'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../../components/dashboard/Sidebar';

interface College {
  id: string;
  name: string;
  location: string;
  ranking: number;
  placement_rate: number;
  fees: number;
  rating: number;
}

export default function SavedColleges() {
  const router = useRouter();
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('savedColleges');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {

      // Fetch all colleges
      fetch('/api/colleges')
        .then(res => res.json())
        .then(data => {
          if (saved) {
            const savedIds = JSON.parse(saved);
            const saved_colleges = data.data.filter((c: College) => savedIds.includes(c.id));
            setSavedColleges(saved_colleges);
          }
        });
    } catch (e) {
      console.error('Error:', e);
      router.push('/auth/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const removeFromSaved = (collegeId: string) => {
    const saved = JSON.parse(localStorage.getItem('savedColleges') || '[]');
    const updated = saved.filter((id: string) => id !== collegeId);
    localStorage.setItem('savedColleges', JSON.stringify(updated));
    setSavedColleges(savedColleges.filter(c => c.id !== collegeId));
    setActionMessage('College removed from saved list.');
  };

  const compareSaved = () => {
    if (savedColleges.length < 2) {
      setActionMessage('Select at least 2 saved colleges to compare.');
      return;
    }
    const ids = savedColleges.slice(0, 3).map((college) => college.id).join(',');
    router.push(`/compare?ids=${encodeURIComponent(ids)}`);
  };

  const sendApplications = () => {
    if (savedColleges.length === 0) {
      setActionMessage('No saved colleges to create applications for.');
      return;
    }

    const existing = JSON.parse(localStorage.getItem('applications') || '[]');
    const existingCollegeIds = new Set(existing.map((item: any) => item.collegeId).filter(Boolean));
    const now = new Date().toISOString();

    const toInsert = savedColleges
      .filter((college) => !existingCollegeIds.has(college.id))
      .map((college) => ({
        id: `app_${college.id}_${Date.now()}`,
        collegeId: college.id,
        collegeName: college.name,
        status: 'submitted',
        appliedDate: now,
      }));

    const merged = [...existing, ...toInsert];
    localStorage.setItem('applications', JSON.stringify(merged));

    if (toInsert.length === 0) {
      setActionMessage('Applications already exist for all saved colleges.');
      return;
    }

    setActionMessage(`${toInsert.length} application(s) created from saved colleges.`);
    setTimeout(() => router.push('/dashboard/applications'), 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading saved colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <DashboardSidebar
        activePath="/dashboard/saved"
        onLogout={handleLogout}
        savedCount={savedColleges.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Saved Colleges ⭐</h2>
          <p className="text-slate-600 text-sm mt-1">{savedColleges.length} college(s) saved</p>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto">
            {savedColleges.length > 0 ? (
              <>
                <div className="mb-6 flex gap-4">
                  <button
                    onClick={compareSaved}
                    className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Compare Saved
                  </button>
                  <button
                    onClick={sendApplications}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Create Applications
                  </button>
                </div>
                {actionMessage && <p className="mb-4 text-sm text-slate-700">{actionMessage}</p>}

                <div className="grid grid-cols-1 gap-4">
                  {savedColleges.map(college => (
                    <div key={college.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex gap-6 items-center">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{college.name}</h3>
                        <p className="text-slate-600 mb-3">{college.location}</p>

                        <div className="flex flex-wrap gap-3 text-sm">
                          <div className="bg-indigo-50 px-3 py-2 rounded">
                            <span className="text-slate-600">Ranking: </span>
                            <span className="font-bold text-indigo-700">#{college.ranking}</span>
                          </div>
                          <div className="bg-emerald-50 px-3 py-2 rounded">
                            <span className="text-slate-600">Placement: </span>
                            <span className="font-bold text-emerald-700">{college.placement_rate}%</span>
                          </div>
                          <div className="bg-amber-50 px-3 py-2 rounded">
                            <span className="text-slate-600">Rating: </span>
                            <span className="font-bold text-amber-700">⭐ {college.rating}/5</span>
                          </div>
                          <div className="bg-fuchsia-50 px-3 py-2 rounded">
                            <span className="text-slate-600">Fees: </span>
                            <span className="font-bold text-fuchsia-700">₹{(college.fees / 100000).toFixed(1)}L</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/colleges/${college.id}`}
                          className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => removeFromSaved(college.id)}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Saved Colleges Yet</h3>
                <p className="text-slate-600 mb-6">Start exploring colleges and save your favorites!</p>
                <Link
                  href="/dashboard/colleges"
                  className="inline-block bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Browse Colleges →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
