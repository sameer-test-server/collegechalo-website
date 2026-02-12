import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';
import { addReview, getReviews, getSeedReviews } from '../../../lib/reviews';

export async function GET(request: NextRequest) {
  const collegeId = request.nextUrl.searchParams.get('collegeId');
  if (!collegeId) {
    return NextResponse.json({ success: false, error: 'Missing collegeId' }, { status: 400 });
  }

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('reviews');
      const results = await collection
        .find({ collegeId })
        .sort({ created_at: -1 })
        .limit(100)
        .toArray();
      if (!results || results.length === 0) {
        const seeded = NextResponse.json({ success: true, data: getSeedReviews(collegeId), source: 'seed' });
        seeded.headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        return seeded;
      }
      const response = NextResponse.json({ success: true, data: results, source: 'mongodb' });
      response.headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
      return response;
    } catch (err) {
      console.warn('[reviews] MongoDB fetch failed, falling back to memory');
    }
  }
  const memoryReviews = getReviews(collegeId);
  if (memoryReviews.length === 0) {
    const seeded = NextResponse.json({ success: true, data: getSeedReviews(collegeId), source: 'seed' });
    seeded.headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
    return seeded;
  }
  const response = NextResponse.json({ success: true, data: memoryReviews, source: 'memory' });
  response.headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
  return response;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { collegeId, rating, comment, name } = body || {};
  if (!collegeId || !rating) {
    return NextResponse.json({ success: false, error: 'Missing collegeId or rating' }, { status: 400 });
  }

  const ratingNum = Number(rating);
  if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ success: false, error: 'Rating must be 1-5' }, { status: 400 });
  }

  const auth = request.headers.get('authorization') || undefined;
  const user = verifyToken(auth);
  const reviewerName = user?.name || (typeof name === 'string' && name.trim()) || 'Anonymous';

  const review = {
    id: `review_${Math.random().toString(36).slice(2)}_${Date.now()}`,
    collegeId,
    rating: ratingNum,
    comment: typeof comment === 'string' ? comment.trim() : '',
    name: reviewerName,
    userId: user?.userId,
    created_at: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('reviews');
      await collection.insertOne(review);
      return NextResponse.json({ success: true, data: review });
    } catch (err) {
      console.warn('[reviews] MongoDB insert failed, falling back to memory');
    }
  }

  addReview(collegeId, review);
  return NextResponse.json({ success: true, data: review, source: 'memory' });
}
