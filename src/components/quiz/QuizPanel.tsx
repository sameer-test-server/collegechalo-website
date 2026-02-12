'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

interface QuizResult {
  id: string;
  name: string;
  location: string;
  ranking: number;
  placement_rate: number;
  fees: number;
  quizMatch: number;
}

const initialAnswers = {
  stream: 'engineering',
  state: '',
  budget: 'medium',
  placementPriority: '80',
  type: 'Any',
};

export default function QuizPanel() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => Number(answers.placementPriority) >= 50, [answers.placementPriority]);

  const submitQuiz = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          placementPriority: Number(answers.placementPriority),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success || !Array.isArray(json?.data)) {
        throw new Error('Could not generate recommendations');
      }
      setResults(json.data);
    } catch {
      setError('Unable to generate recommendations right now.');
    } finally {
      setLoading(false);
    }
  };

  const onFieldChange = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white border border-slate-300 rounded-2xl p-6 space-y-4 h-fit">
          <h3 className="text-xl font-semibold">Your Preferences</h3>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Preferred stream</span>
            <select
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              value={answers.stream}
              onChange={(e) => onFieldChange('stream', e.target.value)}
            >
              <option value="engineering">Engineering</option>
              <option value="medical">Medical</option>
              <option value="management">Management</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Preferred state (optional)</span>
            <input
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Tamil Nadu, Karnataka, ..."
              value={answers.state}
              onChange={(e) => onFieldChange('state', e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Annual budget</span>
            <select
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              value={answers.budget}
              onChange={(e) => onFieldChange('budget', e.target.value)}
            >
              <option value="low">Up to 1.5L</option>
              <option value="medium">Up to 2.5L</option>
              <option value="high">Flexible</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Minimum placement priority (%)</span>
            <input
              type="number"
              min="50"
              max="100"
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              value={answers.placementPriority}
              onChange={(e) => onFieldChange('placementPriority', e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">College type</span>
            <select
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2"
              value={answers.type}
              onChange={(e) => onFieldChange('type', e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
            </select>
          </label>

          <button
            disabled={!canSubmit || loading}
            onClick={submitQuiz}
            className="w-full bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg py-2.5 font-semibold disabled:bg-slate-300 disabled:text-slate-600"
          >
            {loading ? 'Generating...' : 'Get My Shortlist'}
          </button>
          {error && <p className="text-sm text-rose-700">{error}</p>}
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-300 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Recommended Colleges</h3>
          {results.length === 0 && !loading && (
            <p className="text-slate-600">Submit the quiz to see your personalized recommendations.</p>
          )}
          <div className="space-y-3">
            {results.map((college) => (
              <div key={college.id} className="border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <Link href={`/colleges/${college.id}`} className="text-lg font-semibold text-indigo-700 hover:underline">
                    {college.name}
                  </Link>
                  <p className="text-sm text-slate-600 mt-1">{college.location}</p>
                  <p className="text-sm text-slate-700 mt-2">
                    Rank #{college.ranking} • Placement {college.placement_rate}% • Fees ₹{college.fees.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Quiz match</p>
                  <p className="text-2xl font-bold text-emerald-700">{college.quizMatch}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
