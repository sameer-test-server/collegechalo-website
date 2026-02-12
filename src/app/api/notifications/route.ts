import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';
import { addNotification, getNotifications, markAllRead } from '../../../lib/notifications';

function getAuthUser(request: NextRequest) {
  const auth = request.headers.get('authorization') || undefined;
  return verifyToken(auth);
}

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('notifications');
      const data = await collection
        .find({ userId: user.userId })
        .sort({ created_at: -1 })
        .limit(50)
        .toArray();
      return NextResponse.json({ success: true, data, source: 'mongodb' });
    } catch (err) {
      console.warn('[notifications] MongoDB fetch failed, falling back to memory');
    }
  }

  return NextResponse.json({ success: true, data: getNotifications(user.userId), source: 'memory' });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const type = body?.type === 'success' || body?.type === 'warning' ? body.type : 'info';

  if (!title || !message) {
    return NextResponse.json({ success: false, error: 'Missing title or message' }, { status: 400 });
  }

  const item = {
    id: `notif_${Math.random().toString(36).slice(2)}_${Date.now()}`,
    userId: user.userId,
    title,
    message,
    type,
    read: false,
    created_at: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('notifications');
      await collection.insertOne(item);
      return NextResponse.json({ success: true, data: item, source: 'mongodb' });
    } catch (err) {
      console.warn('[notifications] MongoDB insert failed, falling back to memory');
    }
  }

  addNotification(item);
  return NextResponse.json({ success: true, data: item, source: 'memory' });
}

export async function PATCH(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('notifications');
      const result = await collection.updateMany(
        { userId: user.userId, read: false },
        { $set: { read: true } }
      );
      return NextResponse.json({ success: true, updated: result.modifiedCount, source: 'mongodb' });
    } catch (err) {
      console.warn('[notifications] MongoDB patch failed, falling back to memory');
    }
  }

  return NextResponse.json({ success: true, updated: markAllRead(user.userId), source: 'memory' });
}
