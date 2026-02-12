import { collegesData } from './colleges-data';
import { generateIndexId } from './id-generator';

export interface AdminCollege {
  id: string;
  name: string;
  location: string;
  state: string;
  founded: number;
  ranking: number;
  fees: number;
  placement_rate: number;
  rating: number;
  description: string;
  courses: string[];
  reviews_count: number;
  image_url: string;
  type: string;
  website?: string;
}

declare global {
  var adminCollegesDb: Map<string, AdminCollege>;
}

if (!global.adminCollegesDb) {
  global.adminCollegesDb = new Map<string, AdminCollege>();
  collegesData.forEach((college, idx) => {
    const id = generateIndexId('college', idx);
    global.adminCollegesDb.set(id, {
      id,
      name: college.name,
      location: college.location,
      state: college.state,
      founded: college.founded,
      ranking: college.ranking,
      fees: college.fees,
      placement_rate: college.placement_rate,
      rating: college.rating,
      description: college.description,
      courses: college.courses || [],
      reviews_count: college.reviews_count || 0,
      image_url: college.image_url,
      type: college.type,
      website: college.website,
    });
  });
}

const store = global.adminCollegesDb;

export function listAdminColleges(): AdminCollege[] {
  return Array.from(store.values()).sort((a, b) => a.ranking - b.ranking);
}

export function createAdminCollege(input: Omit<AdminCollege, 'id'>): AdminCollege {
  const id = `college_custom_${Date.now()}`;
  const item: AdminCollege = { id, ...input };
  store.set(id, item);
  return item;
}

export function updateAdminCollege(id: string, patch: Partial<AdminCollege>): AdminCollege | null {
  const existing = store.get(id);
  if (!existing) return null;
  const next = { ...existing, ...patch, id: existing.id };
  store.set(id, next);
  return next;
}

export function deleteAdminCollege(id: string): boolean {
  return store.delete(id);
}

