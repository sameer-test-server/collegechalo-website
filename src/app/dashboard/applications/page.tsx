'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../../components/dashboard/Sidebar';

interface Application {
  id: string;
  collegeId?: string;
  collegeName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'submitted';
  appliedDate: string;
  deadline?: string;
}

export default function Applications() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const apps = localStorage.getItem('applications');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      if (apps) {
        setApplications(JSON.parse(apps));
      }
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

  const persistApplications = (next: Application[]) => {
    setApplications(next);
    localStorage.setItem('applications', JSON.stringify(next));
  };

  const cycleStatus = (id: string) => {
    const order: Application['status'][] = ['pending', 'submitted', 'accepted', 'rejected'];
    const next = applications.map((item) => {
      if (item.id !== id) return item;
      const idx = order.indexOf(item.status);
      const nextStatus = order[(idx + 1) % order.length];
      return { ...item, status: nextStatus };
    });
    persistApplications(next);
    setMessage('Application status updated.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-l-4 border-rose-500';
      case 'submitted':
        return 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border-l-4 border-amber-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'submitted':
        return '📤';
      case 'pending':
      default:
        return '⏳';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading applications...</p>
        </div>
      </div>
    );
  }

  const accepted = applications.filter(a => a.status === 'accepted').length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <DashboardSidebar
        activePath="/dashboard/applications"
        onLogout={handleLogout}
        applicationsCount={applications.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Your Applications 📋</h2>
          <p className="text-slate-600 text-sm mt-1">Track and manage your college applications</p>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-indigo-600">
                <div className="text-sm text-slate-600 font-semibold mb-2">Total Applications</div>
                <div className="text-3xl font-bold text-slate-900">{applications.length}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-emerald-600">
                <div className="text-sm text-slate-600 font-semibold mb-2">Accepted</div>
                <div className="text-3xl font-bold text-slate-900">{accepted}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-amber-600">
                <div className="text-sm text-slate-600 font-semibold mb-2">Pending</div>
                <div className="text-3xl font-bold text-slate-900">{pending}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-rose-600">
                <div className="text-sm text-slate-600 font-semibold mb-2">Rejected</div>
                <div className="text-3xl font-bold text-slate-900">{rejected}</div>
              </div>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className={`rounded-2xl p-6 ${getStatusColor(app.status)} shadow-sm hover:shadow-md transition`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{getStatusIcon(app.status)}</span>
                        <div>
                          <h3 className="text-lg font-bold">{app.collegeName}</h3>
                          <p className="text-sm opacity-75">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                          {app.deadline && (
                            <p className="text-sm opacity-75">Deadline: {new Date(app.deadline).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                          className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                        >
                          View Status
                        </button>
                        <button
                          onClick={() => cycleStatus(app.id)}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                    {expandedId === app.id && (
                      <div className="mt-4 bg-white/70 rounded-xl p-3 text-sm text-slate-700">
                        <p><strong>Current status:</strong> {app.status}</p>
                        <p><strong>Applied date:</strong> {new Date(app.appliedDate).toLocaleString()}</p>
                        {app.deadline && <p><strong>Deadline:</strong> {new Date(app.deadline).toLocaleString()}</p>}
                        {app.collegeId && (
                          <p className="mt-2">
                            <Link href={`/dashboard/colleges/${app.collegeId}`} className="text-indigo-700 hover:underline">
                              View college details
                            </Link>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Applications Yet</h3>
                <p className="text-slate-600 mb-6">Start applying to your favorite colleges!</p>
                <Link
                  href="/dashboard/colleges"
                  className="inline-block bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Browse & Apply →
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
