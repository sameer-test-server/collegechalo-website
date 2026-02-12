import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb';
import { findUserByEmail, createUser } from '../../../../lib/users';
import { checkRateLimit, getRequestIdentifier } from '../../../../lib/rate-limit';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password, phone } = body;

  const requester = getRequestIdentifier(request);
  const limiter = checkRateLimit({
    key: `auth:register:${requester}`,
    max: 10,
    windowMs: 60 * 1000,
  });
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfterSec) } }
    );
  }

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Name, email, and password are required' },
      { status: 400 }
    );
  }

  try {
    // Try MongoDB first
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 409 }
          );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const result = await usersCollection.insertOne({
          name,
          email,
          password: hashedPassword,
          phone: phone || '',
          created_at: new Date(),
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Registration successful',
            user: {
              id: result.insertedId,
              name,
              email,
              phone,
            },
          },
          { status: 201 }
        );
      } catch {
        console.warn('[auth-register] MongoDB write failed, falling back to in-memory storage');
      }
    }

    // Fallback: Use in-memory storage
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in fallback storage
    const newUser = createUser({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      created_at: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: {
          id: newUser._id,
          name,
          email,
          phone,
        },
      },
      { status: 201 }
    );
  } catch {
    console.error('[auth-register] Unhandled error');
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
