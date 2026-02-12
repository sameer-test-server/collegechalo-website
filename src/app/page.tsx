'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const featuredColleges = [
    { id: 'college_1', name: 'IIT Bombay', location: 'Mumbai', rank: 1 },
    { id: 'college_3', name: 'IIT Madras', location: 'Chennai', rank: 3 },
    { id: 'college_11', name: 'NIT Trichy', location: 'Tiruchirappalli', rank: 11 },
    { id: 'college_40', name: 'Anna University', location: 'Chennai', rank: 40 },
  ];
  const categories = [
    { name: 'Engineering', count: '4,000+', link: '/colleges?type=Government' },
    { name: 'Management', count: '5,000+', link: '/colleges' },
    { name: 'Medical', count: '700+', link: '/colleges' },
    { name: 'Law', count: '900+', link: '/colleges' },
    { name: 'Commerce', count: '3,000+', link: '/colleges' },
    { name: 'Science', count: '3,500+', link: '/colleges' },
  ];
  const topExams = [
    { name: 'JEE Main', month: 'Jan / Apr', audience: 'Engineering aspirants' },
    { name: 'NEET UG', month: 'May', audience: 'Medical aspirants' },
    { name: 'CAT', month: 'Nov', audience: 'MBA aspirants' },
    { name: 'GATE', month: 'Feb', audience: 'M.Tech / PSU aspirants' },
  ];
  const newsHighlights = [
    { title: 'Admissions Calendar 2026: What to track every month', tag: 'Admissions', link: '/news' },
    { title: 'How to shortlist colleges with rank, fees and placement together', tag: 'Guides', link: '/news' },
    { title: 'Top counselling mistakes students make in first round', tag: 'Counselling', link: '/news' },
  ];
  const counsellingTimeline = [
    { phase: 'Jan - Mar', title: 'Exam Attempts and Profile Building', detail: 'Finalize exam strategy, gather documents, and set preference filters in your dashboard.' },
    { phase: 'Apr - Jun', title: 'Score Analysis and Shortlisting', detail: 'Use cutoffs, fees, placements, and location filters to build a realistic college list.' },
    { phase: 'Jul - Aug', title: 'Counselling Rounds and Choice Filling', detail: 'Prioritize dream, target, and safe options while tracking each round deadline.' },
    { phase: 'Sep - Oct', title: 'Final Admission and Onboarding', detail: 'Confirm allotment, complete fee payment, and prepare hostel and semester checklist.' },
  ];
  const stateSpotlights = [
    { state: 'Tamil Nadu', colleges: 'Anna University, PSG, SSN, CEG', link: '/colleges?state=Tamil%20Nadu' },
    { state: 'Karnataka', colleges: 'RVCE, BMSCE, PES, MSRIT', link: '/colleges?state=Karnataka' },
    { state: 'Maharashtra', colleges: 'IIT Bombay, COEP, VJTI, PICT', link: '/colleges?state=Maharashtra' },
    { state: 'Delhi NCR', colleges: 'DTU, NSUT, IIIT-Delhi, Jamia', link: '/colleges?state=Delhi' },
  ];
  const guidanceFaq = [
    { q: 'How should I shortlist colleges?', a: 'Use a 3-bucket approach: dream, target, and safe colleges based on your expected rank and budget.' },
    { q: 'How important is placement vs fees?', a: 'Both matter. Compare median package, tuition cost, and ROI together instead of any single metric.' },
    { q: 'When should I start applications?', a: 'Start early after exams and keep all required documents ready to avoid missing first-round deadlines.' },
  ];
  const testimonials = [
    { name: 'A. Karthik', college: 'NIT Trichy', text: 'The shortlist and comparison flow saved me days of confusion.' },
    { name: 'S. Priya', college: 'Anna University', text: 'I could track deadlines and applications in one place without missing steps.' },
    { name: 'R. Mehta', college: 'IIT Bombay', text: 'Profile-based recommendations were useful for building a realistic final list.' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from storage');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/collegechalo-logo.png"
                alt="College Chalo"
                className="h-9 w-auto rounded"
              />
              <h1 className="text-2xl font-semibold tracking-tight">College Chalo</h1>
            </div>
            <ul className="flex gap-6">
              <li><a href="/colleges" className="text-slate-200 hover:text-white">Colleges</a></li>
              <li><a href="/students" className="text-slate-200 hover:text-white">Students</a></li>
              <li><a href="/compare" className="text-slate-200 hover:text-white">Compare</a></li>
              <li><a href="/news" className="text-slate-200 hover:text-white">News</a></li>
              <li><a href="/quiz" className="text-slate-200 hover:text-white">Quiz</a></li>
              {user ? (
                <>
                  <li><a href="/dashboard" className="text-white font-semibold">Dashboard</a></li>
                  <li><span className="text-slate-300">Hi, {user.name}</span></li>
                  <li><button onClick={handleLogout} className="text-slate-200 hover:text-white">Logout</button></li>
                </>
              ) : (
                <>
                  <li><a href="/auth/login" className="text-slate-200 hover:text-white">Login</a></li>
                  <li><a href="/auth/register" className="text-slate-200 hover:text-white">Sign Up</a></li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#c7d2fe,transparent_45%),radial-gradient(circle_at_80%_0%,#fecaca,transparent_40%),linear-gradient(180deg,#e2e8f0,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-600 mb-4">College Discovery Platform</p>
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Find your best-fit college
          </h2>
          <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto">
            Compare programs, placements, fees, and location — all in one clean, fast dashboard built for students.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={user ? '/dashboard/colleges' : '/colleges'}
              className="bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-600"
            >
              Explore Colleges
            </Link>
            {!user && (
              <a href="/auth/register" className="border border-slate-400 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-white">
                Create Free Account
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Why College Chalo?</h3>
            <p className="text-slate-500 text-sm">Built for clarity, not confusion</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold mb-2">College Search</h4>
              <p className="text-slate-700">Browse trusted data with placements, fees, rankings, and location at a glance.</p>
            </div>
            <div className="bg-white border border-slate-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold mb-2">Compare Clearly</h4>
              <p className="text-slate-700">Shortlist and compare colleges side‑by‑side without juggling tabs.</p>
            </div>
            <div className="bg-white border border-slate-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold mb-2">Apply Smarter</h4>
              <p className="text-slate-700">Track applications and deadlines with a simple, student‑friendly workflow.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">Platform Snapshot</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-300 p-6">
              <p className="text-3xl font-bold text-indigo-700">40+</p>
              <p className="text-slate-600 text-sm mt-1">Colleges listed</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-300 p-6">
              <p className="text-3xl font-bold text-indigo-700">5</p>
              <p className="text-slate-600 text-sm mt-1">Dashboard modules</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-300 p-6">
              <p className="text-3xl font-bold text-indigo-700">4</p>
              <p className="text-slate-600 text-sm mt-1">Core test suites</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-300 p-6">
              <p className="text-3xl font-bold text-indigo-700">24x7</p>
              <p className="text-slate-600 text-sm mt-1">Self-serve access</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-300 p-6">
              <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-3">STEP 1</p>
              <h4 className="text-xl font-semibold mb-2">Set Your Preferences</h4>
              <p className="text-slate-700">Add location, exam score, and budget preferences in your profile.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-300 p-6">
              <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-3">STEP 2</p>
              <h4 className="text-xl font-semibold mb-2">Shortlist Colleges</h4>
              <p className="text-slate-700">Filter by state, rank, placement, and fees to save your best options.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-300 p-6">
              <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-3">STEP 3</p>
              <h4 className="text-xl font-semibold mb-2">Track and Apply</h4>
              <p className="text-slate-700">Monitor applications, deadlines, and recommendations in one dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Popular Colleges</h3>
            <Link href="/colleges" className="text-indigo-700 font-semibold hover:underline">View all colleges</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredColleges.map((college) => (
              <Link
                key={college.id}
                href={`/colleges/${college.id}`}
                className="bg-white rounded-2xl border border-slate-300 p-5 hover:shadow-md transition"
              >
                <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-2">Rank #{college.rank}</p>
                <h4 className="text-lg font-semibold text-slate-900">{college.name}</h4>
                <p className="text-slate-600 text-sm mt-1">{college.location}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Explore Your Future</h3>
            <Link href="/colleges" className="text-indigo-700 font-semibold hover:underline">View all categories</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="bg-white rounded-2xl border border-slate-300 p-5 hover:shadow-md transition"
              >
                <p className="text-sm text-slate-500">{item.count} colleges</p>
                <h4 className="text-lg font-semibold text-slate-900 mt-1">{item.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Top Exams in India</h3>
            <Link href="/compare" className="text-indigo-700 font-semibold hover:underline">Preparation strategy</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topExams.map((exam) => (
              <div key={exam.name} className="bg-white rounded-2xl border border-slate-300 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-900">{exam.name}</h4>
                  <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full">{exam.month}</span>
                </div>
                <p className="text-slate-600 text-sm mt-2">{exam.audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Latest Updates</h3>
            <Link href="/news" className="text-indigo-700 font-semibold hover:underline">All updates</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newsHighlights.map((item) => (
              <a key={item.title} href={item.link} className="bg-white rounded-2xl border border-slate-300 p-5 hover:shadow-md transition">
                <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full">{item.tag}</span>
                <h4 className="text-lg font-semibold text-slate-900 mt-3 leading-snug">{item.title}</h4>
                <p className="text-sm text-indigo-700 mt-4 font-medium">Read more</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Admission Timeline</h3>
            <Link href="/dashboard/applications" className="text-indigo-700 font-semibold hover:underline">Track in dashboard</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counsellingTimeline.map((item) => (
              <div key={item.phase} className="bg-white rounded-2xl border border-slate-300 p-6">
                <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-2">{item.phase}</p>
                <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
                <p className="text-slate-600 text-sm mt-2">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Top Study Destinations</h3>
            <Link href="/colleges" className="text-indigo-700 font-semibold hover:underline">Browse states</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stateSpotlights.map((item) => (
              <Link key={item.state} href={item.link} className="bg-white rounded-2xl border border-slate-300 p-5 hover:shadow-md transition">
                <h4 className="text-xl font-semibold text-slate-900">{item.state}</h4>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.colleges}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">Student Voices</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((item) => (
              <div key={item.name} className="bg-white rounded-2xl border border-slate-300 p-5">
                <p className="text-slate-700 leading-relaxed">{item.text}</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.college}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Guidance Corner</h3>
            <Link href="/faq" className="text-indigo-700 font-semibold hover:underline">View full FAQ</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guidanceFaq.map((item) => (
              <div key={item.q} className="bg-white rounded-2xl border border-slate-300 p-5">
                <h4 className="text-lg font-semibold text-slate-900">{item.q}</h4>
                <p className="text-slate-600 text-sm mt-3">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-700 to-slate-900 rounded-3xl px-8 py-12 text-white">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">The sooner you start, the better your college outcomes</h3>
            <p className="text-slate-200 mt-4 max-w-2xl">
              Build your shortlist early, compare with confidence, and track every application milestone in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href={user ? '/dashboard' : '/auth/register'} className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold">
                {user ? 'Open Dashboard' : 'Start Free'}
              </Link>
              <Link href="/colleges" className="border border-slate-300 text-white px-6 py-3 rounded-full font-semibold">
                Search Colleges
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-300">
          <p>&copy; 2026 College Chalo. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
