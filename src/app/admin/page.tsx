'use client';

import { useEffect } from 'react';

export default function AdminIndexPage() {
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    window.location.href = token ? '/admin/colleges' : '/admin/login';
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700">
      Redirecting to admin panel...
    </main>
  );
}

