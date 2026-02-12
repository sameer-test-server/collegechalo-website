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
    const apps = await db.collection('applications').find({ userId: user.userId }).toArray();
    return NextResponse.json({ success: true, applications: apps });
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
  const { collegeId, collegeName, deadline } = body || {};
  if (!collegeId || !collegeName) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db();
    const doc = {
      userId: user.userId,
      collegeId,
      collegeName,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      deadline: deadline || null,
    } as any;
    const res = await db.collection('applications').insertOne(doc);
    return NextResponse.json({ success: true, insertedId: res.insertedId, application: doc }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
