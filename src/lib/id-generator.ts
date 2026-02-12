/**
 * Generate consistent IDs for colleges based on their name and location
 * This ensures IDs are always the same for the same college
 */
export function generateCollegeId(name: string, location: string): string {
  // Create a slug from name and location
  const slug = `${name}-${location}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  return slug;
}

/**
 * Generate UUID-like IDs for applications and saved items
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create stable index-based IDs (college_1, college_2, etc)
 */
export function generateIndexId(prefix: string, index: number): string {
  return `${prefix}_${index + 1}`;
}
