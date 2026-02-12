import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../../lib/mongodb';
import { findUserByEmail } from '../../../../lib/users';
import { checkRateLimit, getRequestIdentifier } from '../../../../lib/rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  const requester = getRequestIdentifier(request);
  const limiter = checkRateLimit({
    key: `auth:login:${requester}`,
    max: 20,
    windowMs: 60 * 1000,
  });
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfterSec) } }
    );
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {
    let user: any = null;

    // Try MongoDB first
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');
        user = await usersCollection.findOne({ email });
      } catch {
        console.warn('[auth-login] MongoDB lookup failed, falling back to in-memory storage');
      }
    }

    // Fallback: Use in-memory storage if MongoDB failed or not configured
    if (!user) {
      user = findUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch {
    console.error('[auth-login] Unhandled error');
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
