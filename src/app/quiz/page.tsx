'use client';

import Link from 'next/link';
import QuizPanel from '../../components/quiz/QuizPanel';

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/collegechalo-logo.png" alt="College Chalo" className="h-9 w-auto bg-white rounded px-2 py-1" />
            <h1 className="text-2xl font-semibold tracking-tight">College Chalo</h1>
          </div>
          <ul className="flex gap-6">
            <li><Link href="/colleges" className="text-slate-200 hover:text-white">Colleges</Link></li>
            <li><Link href="/compare" className="text-slate-200 hover:text-white">Compare</Link></li>
            <li><Link href="/news" className="text-slate-200 hover:text-white">News</Link></li>
            <li><Link href="/quiz" className="text-white font-semibold">Quiz</Link></li>
          </ul>
        </nav>
      </header>

      <section className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">College Discovery Quiz</h2>
          <p className="mt-3 text-slate-100 max-w-3xl">
            Answer a few questions and get a practical shortlist matching your budget, location, and placement goals.
          </p>
        </div>
      </section>

      <QuizPanel />
    </main>
  );
}
