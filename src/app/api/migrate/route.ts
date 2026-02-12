import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { seedColleges } from '../../../lib/seed';
import { getAllUsers } from '../../../lib/users';

export async function POST() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ success: false, message: 'MONGODB_URI not configured' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Seed colleges using existing helper (it also checks for existing data)
    const collegeResult = await seedColleges();

    // Seed users from in-memory store (safe for initial migration)
    const users = getAllUsers();
    const usersCollection = db.collection('users');
    let usersInserted = 0;
    for (const u of users) {
      // Use upsert to avoid duplicates; preserve hashed password and _id when available
      const filter = { email: u.email };
      const update = { $setOnInsert: { ...u } };
      const res = await usersCollection.updateOne(filter, update, { upsert: true });
      if ((res as any).upsertedCount && (res as any).upsertedCount > 0) usersInserted++;
    }

    return NextResponse.json({ success: true, colleges: collegeResult, usersInserted });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
