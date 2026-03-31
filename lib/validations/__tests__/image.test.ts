/**
 * Unit tests for lib/validations/image.ts
 */

import {
  imageUploadSchema,
  imageUpdateSchema,
  SUPPORTED_IMAGE_FORMATS,
  MAX_IMAGE_SIZE,
} from '../image';

// ─── imageUploadSchema ────────────────────────────────────────────────────────

describe('imageUploadSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    expect(imageUploadSchema.safeParse({}).success).toBe(true);
  });

  it('accepts valid category values', () => {
    const categories = ['hero', 'destination', 'package', 'team', 'gallery', 'about', 'other'] as const;
    for (const category of categories) {
      expect(imageUploadSchema.safeParse({ category }).success).toBe(true);
    }
  });

  it('rejects invalid category', () => {
    const result = imageUploadSchema.safeParse({ category: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('accepts altText as a string', () => {
    expect(imageUploadSchema.safeParse({ altText: 'Mountain gorillas in Bwindi' }).success).toBe(true);
  });

  it('accepts both altText and category together', () => {
    const data = { altText: 'Uganda hero image', category: 'hero' };
    expect(imageUploadSchema.safeParse(data).success).toBe(true);
  });

  it('accepts empty altText', () => {
    expect(imageUploadSchema.safeParse({ altText: '' }).success).toBe(true);
  });
});

// ─── imageUpdateSchema ────────────────────────────────────────────────────────

describe('imageUpdateSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    expect(imageUpdateSchema.safeParse({}).success).toBe(true);
  });

  it('accepts valid category values', () => {
    const categories = ['hero', 'destination', 'package', 'team', 'gallery', 'about', 'other'] as const;
    for (const category of categories) {
      expect(imageUpdateSchema.safeParse({ category }).success).toBe(true);
    }
  });

  it('rejects invalid category', () => {
    const result = imageUpdateSchema.safeParse({ category: 'profile' });
    expect(result.success).toBe(false);
  });

  it('accepts altText as a string', () => {
    expect(imageUpdateSchema.safeParse({ altText: 'Updated alt text' }).success).toBe(true);
  });

  it('accepts both altText and category together', () => {
    const data = { altText: 'Safari jeep', category: 'package' };
    expect(imageUpdateSchema.safeParse(data).success).toBe(true);
  });
});

// ─── Constants ────────────────────────────────────────────────────────────────

describe('SUPPORTED_IMAGE_FORMATS', () => {
  it('contains common web image formats', () => {
    expect(SUPPORTED_IMAGE_FORMATS).toContain('image/jpeg');
    expect(SUPPORTED_IMAGE_FORMATS).toContain('image/png');
    expect(SUPPORTED_IMAGE_FORMATS).toContain('image/webp');
  });

  it('contains modern formats (avif)', () => {
    expect(SUPPORTED_IMAGE_FORMATS).toContain('image/avif');
  });

  it('contains gif and svg formats', () => {
    expect(SUPPORTED_IMAGE_FORMATS).toContain('image/gif');
    expect(SUPPORTED_IMAGE_FORMATS).toContain('image/svg+xml');
  });

  it('is a non-empty array', () => {
    expect(SUPPORTED_IMAGE_FORMATS.length).toBeGreaterThan(0);
  });

  it('all entries start with "image/"', () => {
    for (const format of SUPPORTED_IMAGE_FORMATS) {
      expect(format).toMatch(/^image\//);
    }
  });
});

describe('MAX_IMAGE_SIZE', () => {
  it('is 10 MB in bytes', () => {
    expect(MAX_IMAGE_SIZE).toBe(10 * 1024 * 1024);
  });

  it('is a positive number', () => {
    expect(MAX_IMAGE_SIZE).toBeGreaterThan(0);
  });
});
