#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import clientPromise from '../src/lib/mongodb';

async function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => !a.startsWith('--')) || 'local_data.json';
  const dryRun = args.includes('--dry-run');

  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(2);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Invalid JSON file:', err);
    process.exit(2);
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Set it and re-run.');
    process.exit(2);
  }

  const client = await clientPromise;
  const db = client.db();

  // savedColleges expected as array of { collegeId, savedAt?, userId? }
  const saved = data.savedColleges || data.saved || [];
  // applications expected as array of Application objects
  const applications = data.applications || [];

  if (dryRun) {
    console.log('Dry run:');
    console.log(' - savedColleges to import:', saved.length);
    console.log(' - applications to import:', applications.length);
    process.exit(0);
  }

  try {
    if (saved.length > 0) {
      const ops = saved.map((s: any) => ({ updateOne: { filter: { userId: s.userId, collegeId: s.collegeId }, update: { $setOnInsert: { ...s, savedAt: s.savedAt || new Date() } }, upsert: true } }));
      const res = await db.collection('saved_colleges').bulkWrite(ops, { ordered: false });
      console.log('Saved colleges processed:', res.upsertedCount || 0);
    }

    if (applications.length > 0) {
      const docs = applications.map((a: any) => ({ ...a, appliedDate: a.appliedDate || new Date().toISOString() }));
      const res = await db.collection('applications').insertMany(docs);
      console.log('Applications inserted:', res.insertedCount || 0);
    }

    console.log('Import completed.');
  } catch (err) {
    console.error('Import error:', err);
    process.exit(1);
  } finally {
    try { await client.close(); } catch {}
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
