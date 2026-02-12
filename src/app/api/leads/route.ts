import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { checkRateLimit, getRequestIdentifier } from '../../../lib/rate-limit';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  mobile: string;
  state: string;
  source: string;
  path: string;
  createdAt: string;
}

declare global {
  var leadsMemoryDb: LeadItem[];
}

if (!global.leadsMemoryDb) {
  global.leadsMemoryDb = [];
}

const mobileRegex = /^[0-9+\-\s]{8,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const limiter = checkRateLimit({
    key: `leads:${getRequestIdentifier(request)}`,
    max: 10,
    windowMs: 60 * 60 * 1000,
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many submissions. Please try later.' },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfterSec) } }
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const mobile = typeof body?.mobile === 'string' ? body.mobile.trim() : '';
  const state = typeof body?.state === 'string' ? body.state.trim() : '';
  const source = typeof body?.source === 'string' ? body.source.trim() : 'website-popup';
  const path = typeof body?.path === 'string' ? body.path.trim() : '';

  if (!name || !email || !mobile || !state) {
    return NextResponse.json(
      { success: false, error: 'Name, email, mobile, and state are required.' },
      { status: 400 }
    );
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
  }

  if (!mobileRegex.test(mobile)) {
    return NextResponse.json({ success: false, error: 'Invalid mobile number.' }, { status: 400 });
  }

  const item: LeadItem = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    mobile,
    state,
    source,
    path,
    createdAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('leads').insertOne(item);
      return NextResponse.json({ success: true, message: 'Lead saved successfully.', data: item });
    } catch {
      console.warn('[leads] MongoDB insert failed, falling back to memory');
    }
  }

  global.leadsMemoryDb.unshift(item);
  global.leadsMemoryDb = global.leadsMemoryDb.slice(0, 500);
  return NextResponse.json({ success: true, message: 'Lead saved successfully.', data: item, source: 'memory' });
}
