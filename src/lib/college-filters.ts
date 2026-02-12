import { collegesData } from './colleges-data';
import { generateIndexId } from './id-generator';

/**
 * Helper to map college with its original index ID
 */
function withIds(colleges: typeof collegesData) {
  return colleges.map((college) => {
    const originalIndex = collegesData.indexOf(college);
    return {
      id: generateIndexId('college', originalIndex),
      ...college,
    };
  });
}

export function getAllColleges() {
  return collegesData.map((college, index) => ({
    id: generateIndexId('college', index),
    ...college,
  }));
}

export function getCollegesByState(state: string) {
  const filtered = collegesData.filter((college) => college.state.toLowerCase() === state.toLowerCase());
  return withIds(filtered);
}

export function getCollegesByType(type: 'Government' | 'Private') {
  const filtered = collegesData.filter((college) => college.type === type);
  return withIds(filtered);
}

export function searchColleges(query: string) {
  const lowerQuery = query.toLowerCase();
  const filtered = collegesData.filter(
    (college) =>
      college.name.toLowerCase().includes(lowerQuery) ||
      college.location.toLowerCase().includes(lowerQuery) ||
      college.state.toLowerCase().includes(lowerQuery)
  );
  return withIds(filtered);
}

export function getTop10Colleges() {
  const filtered = collegesData.slice(0, 10);
  return withIds(filtered);
}

export function getCollegesByRankingRange(minRank: number, maxRank: number) {
  const filtered = collegesData.filter((college) => college.ranking >= minRank && college.ranking <= maxRank);
  return withIds(filtered);
}

export function getCollegesByPlacementRange(minPlacement: number, maxPlacement: number) {
  const filtered = collegesData.filter((college) => college.placement_rate >= minPlacement && college.placement_rate <= maxPlacement);
  return withIds(filtered);
}

export function getCollegeById(id: string) {
  const m = id.match(/^college_(\d+)$/);
  if (!m) return null;
  const idx = parseInt(m[1], 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= collegesData.length) return null;
  return {
    id,
    ...collegesData[idx],
  };
}
