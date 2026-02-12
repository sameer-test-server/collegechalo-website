import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null;

if (!uri) {
  // No MongoDB configured — leave clientPromise null so callers can fallback gracefully
  clientPromise = null;
} else {
  client = new MongoClient(uri);

  if (process.env.NODE_ENV === 'development') {
    // Ensure the client is cached across module reloads in development
    const globalWithMongo = global as unknown as { _mongoClientPromise?: Promise<MongoClient> };
    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }
}

export default clientPromise;
