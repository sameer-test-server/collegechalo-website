import { collegesData } from './colleges-data';
import clientPromise from './mongodb';
import { generateIndexId } from './id-generator';

export async function seedColleges() {
  try {
    if (!clientPromise) {
      console.log('MongoDB not configured. Skipping database seed.');
      return { success: false, message: 'MongoDB not configured' };
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('colleges');

    // Check if colleges already exist
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} colleges already exist in database.`);
      return { success: true, message: `${existingCount} colleges already exist` };
    }

    // Insert colleges with consistent IDs
    const collegesWithIds = collegesData.map((college, index) => ({
      ...college,
      id: generateIndexId('college', index),
    }));

    const result = await collection.insertMany(collegesWithIds);
    console.log(`Successfully seeded ${result.insertedCount} colleges.`);
    return {
      success: true,
      message: `Successfully seeded ${result.insertedCount} colleges`,
      insertedCount: result.insertedCount,
    };
  } catch (error) {
    console.error('Error seeding colleges:', error);
    return { success: false, error: String(error) };
  }
}
