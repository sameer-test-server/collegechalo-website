import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../../lib/mongodb';
import { findUserByEmail } from '../../../../../lib/users';
import { signAdminToken } from '../../../../../lib/admin-auth';
import { checkRateLimit, getRequestIdentifier } from '../../../../../lib/rate-limit';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email;
  const password = body?.password;

  const requester = getRequestIdentifier(request);
  const limiter = checkRateLimit({
    key: `auth:admin-login:${requester}`,
    max: 8,
    windowMs: 60 * 1000,
  });
  if (!limiter.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many admin login attempts. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfterSec) } }
    );
  }

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
  }

  try {
    let user: any = null;

    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db();
        user = await db.collection('users').findOne({ email });
      } catch (err) {
        console.warn('[admin-auth] MongoDB lookup failed, falling back to in-memory users');
      }
    }

    if (!user) {
      user = findUserByEmail(email);
    }

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access denied' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signAdminToken({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: 'admin',
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Admin login failed' }, { status: 500 });
  }
}
