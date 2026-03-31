/**
 * Unit tests for lib/validations/package.ts
 */

import {
  packageSchema,
  itineraryDaySchema,
  PACKAGE_CATEGORIES,
  DIFFICULTY_LEVELS,
} from '../package';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const validItineraryDay = {
  day: 1,
  title: 'Arrival in Kampala',
  description: 'Transfer to hotel, orientation briefing and welcome dinner.',
};

const validPackage = {
  name: 'Gorilla Trekking Adventure',
  slug: 'gorilla-trekking-adventure',
  category: 'Gorilla Trekking',
  duration: '5 Days / 4 Nights',
  price: 1500,
  description: 'An incredible journey to see mountain gorillas in their natural habitat.',
  image: 'https://example.com/gorillas.webp',
  minTravelers: 1,
  maxTravelers: 8,
  difficulty: 'MODERATE' as const,
  itinerary: [
    validItineraryDay,
    { day: 2, title: 'Gorilla Trek', description: 'Early morning trek into Bwindi Forest.' },
    { day: 3, title: 'Departure', description: 'Transfer back to Kampala airport.' },
  ],
};

// ─── itineraryDaySchema ───────────────────────────────────────────────────────

describe('itineraryDaySchema', () => {
  it('accepts valid itinerary day', () => {
    expect(itineraryDaySchema.safeParse(validItineraryDay).success).toBe(true);
  });

  it('rejects day = 0', () => {
    const result = itineraryDaySchema.safeParse({ ...validItineraryDay, day: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer day', () => {
    const result = itineraryDaySchema.safeParse({ ...validItineraryDay, day: 1.5 });
    expect(result.success).toBe(false);
  });

  it('rejects empty title', () => {
    const result = itineraryDaySchema.safeParse({ ...validItineraryDay, title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Day title is required');
    }
  });

  it('rejects title longer than 200 characters', () => {
    const result = itineraryDaySchema.safeParse({ ...validItineraryDay, title: 'A'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects empty description', () => {
    const result = itineraryDaySchema.safeParse({ ...validItineraryDay, description: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Day description is required');
    }
  });

  it('accepts day = 1 and day = 30', () => {
    expect(itineraryDaySchema.safeParse({ ...validItineraryDay, day: 1 }).success).toBe(true);
    expect(itineraryDaySchema.safeParse({ ...validItineraryDay, day: 30 }).success).toBe(true);
  });
});

// ─── packageSchema ────────────────────────────────────────────────────────────

describe('packageSchema', () => {
  it('accepts a valid package', () => {
    expect(packageSchema.safeParse(validPackage).success).toBe(true);
  });

  it('accepts package with all optional fields', () => {
    const full = {
      ...validPackage,
      shortDesc: 'Short description',
      images: ['https://example.com/a.webp'],
      highlights: ['See gorillas', 'Visit waterfalls'],
      included: ['Park fees', 'Accommodation'],
      excluded: ['Flights', 'Tips'],
      featured: true,
      popular: false,
      active: true,
      displayOrder: 0,
    };
    expect(packageSchema.safeParse(full).success).toBe(true);
  });

  // name
  it('rejects empty name', () => {
    const result = packageSchema.safeParse({ ...validPackage, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Package name is required');
    }
  });

  it('rejects name longer than 200 characters', () => {
    const result = packageSchema.safeParse({ ...validPackage, name: 'A'.repeat(201) });
    expect(result.success).toBe(false);
  });

  // slug
  it('rejects empty slug', () => {
    const result = packageSchema.safeParse({ ...validPackage, slug: '' });
    expect(result.success).toBe(false);
  });

  it('rejects slug with uppercase letters', () => {
    const result = packageSchema.safeParse({ ...validPackage, slug: 'Gorilla-Trek' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Slug must be lowercase with hyphens only');
    }
  });

  it('rejects slug with spaces', () => {
    const result = packageSchema.safeParse({ ...validPackage, slug: 'gorilla trek' });
    expect(result.success).toBe(false);
  });

  it('rejects slug with leading/trailing hyphens', () => {
    expect(packageSchema.safeParse({ ...validPackage, slug: '-gorilla-trek' }).success).toBe(false);
    expect(packageSchema.safeParse({ ...validPackage, slug: 'gorilla-trek-' }).success).toBe(false);
  });

  it('rejects slug with consecutive hyphens', () => {
    expect(packageSchema.safeParse({ ...validPackage, slug: 'gorilla--trek' }).success).toBe(false);
  });

  it('accepts valid slug with numbers', () => {
    expect(packageSchema.safeParse({ ...validPackage, slug: 'gorilla-trek-5-days' }).success).toBe(true);
  });

  // category
  it('rejects empty category', () => {
    const result = packageSchema.safeParse({ ...validPackage, category: '' });
    expect(result.success).toBe(false);
  });

  // duration
  it('rejects empty duration', () => {
    const result = packageSchema.safeParse({ ...validPackage, duration: '' });
    expect(result.success).toBe(false);
  });

  // price
  it('rejects price = 0', () => {
    const result = packageSchema.safeParse({ ...validPackage, price: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Price must be greater than 0');
    }
  });

  it('rejects negative price', () => {
    const result = packageSchema.safeParse({ ...validPackage, price: -100 });
    expect(result.success).toBe(false);
  });

  it('accepts fractional price', () => {
    expect(packageSchema.safeParse({ ...validPackage, price: 99.99 }).success).toBe(true);
  });

  // description
  it('rejects empty description', () => {
    const result = packageSchema.safeParse({ ...validPackage, description: '' });
    expect(result.success).toBe(false);
  });

  // image
  it('rejects empty image', () => {
    const result = packageSchema.safeParse({ ...validPackage, image: '' });
    expect(result.success).toBe(false);
  });

  // minTravelers / maxTravelers
  it('rejects minTravelers = 0', () => {
    const result = packageSchema.safeParse({ ...validPackage, minTravelers: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Minimum travelers must be at least 1');
    }
  });

  it('rejects maxTravelers = 0', () => {
    const result = packageSchema.safeParse({ ...validPackage, maxTravelers: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Maximum travelers must be at least 1');
    }
  });

  // difficulty
  it('rejects invalid difficulty value', () => {
    const result = packageSchema.safeParse({ ...validPackage, difficulty: 'EXTREME' });
    expect(result.success).toBe(false);
  });

  it('accepts all valid difficulty values', () => {
    for (const level of ['EASY', 'MODERATE', 'CHALLENGING'] as const) {
      expect(packageSchema.safeParse({ ...validPackage, difficulty: level }).success).toBe(true);
    }
  });

  // itinerary
  it('rejects itinerary with fewer than 3 days', () => {
    const result = packageSchema.safeParse({
      ...validPackage,
      itinerary: [validItineraryDay, { day: 2, title: 'Day 2', description: 'Activity' }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('At least 3 itinerary days');
    }
  });

  it('accepts itinerary with exactly 3 days', () => {
    expect(packageSchema.safeParse(validPackage).success).toBe(true);
  });

  it('accepts itinerary with more than 3 days', () => {
    const extended = [
      ...validPackage.itinerary,
      { day: 4, title: 'Day 4', description: 'Additional activity' },
    ];
    expect(packageSchema.safeParse({ ...validPackage, itinerary: extended }).success).toBe(true);
  });
});

// ─── Constants ────────────────────────────────────────────────────────────────

describe('PACKAGE_CATEGORIES', () => {
  it('contains expected safari categories', () => {
    expect(PACKAGE_CATEGORIES).toContain('Gorilla Trekking');
    expect(PACKAGE_CATEGORIES).toContain('Wildlife Safari');
    expect(PACKAGE_CATEGORIES).toContain('Cultural Tours');
  });

  it('is a non-empty array', () => {
    expect(PACKAGE_CATEGORIES.length).toBeGreaterThan(0);
  });
});

describe('DIFFICULTY_LEVELS', () => {
  it('contains EASY, MODERATE, and CHALLENGING', () => {
    const values = DIFFICULTY_LEVELS.map((d) => d.value);
    expect(values).toContain('EASY');
    expect(values).toContain('MODERATE');
    expect(values).toContain('CHALLENGING');
  });

  it('each level has a value, label, and description', () => {
    for (const level of DIFFICULTY_LEVELS) {
      expect(level.value).toBeTruthy();
      expect(level.label).toBeTruthy();
      expect(level.description).toBeTruthy();
    }
  });
});
