'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProfileCompletionPercent } from '../../lib/profile-completion';
import DashboardSidebar from '../../components/dashboard/Sidebar';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  board?: string;
  percentage?: number | string;
  state?: string;
  bio?: string;
}

interface College {
  id: string;
  name: string;
  location: string;
  ranking: number;
  placement_rate: number;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState<College[]>([]);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileCompletion = getProfileCompletionPercent(user);

  useEffect(() => {
    let cancelled = false;

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('savedColleges');
    const apps = localStorage.getItem('applications');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    const bootstrap = async () => {
      try {
      setUser(JSON.parse(storedUser));
      if (saved) setSavedColleges(JSON.parse(saved));
      if (apps) setApplications(JSON.parse(apps));

        const res = await fetch('/api/colleges?minRank=1&maxRank=15');
        const data = await res.json();
        if (!cancelled) setColleges((data.data || []).slice(0, 5));
      } catch (e) {
        console.error('Failed to initialize dashboard', e);
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let cancelled = false;
    const fetchNotifications = () => {
      fetch('/api/notifications', { headers: { Authorization: token } })
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          setNotifications(data.data || []);
        })
        .catch(() => {
          if (cancelled) return;
          setNotifications([]);
        });
    };

    fetchNotifications();
    const timer = setInterval(fetchNotifications, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const saveCollege = (collegeId: string) => {
    const token = localStorage.getItem('token') || '';
    const exists = savedColleges.includes(collegeId);
    const updated = savedColleges.includes(collegeId)
      ? savedColleges.filter(id => id !== collegeId)
      : [...savedColleges, collegeId];
    setSavedColleges(updated);
    localStorage.setItem('savedColleges', JSON.stringify(updated));

    if (token) {
      fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          title: exists ? 'College removed' : 'College saved',
          message: exists
            ? `College ${collegeId} removed from your saved list.`
            : `College ${collegeId} added to your saved list.`,
          type: exists ? 'warning' : 'success',
        }),
      }).catch(() => {});
    }
  };

  const markNotificationsRead = () => {
    const token = localStorage.getItem('token') || '';
    if (!token) return;
    fetch('/api/notifications', { method: 'PATCH', headers: { Authorization: token } })
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

    return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <DashboardSidebar
        activePath="/dashboard"
        onLogout={handleLogout}
        userName={user.name}
        userEmail={user.email}
        savedCount={savedColleges.length}
        applicationsCount={applications.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}! 👋</h2>
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => {
                const next = !showNotifications;
                setShowNotifications(next);
                if (next) markNotificationsRead();
              }}
              className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <span className="text-lg">🔔</span>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>
            <span className="text-sm text-slate-600">ID: {user.id}</span>
            <span className="text-sm text-slate-700 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">Active</span>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 max-h-96 overflow-auto bg-white border border-slate-200 rounded-2xl shadow-lg p-3 z-20">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-slate-900">Notifications</p>
                  <button
                    onClick={markNotificationsRead}
                    className="text-xs text-indigo-700 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-600">No notifications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0, 20).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border ${
                          n.read ? 'bg-slate-50 border-slate-200' : 'bg-indigo-50 border-indigo-100'
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-700 mt-1">{n.message}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-semibold">Total Saved</p>
                    <p className="text-3xl font-bold text-slate-900">{savedColleges.length}</p>
                  </div>
                  <div className="text-3xl">⭐</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-emerald-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-semibold">Applications</p>
                    <p className="text-3xl font-bold text-slate-900">{applications.length}</p>
                  </div>
                  <div className="text-3xl">📋</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-fuchsia-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-semibold">Colleges Available</p>
                    <p className="text-3xl font-bold text-slate-900">40+</p>
                  </div>
                  <div className="text-3xl">🏫</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-amber-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-semibold">Profile Complete</p>
                    <p className="text-3xl font-bold text-slate-900">{profileCompletion}%</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </div>
            </div>

            {/* Featured Colleges */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Top Ranked Colleges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map(college => (
                  <div key={college.id} className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{college.name}</h4>
                        <p className="text-sm text-slate-600">{college.location}</p>
                      </div>
                      <button
                        onClick={() => saveCollege(college.id)}
                        className={`text-2xl ${savedColleges.includes(college.id) ? 'text-yellow-400' : 'text-slate-300'} hover:scale-110 transition`}
                      >
                        ⭐
                      </button>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Rank #{college.ranking}</span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">{college.placement_rate}% Placement</span>
                    </div>
                    <Link href={`/dashboard/colleges/${college.id}`} className="text-indigo-700 hover:text-indigo-900 font-semibold text-sm">
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Recommended Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/colleges" className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-2xl hover:shadow-md transition">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="font-semibold">Explore Colleges</p>
                  <p className="text-sm text-indigo-100">Find your perfect match</p>
                </Link>
                <Link href="/dashboard/profile" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-2xl hover:shadow-md transition">
                  <div className="text-2xl mb-2">✏️</div>
                  <p className="font-semibold">Complete Profile</p>
                  <p className="text-sm text-emerald-100">25% remaining</p>
                </Link>
                <Link href="/dashboard/recommendations" className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white p-4 rounded-2xl hover:shadow-md transition">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="font-semibold">Get Recommendations</p>
                  <p className="text-sm text-fuchsia-100">Personalized suggestions</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
