export default function TermsPage() {
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
          <h2 className="text-5xl font-bold mb-8">Terms & Conditions</h2>
          <div className="prose prose-lg max-w-none text-slate-700 space-y-6 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <p>Last updated: February 2026</p>
            
            <h3 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h3>
            <p>By using College Chalo, you accept these terms and conditions. If you don't agree, please don't use our service.</p>
            
            <h3 className="text-2xl font-bold text-slate-900">2. User Responsibilities</h3>
            <p>You agree to use our service only for lawful purposes and in a way that does not infringe upon the rights of others.</p>
            
            <h3 className="text-2xl font-bold text-slate-900">3. Intellectual Property</h3>
            <p>All content on College Chalo is our property or licensed to us. You may not reproduce or distribute without permission.</p>
            
            <h3 className="text-2xl font-bold text-slate-900">4. Limitation of Liability</h3>
            <p>College Chalo is provided "as is" without warranties. We're not liable for any indirect or consequential damages.</p>
            
            <h3 className="text-2xl font-bold text-slate-900">5. Changes to Terms</h3>
            <p>We may update these terms at any time. Continued use implies acceptance of changes.</p>
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
