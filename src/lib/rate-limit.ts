interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  key: string;
  max: number;
  windowMs: number;
}

declare global {
  var rateLimitStore: Map<string, RateLimitEntry>;
}

if (!global.rateLimitStore) {
  global.rateLimitStore = new Map<string, RateLimitEntry>();
}

const store = global.rateLimitStore;

export function getRequestIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export function checkRateLimit({ key, max, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const next: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(key, next);
    return {
      allowed: true,
      remaining: max - 1,
      retryAfterSec: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: true,
    remaining: Math.max(0, max - existing.count),
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

