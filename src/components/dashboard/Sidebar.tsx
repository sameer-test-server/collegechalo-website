'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardSidebarProps {
  activePath: string;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
  savedCount?: number;
  applicationsCount?: number;
}

interface MenuItem {
  href: string;
  label: string;
  icon: 'home' | 'college' | 'saved' | 'applications' | 'recommendations' | 'profile' | 'preferences' | 'quiz' | 'compare' | 'news';
  badge?: string;
}

function SidebarIcon({ name, className }: { name: MenuItem['icon']; className?: string }) {
  const cls = className || 'h-4 w-4';
  switch (name) {
    case 'home':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case 'college':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M3 8 12 4l9 4-9 4-9-4Z" /><path d="M7 10v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5" /><path d="M21 8v6" /></svg>;
    case 'saved':
      return <svg viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="m12 17.3-5.5 3.2 1.5-6.3L3 9.8l6.5-.6L12 3.3l2.5 5.9 6.5.6-5 4.4 1.5 6.3z" /></svg>;
    case 'applications':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>;
    case 'recommendations':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 3z" /></svg>;
    case 'profile':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.6-3.5 4.5-5 8-5s6.4 1.5 8 5" /></svg>;
    case 'preferences':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.7V21a2 2 0 1 1-4 0v-.2a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1H3a2 2 0 1 1 0-4h.2a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.4-2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.7V3a2 2 0 1 1 4 0v.2a1.8 1.8 0 0 0 1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.7 1H21a2 2 0 1 1 0 4h-.2a1.8 1.8 0 0 0-1.4.7Z" /></svg>;
    case 'quiz':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M9 9a3 3 0 1 1 5.2 2.1C13 12 12 12.8 12 14" /><circle cx="12" cy="18" r="1" /><rect x="3" y="3" width="18" height="18" rx="3" /></svg>;
    case 'compare':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M8 6 4 12h8L8 6ZM16 18l-4-6h8l-4 6Z" /><path d="M12 4v16" /></svg>;
    case 'news':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}><path d="M4 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" /><path d="M8 9h7M8 13h7M8 17h4" /></svg>;
    default:
      return null;
  }
}

function isActivePath(activePath: string, href: string): boolean {
  if (href === '/dashboard') return activePath === '/dashboard';
  return activePath.startsWith(href);
}

function SidebarItem({
  item,
  activePath,
  collapsed,
  onNavigate,
}: {
  item: MenuItem;
  activePath: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const active = isActivePath(activePath, item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.label}
      className={`group flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all duration-200 ${
        active
          ? 'border-indigo-400/70 bg-indigo-500/20 text-white shadow-[0_0_0_1px_rgba(99,102,241,0.25)]'
          : 'border-slate-700/80 bg-slate-800/55 text-slate-200 hover:-translate-y-[1px] hover:border-slate-500 hover:bg-slate-700/70 hover:text-white'
      }`}
    >
      <span className={`flex items-center min-w-0 ${collapsed ? 'gap-0 w-full justify-center' : 'gap-3'}`}>
        <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold ${
          active ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-200'
        }`}>
          <SidebarIcon name={item.icon} className="h-4 w-4" />
        </span>
        {!collapsed && <span className="truncate text-sm font-medium">{item.label}</span>}
      </span>
      {!collapsed && item.badge && (
        <span className="ml-2 rounded-full bg-slate-600/70 px-2 py-0.5 text-[11px] font-semibold text-slate-100">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default function DashboardSidebar({
  activePath,
  onLogout,
  userName,
  userEmail,
  savedCount = 0,
  applicationsCount = 0,
}: DashboardSidebarProps) {
  const [desktopExpanded, setDesktopExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = !desktopExpanded;

  useEffect(() => {
    if (!mobileOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [mobileOpen]);

  const primaryItems: MenuItem[] = [
    { href: '/dashboard', label: 'Dashboard Home', icon: 'home' },
    { href: '/dashboard/colleges', label: 'Browse Colleges', icon: 'college' },
    { href: '/dashboard/saved', label: 'Saved Colleges', icon: 'saved', badge: String(savedCount) },
    { href: '/dashboard/applications', label: 'Applications', icon: 'applications', badge: String(applicationsCount) },
    { href: '/dashboard/recommendations', label: 'Recommendations', icon: 'recommendations' },
  ];

  const utilityItems: MenuItem[] = [
    { href: '/dashboard/profile', label: 'My Profile', icon: 'profile' },
    { href: '/dashboard/preferences', label: 'Preferences', icon: 'preferences' },
    { href: '/dashboard/quiz', label: 'Discovery Quiz', icon: 'quiz' },
    { href: '/compare', label: 'Compare Colleges', icon: 'compare' },
    { href: '/news', label: 'News & Updates', icon: 'news' },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="md:hidden fixed inset-x-0 top-0 z-[70] h-14 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-full items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <p className="text-sm font-semibold text-slate-800">Dashboard</p>
        </div>
      </header>

      <div className={`md:hidden fixed inset-0 z-[80] transition ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label="Close menu overlay"
          className={`absolute inset-0 bg-slate-950/60 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMobile}
        />
        <aside className={`absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white shadow-2xl border-r border-slate-800 flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/collegechalo-logo.png" alt="College Chalo" className="h-8 w-auto bg-white rounded px-1.5 py-1" />
              <div>
                <p className="text-base font-semibold tracking-tight">College Chalo</p>
                <p className="text-xs text-slate-300">Student Dashboard</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeMobile}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <section>
              <p className="px-1 pb-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">Main</p>
              <div className="space-y-2">
                {primaryItems.map((item) => (
                  <SidebarItem key={item.href} item={item} activePath={activePath} collapsed={false} onNavigate={closeMobile} />
                ))}
              </div>
            </section>
            <section>
              <p className="px-1 pb-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">Tools</p>
              <div className="space-y-2">
                {utilityItems.map((item) => (
                  <SidebarItem key={item.href} item={item} activePath={activePath} collapsed={false} onNavigate={closeMobile} />
                ))}
              </div>
            </section>
          </div>
          <div className="px-4 py-4 border-t border-slate-800">
            <button
              onClick={() => {
                closeMobile();
                onLogout();
              }}
              className="w-full rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 transition"
            >
              Logout
            </button>
          </div>
        </aside>
      </div>

      <aside
        onMouseEnter={() => setDesktopExpanded(true)}
        onMouseLeave={() => setDesktopExpanded(false)}
        className={`relative hidden md:flex bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white shadow-2xl border-r border-slate-800 flex-col transition-all duration-300 ${collapsed ? 'w-24' : 'w-80'}`}
      >
        <div className={`py-5 border-b border-slate-800 ${collapsed ? 'px-3' : 'px-5'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-3'}`}>
            <div className={`flex items-center min-w-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
              <img src="/collegechalo-logo.png" alt="College Chalo" className="h-8 w-auto bg-white rounded px-1.5 py-1" />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-base font-semibold tracking-tight truncate">College Chalo</p>
                  <p className="text-xs text-slate-300">Student Dashboard</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto py-4 space-y-5 ${collapsed ? 'px-2' : 'px-4'}`}>
          <section>
            {!collapsed && <p className="px-1 pb-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">Main</p>}
            <div className="space-y-2">
              {primaryItems.map((item) => (
                <SidebarItem key={item.href} item={item} activePath={activePath} collapsed={collapsed} />
              ))}
            </div>
          </section>

          <section>
            {!collapsed && <p className="px-1 pb-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">Tools</p>}
            <div className="space-y-2">
              {utilityItems.map((item) => (
                <SidebarItem key={item.href} item={item} activePath={activePath} collapsed={collapsed} />
              ))}
            </div>
          </section>

          {!collapsed && (
            <section className="rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-3">
              <p className="text-xs font-semibold text-slate-200">{userName || 'Student'}</p>
              <p className="mt-0.5 text-[11px] text-slate-400 truncate">{userEmail || 'Logged in user'}</p>
              <Link href="/faq" className="mt-3 inline-block text-xs font-semibold text-indigo-300 hover:text-indigo-200">
                Need help? Open FAQ
              </Link>
            </section>
          )}
        </div>

        <div className={`py-4 border-t border-slate-800 ${collapsed ? 'px-2' : 'px-4'}`}>
          <button
            onClick={onLogout}
            className={`rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 ${collapsed ? 'w-12 mx-auto block' : 'w-full'}`}
            title="Logout"
          >
            {collapsed ? '⎋' : 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
}
