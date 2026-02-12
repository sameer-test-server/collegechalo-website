import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { collegesData } from '../../../lib/colleges-data';
import { generateIndexId } from '../../../lib/id-generator';
import type { Filter } from 'mongodb';

function withApiCache(response: NextResponse, maxAgeSec = 60, swrSec = 300) {
  response.headers.set('Cache-Control', `public, max-age=${maxAgeSec}, stale-while-revalidate=${swrSec}`);
  return response;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get('state');
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const minRank = searchParams.get('minRank');
  const maxRank = searchParams.get('maxRank');
  const minPlacement = searchParams.get('minPlacement');
  const maxPlacement = searchParams.get('maxPlacement');
  const idParam = searchParams.get('id');

  // Create a map of colleges with their original indices
  let filteredColleges = collegesData.map((college, index) => ({
    ...college,
    _originalIndex: index,
  }));

  // If an explicit id is requested, return that single college
  if (idParam) {
    // Try MongoDB first if configured
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('colleges');
      const found = await collection.findOne({ id: idParam });
        if (found) return withApiCache(NextResponse.json({ success: true, data: found }), 120, 600);
      } catch (err) {
        console.warn('[colleges] MongoDB id lookup failed, falling back to static data');
      }
    }

    const match = idParam.match(/^college_(\d+)$/);
    if (match) {
      const index = parseInt(match[1], 10) - 1;
      if (!isNaN(index) && index >= 0 && index < collegesData.length) {
        const college = collegesData[index];
        return withApiCache(NextResponse.json({ success: true, data: { id: idParam, ...college } }), 120, 600);
      }
    }

    return NextResponse.json({ success: false, data: null }, { status: 404 });
  }

  // Apply filters
  if (state) {
    filteredColleges = filteredColleges.filter((c) => c.state.toLowerCase() === state.toLowerCase());
  }

  if (type) {
    filteredColleges = filteredColleges.filter((c) => c.type === type);
  }

  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredColleges = filteredColleges.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerSearch) ||
        c.location.toLowerCase().includes(lowerSearch) ||
        c.state.toLowerCase().includes(lowerSearch)
    );
  }

  if (minRank) {
    const min = parseInt(minRank);
    filteredColleges = filteredColleges.filter((c) => c.ranking >= min);
  }

  if (maxRank) {
    const max = parseInt(maxRank);
    filteredColleges = filteredColleges.filter((c) => c.ranking <= max);
  }

  if (minPlacement) {
    const min = parseInt(minPlacement);
    filteredColleges = filteredColleges.filter((c) => c.placement_rate >= min);
  }

  if (maxPlacement) {
    const max = parseInt(maxPlacement);
    filteredColleges = filteredColleges.filter((c) => c.placement_rate <= max);
  }

  // Add proper IDs based on original index
  const colleges = filteredColleges.map((college) => {
    const { _originalIndex, ...collegeData } = college;
    return {
      id: generateIndexId('college', _originalIndex),
      ...collegeData,
    };
  });

  // If MongoDB is configured, fetch filtered list directly from MongoDB
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('colleges');
      const mongoQuery: Filter<any> = {};

      if (state) mongoQuery.state = { $regex: new RegExp(`^${state}$`, 'i') };
      if (type) mongoQuery.type = type;
      if (minRank || maxRank) {
        mongoQuery.ranking = {};
        if (minRank) mongoQuery.ranking.$gte = parseInt(minRank, 10);
        if (maxRank) mongoQuery.ranking.$lte = parseInt(maxRank, 10);
      }
      if (minPlacement || maxPlacement) {
        mongoQuery.placement_rate = {};
        if (minPlacement) mongoQuery.placement_rate.$gte = parseInt(minPlacement, 10);
        if (maxPlacement) mongoQuery.placement_rate.$lte = parseInt(maxPlacement, 10);
      }
      if (search) {
        const regex = new RegExp(search, 'i');
        mongoQuery.$or = [{ name: regex }, { location: regex }, { state: regex }];
      }

      const mongoColleges = (await collection.find(mongoQuery).limit(200).toArray()) as any[];

      if (mongoColleges && mongoColleges.length > 0) {
        // Merge MongoDB and static filtered dataset so newly added static colleges
        // remain visible even if Mongo data is from an older migration.
        const merged = [...mongoColleges];
        const seen = new Set(
          mongoColleges.map((item: any) => `${String(item.id || '').toLowerCase()}::${String(item.name || '').toLowerCase()}`)
        );

        for (const item of colleges) {
          const key = `${String((item as any).id || '').toLowerCase()}::${String((item as any).name || '').toLowerCase()}`;
          if (!seen.has(key)) {
            merged.push(item);
            seen.add(key);
          }
        }

        merged.sort((a: any, b: any) => (Number(a.ranking) || 9999) - (Number(b.ranking) || 9999));

        return withApiCache(
          NextResponse.json({ success: true, data: merged, total: merged.length, source: 'mongodb+static' }),
          60,
          300
        );
      }
    } catch (err) {
      console.warn('[colleges] MongoDB list fetch failed, falling back to static data');
    }
  }

  return withApiCache(
    NextResponse.json({
      success: true,
      data: colleges,
      total: colleges.length,
      warning: !clientPromise ? 'MONGODB_URI not configured, using static data' : undefined,
    }),
    60,
    300
  );
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!clientPromise) {
    return NextResponse.json({ success: false, error: 'MONGODB_URI not configured' }, { status: 503 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('colleges');
    const result = await collection.insertOne({ ...body, created_at: new Date() });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
