import { NextRequest, NextResponse } from 'next/server';

const newsItems = [
  {
    id: 'news_1',
    title: 'JEE Main Counselling Timeline for 2026 Released',
    category: 'Engineering',
    date: '2026-02-09',
    summary: 'Students can start preparing branch preferences and document sets for the first counselling rounds.',
    source: 'College Chalo Editorial',
  },
  {
    id: 'news_2',
    title: 'NEET UG Planning Checklist: What to Complete Before Registration',
    category: 'Medical',
    date: '2026-02-07',
    summary: 'A practical checklist for documents, category certificates, and score-target planning.',
    source: 'College Chalo Editorial',
  },
  {
    id: 'news_3',
    title: 'Top Tamil Nadu Engineering Colleges to Watch This Admission Cycle',
    category: 'Tamil Nadu',
    date: '2026-02-05',
    summary: 'A focused list covering reputed public and private options with placement context.',
    source: 'College Chalo Editorial',
  },
  {
    id: 'news_4',
    title: 'How to Compare Colleges Beyond Ranking: ROI and Placement Quality',
    category: 'Guides',
    date: '2026-02-03',
    summary: 'Use fees, median package, recruiter profile, and location fit as a combined decision framework.',
    source: 'College Chalo Editorial',
  },
  {
    id: 'news_5',
    title: 'Application Window Alert: Keep a Single Tracker for Deadlines',
    category: 'Admissions',
    date: '2026-02-01',
    summary: 'Track deadlines, fees, and status in one place to avoid late submissions.',
    source: 'College Chalo Editorial',
  },
  {
    id: 'news_6',
    title: 'Scholarship and Fee Waiver Tips for First-Year Students',
    category: 'Finance',
    date: '2026-01-30',
    summary: 'Identify tuition support paths early and prepare documents before verification windows open.',
    source: 'College Chalo Editorial',
  },
];

export async function GET(request: NextRequest) {
  const category = (request.nextUrl.searchParams.get('category') || '').trim().toLowerCase();
  const limit = Number(request.nextUrl.searchParams.get('limit') || 20);
  const data = category
    ? newsItems.filter((item) => item.category.toLowerCase() === category)
    : newsItems;

  const res = NextResponse.json({
    success: true,
    data: data.slice(0, Number.isFinite(limit) && limit > 0 ? limit : 20),
    total: data.length,
  });
  res.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=1800');
  return res;
}
