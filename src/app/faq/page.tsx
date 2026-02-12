export default function FAQPage() {
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
          <h2 className="text-5xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-2">How do I search for colleges?</h3>
              <p className="text-slate-700">Visit our Colleges page and browse through thousands of colleges with filters.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-2">Can I compare colleges?</h3>
              <p className="text-slate-700">Yes! Use our Compare feature to compare colleges side-by-side.</p>
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
