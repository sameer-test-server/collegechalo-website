'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

interface College {
  id: string;
  name: string;
  location: string;
  ranking?: number;
  placement_rate?: number;
  fees?: number;
  rating?: number;
  description?: string;
  courses?: string[];
  website?: string;
  image_url?: string;
}

export default function DashboardCollegeDetailsClient({ college }: { college: College }) {
  const [imageIndex, setImageIndex] = useState(0);

  const imageSources = useMemo(() => {
    const domain = (college.website || '').replace(/^https?:\/\//, '').trim();
    const unique = new Set<string>();
    if (college.image_url && college.image_url.trim()) unique.add(college.image_url.trim());
    if (domain) {
      unique.add(`https://logo.clearbit.com/${domain}`);
      unique.add(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
    }
    unique.add('/college-placeholder.svg');
    return Array.from(unique);
  }, [college.image_url, college.website]);

  const currentImage = imageSources[Math.min(imageIndex, imageSources.length - 1)];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-4">
          <Link
            href="/dashboard/colleges"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400"
          >
            <span aria-hidden="true">←</span>
            <span>Back to colleges</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-2">{college.name}</h1>
        <p className="text-sm text-slate-600 mb-4">{college.location}</p>
        <img
          src={currentImage}
          alt={college.name}
          className="w-full h-56 object-contain bg-white rounded-2xl mb-4"
          loading="lazy"
          onError={() => setImageIndex((prev) => Math.min(prev + 1, imageSources.length - 1))}
        />
        {college.description && <p className="mb-4 text-slate-700">{college.description}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {college.ranking !== undefined ? <div><strong>Rank:</strong> #{college.ranking}</div> : null}
          {college.placement_rate !== undefined ? <div><strong>Placement:</strong> {college.placement_rate}%</div> : null}
          {college.fees !== undefined ? <div><strong>Fees:</strong> ₹{(college.fees / 100000).toFixed(1)}L</div> : <div><strong>Fees:</strong> N/A</div>}
          {college.rating !== undefined ? <div><strong>Rating:</strong> {college.rating}/5</div> : null}
        </div>

        {college.courses && (
          <div className="mb-4">
            <strong>Courses:</strong>
            <ul className="list-disc list-inside">
              {college.courses.map((c, i) => <li key={`${c}-${i}`}>{c}</li>)}
            </ul>
          </div>
        )}

        {college.website && (
          <a href={`https://${college.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-indigo-700 underline">Visit website</a>
        )}
      </div>
    </main>
  );
}
