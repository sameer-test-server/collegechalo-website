#!/usr/bin/env ts-node
import clientPromise from '../src/lib/mongodb';
import { seedColleges } from '../src/lib/seed';
import { getAllUsers } from '../src/lib/users';

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const noTxn = args.includes('--no-transactions');

  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set. Set it and re-run.');
    process.exit(1);
  }

  const client = await clientPromise;
  const db = client.db();
  const collegesCollection = db.collection('colleges');
  const usersCollection = db.collection('users');

  try {
    if (dryRun) {
      const existingColleges = await collegesCollection.countDocuments();
      const collegesModule = await import('../src/lib/colleges-data');
      const totalColleges = Array.isArray(collegesModule.collegesData) ? collegesModule.collegesData.length : 0;
      const users = getAllUsers();
      console.log('Dry run summary:');
      console.log(` - colleges in DB: ${existingColleges}`);
      console.log(` - total colleges in code: ${totalColleges}`);
      console.log(` - in-memory users: ${users.length}`);
      process.exit(0);
    }

    // Use transaction when available (replica set); optional via --no-transactions
    const useTxn = !noTxn;
    if (useTxn) {
      const session = client.startSession();
      try {
        session.startTransaction();

        const collegeResult = await seedColleges();

        const users = getAllUsers();
        let usersInserted = 0;
        for (const u of users) {
          const filter = { email: u.email };
          const update = { $setOnInsert: { ...u } };
          const res = await usersCollection.updateOne(filter, update as any, { upsert: true, session });
          if ((res as any).upsertedCount && (res as any).upsertedCount > 0) usersInserted++;
        }

        await session.commitTransaction();
        console.log('Migration completed in transaction.');
        console.log('Colleges:', collegeResult);
        console.log('Users inserted:', usersInserted);
      } catch (err) {
        await session.abortTransaction();
        console.error('Transaction failed, aborted:', err);
        process.exit(1);
      } finally {
        session.endSession();
      }
    } else {
      // Fallback: run without transactions
      const collegeResult = await seedColleges();
      const users = getAllUsers();
      let usersInserted = 0;
      for (const u of users) {
        const filter = { email: u.email };
        const update = { $setOnInsert: { ...u } };
        const res = await usersCollection.updateOne(filter, update as any, { upsert: true });
        if ((res as any).upsertedCount && (res as any).upsertedCount > 0) usersInserted++;
      }
      console.log('Migration completed (no transactions).');
      console.log('Colleges:', collegeResult);
      console.log('Users inserted:', usersInserted);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close client if possible
    try { await client.close(); } catch {}
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
