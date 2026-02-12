#!/usr/bin/env ts-node
import clientPromise from '../src/lib/mongodb';

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set.');
    process.exit(2);
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    await db.collection('colleges').createIndex({ id: 1 }, { unique: true, background: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true, background: true });
    await db.collection('saved_colleges').createIndex({ userId: 1, collegeId: 1 }, { unique: true, background: true });
    await db.collection('applications').createIndex({ userId: 1 }, { background: true });
    console.log('Indexes created.');
  } catch (err) {
    console.error('Index creation failed:', err);
    process.exit(1);
  } finally {
    try { await client.close(); } catch {}
  }
}

main().catch(err => { console.error(err); process.exit(1); });
