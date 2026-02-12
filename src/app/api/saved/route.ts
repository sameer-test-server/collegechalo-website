import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || undefined;
  const user = verifyToken(auth);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!clientPromise) {
    return NextResponse.json({ error: 'MongoDB not configured' }, { status: 501 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const items = await db.collection('saved_colleges').find({ userId: user.userId }).toArray();
    return NextResponse.json({ success: true, saved: items });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || undefined;
  const user = verifyToken(auth);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!clientPromise) {
    return NextResponse.json({ error: 'MongoDB not configured' }, { status: 501 });
  }

  const body = await req.json();
  const { collegeId } = body || {};
  if (!collegeId) return NextResponse.json({ error: 'Missing collegeId' }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db();
    // upsert to avoid duplicates
    await db.collection('saved_colleges').updateOne({ userId: user.userId, collegeId }, { $setOnInsert: { userId: user.userId, collegeId, savedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
