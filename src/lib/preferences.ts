export interface UserPreferences {
  userId: string;
  preferredStates: string[];
  preferredType: 'Any' | 'Government' | 'Private';
  maxFees: number;
  minPlacement: number;
  preferredCourse: string;
  updatedAt: string;
}

declare global {
  var preferencesDatabase: Map<string, UserPreferences>;
}

if (!global.preferencesDatabase) {
  global.preferencesDatabase = new Map<string, UserPreferences>();
}

const preferences = global.preferencesDatabase;

export function getPreferences(userId: string): UserPreferences | null {
  return preferences.get(userId) || null;
}

export function savePreferences(input: UserPreferences): UserPreferences {
  const item = { ...input, updatedAt: new Date().toISOString() };
  preferences.set(input.userId, item);
  return item;
}

