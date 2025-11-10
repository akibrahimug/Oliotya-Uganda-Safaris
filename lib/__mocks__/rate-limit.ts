// Mock rate-limit module to avoid ES module issues with @upstash in Jest

export const contactRateLimit = {
  limit: jest.fn(async () => ({ success: true, remaining: 999, reset: 0, limit: 999, pending: Promise.resolve() })),
};

export const bookingRateLimit = {
  limit: jest.fn(async () => ({ success: true, remaining: 999, reset: 0, limit: 999, pending: Promise.resolve() })),
};

export const newsletterRateLimit = {
  limit: jest.fn(async () => ({ success: true, remaining: 999, reset: 0, limit: 999, pending: Promise.resolve() })),
};

export const searchRateLimit = {
  limit: jest.fn(async () => ({ success: true, remaining: 999, reset: 0, limit: 999, pending: Promise.resolve() })),
};

export function getClientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim()
    || headers.get('x-real-ip')
    || 'unknown';
}
