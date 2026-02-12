"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface College {
  id: string;
  name: string;
  location: string;
  state?: string;
  founded?: number;
  ranking?: number;
  nirf_overall_rank?: number;
  nirf_engineering_rank?: number;
  fees?: number;
  placement_rate?: number;
  rating?: number;
  description?: string;
  courses?: string[];
  website?: string;
  reviews_count?: number;
  image_url?: string;
  type?: string;
  cutoff_general?: number;
  cutoff_obc?: number;
  cutoff_sc?: number;
  total_seats?: number;
}

interface Props {
  college: College;
  backHref?: string;
}

export default function CollegeDetailsClient({ college, backHref = '/colleges' }: Props) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitOk, setSubmitOk] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const token = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('token') || '';
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingReviews(true);
    fetch(`/api/reviews?collegeId=${college.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setReviews(data.data || []);
      })
      .catch(() => {
        if (cancelled) return;
        setReviews([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingReviews(false);
      });
    return () => {
      cancelled = true;
    };
  }, [college.id]);

  const submitReview = async () => {
    setSubmitError('');
    setSubmitOk('');
    if (!rating) {
      setSubmitError('Please select a rating.');
      return;
    }
    if (!token && !name.trim()) {
      setSubmitError('Please enter your name or login.');
      return;
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({
          collegeId: college.id,
          rating: Number(rating),
          comment,
          name: name.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to submit review.');
        return;
      }
      setReviews((prev) => [data.data, ...prev]);
      setComment('');
      setSubmitOk('Review submitted.');
    } catch (err) {
      setSubmitError('Failed to submit review.');
    }
  };

  const imageSources = useMemo(() => {
    const domain = (college.website || '').replace(/^https?:\/\//, '').trim();
    const unique = new Set<string>();
    if (domain) {
      unique.add(`https://logo.clearbit.com/${domain}`);
      unique.add(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
    }
    if (college.image_url && college.image_url.trim().length > 0) {
      unique.add(college.image_url.trim());
    }
    unique.add('/college-placeholder.svg');
    return Array.from(unique);
  }, [college.website, college.image_url]);

  const imageSrc = imageSources[Math.min(imageIndex, imageSources.length - 1)];

  useEffect(() => {
    setImageIndex(0);
  }, [college.id]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400"
        >
          <span aria-hidden="true">←</span>
          <span>Back to colleges</span>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">{college.name}</h1>
      <p className="text-sm text-gray-600 mb-4">{college.location}</p>
      <img
        src={imageSrc}
        alt={college.name}
        className="w-full h-56 object-contain bg-white rounded mb-4"
        loading="lazy"
        onError={() => {
          setImageIndex((prev) => Math.min(prev + 1, imageSources.length - 1));
        }}
      />
      {college.description && <p className="mb-4 text-gray-700">{college.description}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {college.ranking !== undefined ? <div><strong>Rank:</strong> #{college.ranking}</div> : null}
        {college.nirf_overall_rank !== undefined ? <div><strong>NIRF Overall:</strong> #{college.nirf_overall_rank}</div> : null}
        {college.nirf_engineering_rank !== undefined ? <div><strong>NIRF Engineering:</strong> #{college.nirf_engineering_rank}</div> : null}
        {college.placement_rate !== undefined ? <div><strong>Placement:</strong> {college.placement_rate}%</div> : null}
        {college.fees !== undefined ? <div><strong>Fees:</strong> ₹{(college.fees / 100000).toFixed(1)}L</div> : <div><strong>Fees:</strong> N/A</div>}
        {college.rating !== undefined ? <div><strong>Rating:</strong> {college.rating}/5</div> : null}
        {college.total_seats !== undefined ? <div><strong>Total Seats:</strong> {college.total_seats}</div> : null}
        {college.type ? <div><strong>Type:</strong> {college.type}</div> : null}
        {college.founded ? <div><strong>Founded:</strong> {college.founded}</div> : null}
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
        <a
          href={`https://${college.website.replace(/^https?:\/\//, '')}`}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-700 underline"
        >
          Visit website
        </a>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">Reviews & Ratings</h2>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Average</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name {token ? '(logged in)' : ''}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={token ? 'Optional' : 'Your name'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            placeholder="Share your experience..."
          />
          {submitError && <p className="text-sm text-red-600 mt-2">{submitError}</p>}
          {submitOk && <p className="text-sm text-green-600 mt-2">{submitOk}</p>}
          <button
            onClick={submitReview}
            className="mt-3 bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
          >
            Submit Review
          </button>
        </div>

        {loadingReviews ? (
          <p className="text-gray-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{r.name || 'Anonymous'}</div>
                  <div className="text-yellow-600 font-semibold">⭐ {r.rating}/5</div>
                </div>
                {r.comment && <p className="text-gray-700">{r.comment}</p>}
                {r.created_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      </div>
    </main>
  );
}
