import { getAllColleges, getCollegesByState, searchColleges, getCollegesByPlacementRange, getCollegeById } from '../src/lib/college-filters';

test('getAllColleges returns array with ids', () => {
  const all = getAllColleges();
  expect(Array.isArray(all)).toBe(true);
  expect(all.length).toBeGreaterThan(0);
  expect(all[0]).toHaveProperty('id');
  expect(all[0]).toHaveProperty('name');
});

test('getCollegesByState preserves stable ids', () => {
  const mumbai = getCollegesByState('Maharashtra');
  expect(Array.isArray(mumbai)).toBe(true);
  if (mumbai.length > 0) {
    expect(mumbai[0].id).toMatch(/college_\d+/);
    expect(mumbai.every(c => c.state.toLowerCase() === 'maharashtra')).toBe(true);
  }
});

test('searchColleges finds results for common terms', () => {
  const res = searchColleges('Indian');
  expect(Array.isArray(res)).toBe(true);
  if (res.length > 0) {
    expect(res[0]).toHaveProperty('id');
  }
});

test('getCollegesByPlacementRange filters correctly', () => {
  const res = getCollegesByPlacementRange(95, 100);
  expect(Array.isArray(res)).toBe(true);
  if (res.length > 0) {
    expect(res.every(c => c.placement_rate >= 95 && c.placement_rate <= 100)).toBe(true);
  }
});

test('getCollegeById returns college object for valid id', () => {
  const c = getCollegeById('college_1');
  expect(c).not.toBeNull();
  if (c) {
    expect(c).toHaveProperty('id', 'college_1');
    expect(c).toHaveProperty('name');
  }
});
