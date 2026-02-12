import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { checkRateLimit, getRequestIdentifier } from '../../../lib/rate-limit';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

declare global {
  var contactMessagesDb: ContactMessage[];
}

if (!global.contactMessagesDb) {
  global.contactMessagesDb = [];
}

export async function POST(request: NextRequest) {
  const limiter = checkRateLimit({
    key: `contact:${getRequestIdentifier(request)}`,
    max: 8,
    windowMs: 60 * 1000,
  });
  if (!limiter.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many messages. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfterSec) } }
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: 'Name, email and message are required.' }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ success: false, error: 'Message is too short.' }, { status: 400 });
  }

  const item: ContactMessage = {
    id: `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('contact_messages').insertOne(item);
      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    } catch (err) {
      console.warn('[contact] MongoDB insert failed, falling back to memory');
    }
  }

  global.contactMessagesDb.unshift(item);
  global.contactMessagesDb = global.contactMessagesDb.slice(0, 200);
  return NextResponse.json({ success: true, message: 'Message sent successfully.' });
}

