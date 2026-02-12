export default function PrivacyPage() {
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
          <h2 className="text-5xl font-bold mb-8">Privacy Policy</h2>
          <div className="prose prose-lg max-w-none text-slate-700 space-y-6 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <p>Last updated: February 2026</p>
            
            <h3 className="text-2xl font-bold text-slate-900">1. Information We Collect</h3>
            <p>We collect information you provide directly, such as name, email, phone number, and profile information.</p>
            
            <h3 className="text-2xl font-bold text-slate-900">2. How We Use Your Information</h3>
            <p>We use your information to provide, improve, and personalize our services, and to communicate with you.</p>
            
            <h3 className="text-2xl font-bold text-slate-900">3. Data Security</h3>
            <p>We implement appropriate technical and organizational measures to protect your personal data.</p>
            
            <h3 className="text-2xl font-bold text-slate-900">4. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal data. Contact us for details.</p>
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
