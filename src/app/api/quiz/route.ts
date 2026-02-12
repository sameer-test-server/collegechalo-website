import { NextRequest, NextResponse } from 'next/server';
import { collegesData } from '../../../lib/colleges-data';
import { generateIndexId } from '../../../lib/id-generator';

function parseBudget(input: string) {
  if (input === 'low') return 150000;
  if (input === 'medium') return 250000;
  return 9999999;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const stream = String(body?.stream || 'engineering').toLowerCase();
  const preferredState = String(body?.state || '').trim().toLowerCase();
  const budget = parseBudget(String(body?.budget || 'high'));
  const placementPriority = Number(body?.placementPriority || 80);
  const collegeType = String(body?.type || 'Any');

  let filtered = collegesData.map((college, idx) => ({
    id: generateIndexId('college', idx),
    ...college,
  }));

  if (preferredState) {
    filtered = filtered.filter((college) => college.state.toLowerCase() === preferredState);
  }

  if (collegeType === 'Government' || collegeType === 'Private') {
    filtered = filtered.filter((college) => college.type === collegeType);
  }

  filtered = filtered.filter(
    (college) =>
      college.fees <= budget &&
      college.placement_rate >= placementPriority &&
      (stream !== 'medical' || college.courses.some((course) => /MBBS|Medical|BDS|M\.?D/i.test(course)) || college.name.includes('Medical'))
  );

  if (filtered.length === 0) {
    filtered = collegesData
      .map((college, idx) => ({ id: generateIndexId('college', idx), ...college }))
      .filter((college) => college.placement_rate >= Math.max(70, placementPriority - 10));
  }

  const recommendations = filtered
    .sort((a, b) => {
      const rankScore = (a.ranking || 999) - (b.ranking || 999);
      if (rankScore !== 0) return rankScore;
      return b.placement_rate - a.placement_rate;
    })
    .slice(0, 10)
    .map((college) => ({
      ...college,
      quizMatch: Math.min(99, Math.max(72, Math.round((college.placement_rate + 100 - Math.min(college.ranking, 100)) / 2))),
    }));

  return NextResponse.json({
    success: true,
    data: recommendations,
    meta: {
      stream,
      preferredState: preferredState || 'any',
      budget,
      placementPriority,
      collegeType,
    },
  });
}

