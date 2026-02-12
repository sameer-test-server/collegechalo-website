export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <img src="/collegechalo-logo.png" alt="College Chalo" className="h-9 w-auto bg-white rounded px-2 py-1" />
            <h1 className="text-3xl font-bold"><a href="/">College Chalo</a></h1>
          </div>
        </nav>
      </header>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-8">About College Chalo</h2>
          <p className="text-lg text-slate-700 mb-8">
            College Chalo is your gateway to discovering and comparing top colleges across India. We help students make informed decisions about their educational journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-slate-700">To help every student find their perfect college match</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-700">A world where every student has access to quality education information</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <p className="text-slate-700">Transparency, reliability, and student-first approach</p>
            </div>
          </div>
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
