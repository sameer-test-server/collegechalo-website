export default function StudentsPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/collegechalo-logo.png" alt="College Chalo" className="h-9 w-auto bg-white rounded px-2 py-1" />
              <h1 className="text-3xl font-bold">College Chalo</h1>
            </div>
            <ul className="flex gap-6">
              <li><a href="/colleges" className="text-slate-200 hover:text-white">Colleges</a></li>
              <li><a href="/students" className="text-white font-semibold">Students</a></li>
              <li><a href="/compare" className="text-slate-200 hover:text-white">Compare</a></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Content */}
      <section className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Student Resources</h2>
          <p className="text-xl text-slate-100">Coming soon: Access your applications, saved colleges, and more</p>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 College Chalo. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
