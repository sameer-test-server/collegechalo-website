'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../../components/dashboard/Sidebar';
import { generateCollegeId } from '../../../lib/id-generator';

interface College {
  id: string;
  name: string;
  location: string;
  state?: string;
  type?: string;
  ranking: number;
  placement_rate: number;
  fees: number;
  rating: number;
  matchScore?: number;
  cutoffs?: Record<string, number>;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  jeeScore?: number;
  neetScore?: number;
  percentage?: number;
  state?: string;
}

export default function Recommendations() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('savedColleges');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    const bootstrap = async () => {
      let userData: UserProfile;
      try {
        userData = JSON.parse(storedUser);
      } catch {
        if (!cancelled) router.push('/auth/login');
        return;
      }

      try {
        if (!cancelled) setUser(userData);
        if (saved && !cancelled) setSavedColleges(JSON.parse(saved));

        const res = await fetch('/api/colleges');
        const data = await res.json();
        const list: College[] = Array.isArray(data?.data) ? data.data : [];
        const normalized = list.map((college, index) => ({
          ...college,
          id: college.id || generateCollegeId(college.name || `college-${index}`, college.location || `loc-${index}`),
        }));
        const recommended = generateRecommendations(userData, normalized);
        if (!cancelled) setRecommendations(recommended.slice(0, 6));
      } catch (e) {
        console.error('Error:', e);
        if (!cancelled) {
          setMessage('Could not load recommendations right now.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const institutionBucket = (college: College): string => {
    const name = college.name.toLowerCase();
    if (name.includes('indian institute of technology') || name.includes('iit')) return 'IIT';
    if (name.includes('national institute of technology') || name.includes('nit')) return 'NIT';
    if (college.type === 'Private') return 'PRIVATE';
    if (college.type === 'Government') return 'GOV';
    return 'OTHER';
  };

  const generateRecommendations = (user: UserProfile, colleges: College[]): College[] => {
    // Recommendation logic with diversity balancing
    const scored = colleges.map(college => {
      let score = 0;

      // Score based on placement rate (higher is better)
      score += college.placement_rate;

      // Score based on fees (lower is better for user, so inverse scoring)
      if (college.fees < 5000000) score += 20;
      else if (college.fees < 10000000) score += 10;

      // Score based on ranking (lower ranking number is better)
      score += Math.max(0, 100 - college.ranking);

      // Score based on location match
      if (user.state && college.location.includes(user.state)) {
        score += 15;
      }

      // Score based on rating
      score += college.rating * 10;

      // Basic profile-fit penalty so very high-cutoff colleges do not always dominate
      const profileScore = user.jeeScore ?? user.neetScore ?? user.percentage ?? 70;
      if (college.ranking <= 10 && profileScore < 80) score -= 18;
      else if (college.ranking <= 20 && profileScore < 75) score -= 10;

      const boundedScore = Math.max(55, Math.min(99, Math.round(score / 3)));
      return { ...college, _score: score, matchScore: boundedScore };
    });

    const sorted = scored.sort((a, b) => (b._score || 0) - (a._score || 0));

    // Diversity pass: avoid showing only one college family (e.g., all IITs)
    const picked: College[] = [];
    const bucketCounts = new Map<string, number>();
    const stateCounts = new Map<string, number>();

    for (const college of sorted) {
      if (picked.length >= 6) break;
      const bucket = institutionBucket(college);
      const state = (college.state || college.location || 'unknown').toLowerCase();
      const bucketCount = bucketCounts.get(bucket) || 0;
      const stCount = stateCounts.get(state) || 0;
      if (bucketCount >= 2) continue;
      if (stCount >= 2) continue;
      picked.push(college);
      bucketCounts.set(bucket, bucketCount + 1);
      stateCounts.set(state, stCount + 1);
    }

    // Fill remaining slots with best available if diversity constraints are too strict
    if (picked.length < 6) {
      for (const college of sorted) {
        if (picked.length >= 6) break;
        if (!picked.some((c) => c.id === college.id)) picked.push(college);
      }
    }

    return picked;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const saveCollege = (collegeId: string) => {
    const updated = savedColleges.includes(collegeId)
      ? savedColleges.filter(id => id !== collegeId)
      : [...savedColleges, collegeId];
    setSavedColleges(updated);
    localStorage.setItem('savedColleges', JSON.stringify(updated));
  };

  const applyNow = (college: College) => {
    const existing = JSON.parse(localStorage.getItem('applications') || '[]');
    const alreadyExists = existing.some((item: any) => item.collegeId === college.id);
    if (alreadyExists) {
      setMessage('Application already exists for this college. Redirecting to Applications...');
      setTimeout(() => router.push('/dashboard/applications'), 500);
      return;
    }

    const newApp = {
      id: `app_${college.id}_${Date.now()}`,
      collegeId: college.id,
      collegeName: college.name,
      status: 'pending',
      appliedDate: new Date().toISOString(),
    };
    const merged = [...existing, newApp];
    localStorage.setItem('applications', JSON.stringify(merged));
    setMessage(`Application created for ${college.name}. Redirecting...`);
    setTimeout(() => router.push('/dashboard/applications'), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Generating recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <DashboardSidebar
        activePath="/dashboard/recommendations"
        onLogout={handleLogout}
        savedCount={savedColleges.length}
        userName={user?.name}
        userEmail={user?.email}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Smart Recommendations 🎯</h2>
          <p className="text-slate-600 text-sm mt-1">Colleges matched to your profile</p>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto">
            {/* Info Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl shadow-sm p-6 text-white mb-8">
              <h3 className="text-lg font-bold mb-2">🔍 How we recommend colleges?</h3>
              <p className="text-sm opacity-90">
                We analyze placement rates, fees, rankings, location preferences, and ratings to find the best matches for you.
                {user?.jeeScore && ` Based on your JEE score of ${user.jeeScore}, `}
                {user?.neetScore && ` NEET score of ${user.neetScore}, `}
                {user?.percentage && ` and 12th percentage of ${user.percentage}%, `}
                these colleges are recommended.
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((college, index) => (
                  <div key={college.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <div className="p-6">
                      {/* Recommendation Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          #{index + 1} Recommended
                        </div>
                        <button
                          onClick={() => saveCollege(college.id)}
                          className={`text-2xl ${
                            savedColleges.includes(college.id) ? 'text-yellow-400' : 'text-slate-300'
                          } hover:scale-110 transition`}
                        >
                          ⭐
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 text-lg mb-1">{college.name}</h3>
                      <p className="text-sm text-slate-600 mb-4">📍 {college.location}</p>

                      {/* Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between bg-indigo-50 p-3 rounded">
                          <span className="text-sm text-slate-700">Ranking</span>
                          <span className="font-bold text-indigo-700">#{college.ranking}</span>
                        </div>
                        <div className="flex items-center justify-between bg-emerald-50 p-3 rounded">
                          <span className="text-sm text-slate-700">Placement</span>
                          <span className="font-bold text-emerald-700">{college.placement_rate}%</span>
                        </div>
                        <div className="flex items-center justify-between bg-amber-50 p-3 rounded">
                          <span className="text-sm text-slate-700">Rating</span>
                          <span className="font-bold text-amber-700">⭐ {college.rating}/5</span>
                        </div>
                        <div className="flex items-center justify-between bg-fuchsia-50 p-3 rounded">
                          <span className="text-sm text-slate-700">Fees/Year</span>
                          <span className="font-bold text-fuchsia-700">₹{(college.fees / 100000).toFixed(1)}L</span>
                        </div>
                      </div>

                      {/* Match Score (visual) */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-slate-700">Match Score</span>
                          <span className="text-xs font-bold text-emerald-700">{college.matchScore || 80}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full"
                            style={{ width: `${college.matchScore || 80}%` }}
                          ></div>
                        </div>
                      </div>

                      <Link
                        href={`/dashboard/colleges/${college.id}`}
                        className="block w-full text-center bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition mb-2"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => applyNow(college)}
                        className="w-full bg-fuchsia-700 hover:bg-fuchsia-600 text-white py-2 rounded-lg font-semibold transition"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h3>
                <p className="text-slate-600 mb-6">Add your JEE/NEET scores and board details for better recommendations</p>
                <Link
                  href="/dashboard/profile"
                  className="inline-block bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Complete Profile →
                </Link>
              </div>
            )}
            {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
