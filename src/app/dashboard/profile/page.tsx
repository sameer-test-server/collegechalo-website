'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfileCompletionPercent } from '../../../lib/profile-completion';
import DashboardSidebar from '../../../components/dashboard/Sidebar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  board?: string;
  percentage?: number | string;
  neetScore?: number;
  jeeScore?: number;
  state?: string;
  bio?: string;
  interests?: string[];
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData(userData);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      localStorage.setItem('user', JSON.stringify(formData));
      setUser(formData);
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profileCompletion = getProfileCompletionPercent(user);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <DashboardSidebar
        activePath="/dashboard/profile"
        onLogout={handleLogout}
        userName={user?.name}
        userEmail={user?.email}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
            <p className="text-slate-600 text-sm mt-1">Manage your personal information</p>
          </div>
          <div className="flex items-center gap-3">
            {editing ? (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 border border-amber-200">
                Editing mode
              </span>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-700 hover:bg-indigo-600 shadow-sm transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
              <div className="flex items-end gap-6 mb-8 pb-8 border-b border-slate-200">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{user?.name || 'User'}</h1>
                  <p className="text-slate-600">{user?.email}</p>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700">Profile Completion</span>
                  <span className="text-lg font-bold text-indigo-700">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-3 rounded-full transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            {formData && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        !editing ? 'bg-slate-50 text-slate-600' : ''
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Enter your phone number"
                      className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        !editing ? 'bg-slate-50' : ''
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Enter your state"
                      className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        !editing ? 'bg-slate-50' : ''
                      }`}
                    />
                  </div>

                  {/* Board */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Board</label>
                    <select
                      name="board"
                      value={formData.board || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        !editing ? 'bg-slate-50' : ''
                      }`}
                    >
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ISC">ISC</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                    </select>
                  </div>

                  {/* Percentage */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">12th Percentage</label>
                    <input
                      type="number"
                      name="percentage"
                      value={formData.percentage || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Enter your percentage"
                      className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        !editing ? 'bg-slate-50' : ''
                      }`}
                    />
                  </div>

                  {/* JEE Score */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">JEE Score (Optional)</label>
                    <input
                      type="number"
                      name="jeeScore"
                      value={formData.jeeScore || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Enter your JEE score"
                      className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        !editing ? 'bg-slate-50' : ''
                      }`}
                    />
                  </div>

                  {/* NEET Score */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">NEET Score (Optional)</label>
                    <input
                      type="number"
                      name="neetScore"
                      value={formData.neetScore || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      placeholder="Enter your NEET score"
                      className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        !editing ? 'bg-slate-50' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Tell us about yourself"
                    rows={4}
                    className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                      !editing ? 'bg-slate-50' : ''
                    }`}
                  />
                </div>

                {editing && (
                  <div className="flex gap-3 justify-end pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setFormData(user);
                        setEditing(false);
                      }}
                      className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-sm transition"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
