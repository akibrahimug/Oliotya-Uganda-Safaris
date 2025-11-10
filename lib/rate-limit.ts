import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis instance from environment variables
// If not configured, we'll use a mock for development
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : null;

// Mock rate limiter for development (always allows requests)
const mockRateLimit = {
  limit: async () => ({ success: true, remaining: 999, reset: 0, limit: 999, pending: Promise.resolve() }),
};

// Contact form rate limiter: 10 requests per hour
export const contactRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      analytics: true,
      prefix: 'ratelimit:contact',
    })
  : mockRateLimit;

// Booking form rate limiter: 5 requests per hour
export const bookingRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
      prefix: 'ratelimit:booking',
    })
  : mockRateLimit;

// Newsletter rate limiter: 3 requests per hour
export const newsletterRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'ratelimit:newsletter',
    })
  : mockRateLimit;

// Search rate limiter: 100 requests per hour (more lenient)
export const searchRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 h'),
      analytics: true,
      prefix: 'ratelimit:search',
    })
  : mockRateLimit;

// Helper function to get client IP from headers
export function getClientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim()
    || headers.get('x-real-ip')
    || 'unknown';
}
