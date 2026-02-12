import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';
import { getPreferences, savePreferences } from '../../../lib/preferences';

function authUser(request: NextRequest) {
  const auth = request.headers.get('authorization') || undefined;
  return verifyToken(auth);
}

const DEFAULT_PREFERENCES = {
  preferredStates: [] as string[],
  preferredType: 'Any' as 'Any' | 'Government' | 'Private',
  maxFees: 300000,
  minPlacement: 70,
  preferredCourse: '',
};

export async function GET(request: NextRequest) {
  const user = authUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('user_preferences');
      const item = await collection.findOne({ userId: user.userId });
      if (item) return NextResponse.json({ success: true, data: item, source: 'mongodb' });
    } catch (err) {
      console.warn('[preferences] MongoDB read failed, falling back to memory');
    }
  }

  const existing = getPreferences(user.userId);
  return NextResponse.json({
    success: true,
    data: existing || { userId: user.userId, ...DEFAULT_PREFERENCES, updatedAt: new Date().toISOString() },
    source: 'memory',
  });
}

export async function PUT(request: NextRequest) {
  const user = authUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const item = {
    userId: user.userId,
    preferredStates: Array.isArray(body?.preferredStates)
      ? body.preferredStates.map((x: unknown) => String(x)).slice(0, 10)
      : [],
    preferredType:
      body?.preferredType === 'Government' || body?.preferredType === 'Private'
        ? body.preferredType
        : 'Any',
    maxFees: Number(body?.maxFees) > 0 ? Number(body.maxFees) : DEFAULT_PREFERENCES.maxFees,
    minPlacement: Number(body?.minPlacement) >= 0 ? Number(body.minPlacement) : DEFAULT_PREFERENCES.minPlacement,
    preferredCourse: typeof body?.preferredCourse === 'string' ? body.preferredCourse.trim() : '',
    updatedAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('user_preferences');
      await collection.updateOne(
        { userId: user.userId },
        { $set: item, $setOnInsert: { created_at: new Date().toISOString() } },
        { upsert: true }
      );
      return NextResponse.json({ success: true, data: item, source: 'mongodb' });
    } catch (err) {
      console.warn('[preferences] MongoDB write failed, falling back to memory');
    }
  }

  const saved = savePreferences(item);
  return NextResponse.json({ success: true, data: saved, source: 'memory' });
}
