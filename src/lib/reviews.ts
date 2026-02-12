import { collegesData } from './colleges-data';

interface Review {
  id: string;
  collegeId: string;
  rating: number;
  comment?: string;
  name: string;
  userId?: string;
  created_at: string;
}

declare global {
  var reviewsDatabase: Map<string, Review[]>;
}

if (!global.reviewsDatabase) {
  global.reviewsDatabase = new Map<string, Review[]>();
}

const reviews = global.reviewsDatabase;

export function getReviews(collegeId: string): Review[] {
  return reviews.get(collegeId) || [];
}

export function addReview(collegeId: string, review: Review): Review {
  const list = reviews.get(collegeId) || [];
  list.unshift(review);
  reviews.set(collegeId, list);
  return review;
}

export function getSeedReviews(collegeId: string): Review[] {
  const match = collegeId.match(/^college_(\d+)$/);
  if (!match) return [];
  const idx = parseInt(match[1], 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx >= collegesData.length) return [];

  const college = collegesData[idx];
  const fallbackRating = college.rating ? Math.round(college.rating) : 4;
  const ratingOne = Math.max(3, Math.min(5, fallbackRating));
  const ratingTwo = Math.max(3, Math.min(5, fallbackRating - 1));

  return [
    {
      id: `seed_${collegeId}_1`,
      collegeId,
      rating: ratingOne,
      comment: `Strong academics and good student support. ${college.description || ''}`.trim(),
      name: 'Verified Student',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    },
    {
      id: `seed_${collegeId}_2`,
      collegeId,
      rating: ratingTwo,
      comment: 'Campus environment and placement guidance are good overall.',
      name: 'Alumni Feedback',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    },
  ];
}
