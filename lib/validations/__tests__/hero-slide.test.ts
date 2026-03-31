/**
 * Unit tests for lib/validations/hero-slide.ts
 */

import { heroSlideSchema, heroSlideReorderSchema } from '../hero-slide';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const validSlide = {
  title: 'Discover Uganda',
  subtitle: 'The Pearl of Africa',
  description: 'Experience mountain gorillas, pristine national parks, and vibrant culture.',
  image: 'https://example.com/uganda-hero.webp',
};

// ─── heroSlideSchema ──────────────────────────────────────────────────────────

describe('heroSlideSchema', () => {
  it('accepts a valid slide', () => {
    expect(heroSlideSchema.safeParse(validSlide).success).toBe(true);
  });

  it('accepts slide with all optional fields', () => {
    const full = { ...validSlide, displayOrder: 0, active: true };
    expect(heroSlideSchema.safeParse(full).success).toBe(true);
  });

  it('accepts slide with active = false', () => {
    expect(heroSlideSchema.safeParse({ ...validSlide, active: false }).success).toBe(true);
  });

  it('accepts displayOrder = 0 (minimum)', () => {
    expect(heroSlideSchema.safeParse({ ...validSlide, displayOrder: 0 }).success).toBe(true);
  });

  // title
  it('rejects empty title', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Title is required');
    }
  });

  it('rejects title longer than 100 characters', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, title: 'A'.repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Title is too long');
    }
  });

  it('accepts title exactly 100 characters', () => {
    expect(heroSlideSchema.safeParse({ ...validSlide, title: 'A'.repeat(100) }).success).toBe(true);
  });

  // subtitle
  it('rejects empty subtitle', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, subtitle: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Subtitle is required');
    }
  });

  it('rejects subtitle longer than 100 characters', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, subtitle: 'A'.repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Subtitle is too long');
    }
  });

  // description
  it('rejects empty description', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, description: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Description is required');
    }
  });

  it('rejects description longer than 500 characters', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, description: 'A'.repeat(501) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Description is too long');
    }
  });

  it('accepts description exactly 500 characters', () => {
    expect(heroSlideSchema.safeParse({ ...validSlide, description: 'A'.repeat(500) }).success).toBe(true);
  });

  // image
  it('rejects non-URL image value', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, image: '/relative/path.jpg' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Image URL is required');
    }
  });

  it('accepts https image URL', () => {
    expect(heroSlideSchema.safeParse({ ...validSlide, image: 'https://cdn.example.com/image.jpg' }).success).toBe(true);
  });

  it('rejects negative displayOrder', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, displayOrder: -1 });
    expect(result.success).toBe(false);
  });

  it('ignores unknown fields (strips extra keys)', () => {
    const result = heroSlideSchema.safeParse({ ...validSlide, unknownField: 'ignored' });
    expect(result.success).toBe(true);
  });
});

// ─── heroSlideReorderSchema ───────────────────────────────────────────────────

describe('heroSlideReorderSchema', () => {
  it('accepts a valid reorder payload', () => {
    const data = {
      slides: [
        { id: 'abc123', displayOrder: 0 },
        { id: 'def456', displayOrder: 1 },
      ],
    };
    expect(heroSlideReorderSchema.safeParse(data).success).toBe(true);
  });

  it('accepts an empty slides array', () => {
    expect(heroSlideReorderSchema.safeParse({ slides: [] }).success).toBe(true);
  });

  it('rejects missing slides field', () => {
    expect(heroSlideReorderSchema.safeParse({}).success).toBe(false);
  });

  it('rejects slide with negative displayOrder', () => {
    const data = { slides: [{ id: 'abc', displayOrder: -1 }] };
    expect(heroSlideReorderSchema.safeParse(data).success).toBe(false);
  });

  it('rejects slide with non-integer displayOrder', () => {
    const data = { slides: [{ id: 'abc', displayOrder: 1.5 }] };
    expect(heroSlideReorderSchema.safeParse(data).success).toBe(false);
  });

  it('rejects slide missing id', () => {
    const data = { slides: [{ displayOrder: 0 }] };
    expect(heroSlideReorderSchema.safeParse(data).success).toBe(false);
  });

  it('rejects slide missing displayOrder', () => {
    const data = { slides: [{ id: 'abc' }] };
    expect(heroSlideReorderSchema.safeParse(data).success).toBe(false);
  });

  it('accepts multiple slides in correct order', () => {
    const data = {
      slides: [
        { id: '1', displayOrder: 0 },
        { id: '2', displayOrder: 1 },
        { id: '3', displayOrder: 2 },
      ],
    };
    expect(heroSlideReorderSchema.safeParse(data).success).toBe(true);
  });
});
