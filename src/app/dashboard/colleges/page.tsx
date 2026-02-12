'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../../components/dashboard/Sidebar';

interface College {
  id: string;
  name: string;
  location: string;
  state?: string;
  founded?: number;
  ranking?: number;
  placement_rate?: number;
  fees?: number;
  rating?: number;
  description?: string;
  courses?: string[];
  website?: string;
  reviews_count?: number;
  image_url?: string;
  type?: string;
  cutoff_general?: number;
  total_seats?: number;
}

export default function BrowseColleges() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [savedColleges, setSavedColleges] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('savedColleges');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    const bootstrap = async () => {
      try {
        if (saved) setSavedColleges(JSON.parse(saved));

        const res = await fetch('/api/colleges');
        const data = await res.json();
        if (!cancelled) setColleges(data.data || []);
      } catch (e) {
        console.error('Error:', e);
        if (!cancelled) router.push('/auth/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [router]);

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

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !filterState || college.location.includes(filterState);
    return matchesSearch && matchesState;
  });

  const states = ['Maharashtra', 'Delhi', 'Tamil Nadu', 'Karnataka', 'Telangana', 'Uttar Pradesh', 'West Bengal'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <DashboardSidebar
        activePath="/dashboard/colleges"
        onLogout={handleLogout}
        savedCount={savedColleges.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Browse Colleges 🏫</h2>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">Search & Filter</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Search by Name or Location</label>
                  <input
                    type="text"
                    placeholder="Search colleges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by State</label>
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Colleges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map(college => (
                <div key={college.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">{college.name}</h3>
                        <p className="text-sm text-slate-600">{college.location}</p>
                      </div>
                      <button
                        onClick={() => saveCollege(college.id)}
                        className={`text-2xl ml-2 ${savedColleges.includes(college.id) ? 'text-yellow-400' : 'text-slate-300'} hover:scale-110 transition`}
                      >
                        ⭐
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">Rank #{college.ranking}</span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-semibold">{college.placement_rate}% Placement</span>
                      <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-semibold">⭐ {college.rating}/5</span>
                    </div>

                    <p className="text-sm text-slate-700 mb-4">
                      <strong>Fees:</strong> {college.fees !== undefined ? `₹${(college.fees / 100000).toFixed(1)}L annually` : 'N/A'}
                    </p>

                    <Link href={`/dashboard/colleges/${college.id}`} className="w-full inline-block text-center bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            

            {filteredColleges.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No colleges found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
