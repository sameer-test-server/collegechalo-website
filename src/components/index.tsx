import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-slate-900 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <img
            src="/collegechalo-logo.png"
            alt="College Chalo"
            className="h-8 sm:h-9 w-auto bg-white rounded px-2 py-1"
          />
          <h1 className="text-2xl sm:text-4xl font-bold">{title}</h1>
        </div>
        {subtitle && <p className="text-slate-300 mt-2">{subtitle}</p>}
      </div>
    </header>
  );
};

interface FooterProps {
  year?: number;
}

export const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">College Chalo</h3>
            <p className="text-slate-400">Your gateway to top colleges</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Explore</h3>
            <ul className="text-slate-400 space-y-2">
              <li><a href="/colleges" className="hover:text-white">Colleges</a></li>
              <li><a href="/compare" className="hover:text-white">Compare</a></li>
              <li><a href="/news" className="hover:text-white">News</a></li>
              <li><a href="/quiz" className="hover:text-white">Quiz</a></li>
              <li><a href="/reviews" className="hover:text-white">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Help</h3>
            <ul className="text-slate-400 space-y-2">
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="text-slate-400 space-y-2">
              <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; {year} College Chalo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface CardProps {
  title: string;
  description: string;
  icon?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, description, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {icon && <span className="text-4xl mb-4">{icon}</span>}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-700">{description}</p>
    </div>
  );
};
