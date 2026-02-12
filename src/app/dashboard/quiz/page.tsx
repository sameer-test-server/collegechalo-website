'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../../components/dashboard/Sidebar';
import QuizPanel from '../../../components/quiz/QuizPanel';

export default function DashboardQuizPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <DashboardSidebar activePath="/dashboard/quiz" onLogout={handleLogout} />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <section className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white py-10 px-6">
          <h1 className="text-3xl font-semibold tracking-tight">Discovery Quiz</h1>
          <p className="mt-2 text-slate-100">
            Answer a few questions to get a practical shortlist without leaving your dashboard.
          </p>
        </section>
        <QuizPanel />
      </main>
    </div>
  );
}
