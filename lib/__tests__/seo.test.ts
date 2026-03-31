/**
 * Unit tests for lib/seo.ts utility functions
 */

import { getBaseUrl, toAbsoluteUrl, getDefaultLogoUrl, getDefaultOgImageUrl } from '../seo';

const DEFAULT_SITE_URL = 'https://www.oliotyaugandasafaris.com';

describe('getBaseUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns default URL when env var is not set', () => {
    expect(getBaseUrl()).toBe(DEFAULT_SITE_URL);
  });

  it('returns default URL when env var is empty string', () => {
    expect(getBaseUrl('')).toBe(DEFAULT_SITE_URL);
  });

  it('returns default URL when env var is only whitespace', () => {
    expect(getBaseUrl('   ')).toBe(DEFAULT_SITE_URL);
  });

  it('returns cleaned URL from env var', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    expect(getBaseUrl()).toBe('https://example.com');
  });

  it('strips trailing slash from URL', () => {
    expect(getBaseUrl('https://example.com/')).toBe('https://example.com');
  });

  it('strips multiple trailing slashes', () => {
    expect(getBaseUrl('https://example.com///')).toBe('https://example.com');
  });

  it('prepends https:// when protocol is missing', () => {
    expect(getBaseUrl('example.com')).toBe('https://example.com');
  });

  it('accepts explicit https:// URL argument', () => {
    expect(getBaseUrl('https://mysite.com')).toBe('https://mysite.com');
  });

  it('accepts explicit http:// URL argument', () => {
    expect(getBaseUrl('http://localhost:3000')).toBe('http://localhost:3000');
  });

  it('strips trailing slash from localhost URL', () => {
    expect(getBaseUrl('http://localhost:3000/')).toBe('http://localhost:3000');
  });

  it('returns default URL for clearly invalid value', () => {
    // Malformed URL that new URL() would throw on
    expect(getBaseUrl('not a url !!!')).toBe(DEFAULT_SITE_URL);
  });

  it('preserves path in base URL', () => {
    expect(getBaseUrl('https://example.com/subdir')).toBe('https://example.com/subdir');
  });
});

describe('toAbsoluteUrl', () => {
  const BASE = 'https://example.com';

  it('returns absolute https URL unchanged', () => {
    expect(toAbsoluteUrl('https://cdn.example.com/image.jpg', BASE)).toBe('https://cdn.example.com/image.jpg');
  });

  it('returns absolute http URL unchanged', () => {
    expect(toAbsoluteUrl('http://cdn.example.com/image.jpg', BASE)).toBe('http://cdn.example.com/image.jpg');
  });

  it('converts a root-relative path to absolute URL', () => {
    expect(toAbsoluteUrl('/about', BASE)).toBe('https://example.com/about');
  });

  it('converts a path without leading slash to absolute URL', () => {
    expect(toAbsoluteUrl('about', BASE)).toBe('https://example.com/about');
  });

  it('handles nested paths', () => {
    expect(toAbsoluteUrl('/packages/gorilla-trekking', BASE)).toBe('https://example.com/packages/gorilla-trekking');
  });

  it('uses default base URL when no base provided', () => {
    const result = toAbsoluteUrl('/contact');
    expect(result).toContain('/contact');
    expect(result).toMatch(/^https?:\/\//);
  });
});

describe('getDefaultLogoUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns R2 logo URL when R2 base is configured', () => {
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL = 'https://pub-abc.r2.dev';
    const result = getDefaultLogoUrl('https://example.com');
    expect(result).toBe('https://pub-abc.r2.dev/nambi-uganda-safaris/images/fox_logo.webp');
  });

  it('strips trailing slash from R2 base before appending logo path', () => {
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL = 'https://pub-abc.r2.dev/';
    const result = getDefaultLogoUrl('https://example.com');
    expect(result).toBe('https://pub-abc.r2.dev/nambi-uganda-safaris/images/fox_logo.webp');
  });

  it('falls back to /opengraph-image when R2 is not configured', () => {
    const result = getDefaultLogoUrl('https://example.com');
    expect(result).toBe('https://example.com/opengraph-image');
  });
});

describe('getDefaultOgImageUrl', () => {
  it('returns absolute URL pointing to /opengraph-image', () => {
    const result = getDefaultOgImageUrl('https://example.com');
    expect(result).toBe('https://example.com/opengraph-image');
  });

  it('uses default base when no base provided', () => {
    const result = getDefaultOgImageUrl();
    expect(result).toMatch(/^https?:\/\//);
    expect(result).toContain('/opengraph-image');
  });
});
