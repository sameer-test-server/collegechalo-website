'use client';

import { useEffect, useRef, useState } from 'react';

interface CollegesSearchToggleAnimatedProps {
  initialSearch?: string;
  state?: string;
  type?: string;
}

export default function CollegesSearchToggleAnimated({
  initialSearch,
  state,
  type,
}: CollegesSearchToggleAnimatedProps) {
  const [open, setOpen] = useState(Boolean(initialSearch));
  const [query, setQuery] = useState(initialSearch ?? '');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div
      className={`mb-6 rounded-2xl border bg-white p-4 transition-all duration-300 ${
        open
          ? 'border-indigo-200 shadow-lg shadow-indigo-100/70'
          : 'border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">Find a college</p>
          <p className="text-xs text-slate-500">Search by name or city</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-700 active:translate-y-0 active:scale-95"
          aria-label={open ? 'Close search' : 'Open search'}
          aria-expanded={open}
          title={open ? 'Close search' : 'Search colleges'}
        >
          <svg
            aria-hidden="true"
            className={`h-5 w-5 transition-transform duration-200 ${open ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
          open
            ? 'mt-4 max-h-[240px] opacity-100 translate-y-0'
            : 'max-h-0 opacity-0 -translate-y-2'
        }`}
      >
        <div className={`origin-top transition-transform duration-300 ${open ? 'scale-100' : 'scale-[0.98]'}`}>
          <form action="/colleges" method="get" className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              ref={inputRef}
              name="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by college name or city"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-shadow duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            {state && <input type="hidden" name="state" value={state} />}
            {type && <input type="hidden" name="type" value={type} />}
          </form>
        </div>
      </div>
    </div>
  );
}
