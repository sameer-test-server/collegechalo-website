export interface ProfileCompletionInput {
  phone?: unknown;
  board?: unknown;
  percentage?: unknown;
  state?: unknown;
  bio?: unknown;
}

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasValidPercentage(value: unknown): boolean {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0;
  }
  return false;
}

export function getProfileCompletionPercent(user: ProfileCompletionInput | null | undefined): number {
  if (!user) return 0;

  const completedFields = [
    hasNonEmptyString(user.phone),
    hasNonEmptyString(user.board),
    hasValidPercentage(user.percentage),
    hasNonEmptyString(user.state),
    hasNonEmptyString(user.bio),
  ].filter(Boolean).length;

  return Math.round((completedFields / 5) * 100);
}

