/**
 * Unit tests for lib/validations/custom-package.ts
 */

import {
  selectedDestinationSchema,
  customPackageSchema,
  customPackageClientSchema,
} from '../custom-package';

// ─── Helpers ────────────────────────────────────────────────────────────────

const validDestination = {
  id: 1,
  name: 'Bwindi Impenetrable Forest',
  category: 'Gorilla Trekking',
  image: 'https://example.com/bwindi.webp',
  days: 3,
};

const futureDate = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
})();

const validPackage = {
  name: "My Safari Trip",
  contactName: "John Doe",
  email: "john@example.com",
  phone: "+1 234 567 8901",
  destinations: [validDestination],
  numberOfPeople: 2,
};

// ─── selectedDestinationSchema ───────────────────────────────────────────────

describe('selectedDestinationSchema', () => {
  it('accepts valid destination', () => {
    expect(selectedDestinationSchema.safeParse(validDestination).success).toBe(true);
  });

  it('rejects non-integer id', () => {
    const result = selectedDestinationSchema.safeParse({ ...validDestination, id: 1.5 });
    expect(result.success).toBe(false);
  });

  it('rejects negative id', () => {
    const result = selectedDestinationSchema.safeParse({ ...validDestination, id: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = selectedDestinationSchema.safeParse({ ...validDestination, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 200 characters', () => {
    const result = selectedDestinationSchema.safeParse({ ...validDestination, name: 'A'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects empty category', () => {
    const result = selectedDestinationSchema.safeParse({ ...validDestination, category: '' });
    expect(result.success).toBe(false);
  });

  it('rejects non-URL image', () => {
    const result = selectedDestinationSchema.safeParse({ ...validDestination, image: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('rejects days = 0', () => {
    const result = selectedDestinationSchema.safeParse({ ...validDestination, days: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects days > 30', () => {
    const result = selectedDestinationSchema.safeParse({ ...validDestination, days: 31 });
    expect(result.success).toBe(false);
  });

  it('accepts days = 1 (minimum)', () => {
    expect(selectedDestinationSchema.safeParse({ ...validDestination, days: 1 }).success).toBe(true);
  });

  it('accepts days = 30 (maximum)', () => {
    expect(selectedDestinationSchema.safeParse({ ...validDestination, days: 30 }).success).toBe(true);
  });
});

// ─── customPackageSchema ─────────────────────────────────────────────────────

describe('customPackageSchema', () => {
  it('accepts a valid package', () => {
    expect(customPackageSchema.safeParse(validPackage).success).toBe(true);
  });

  it('accepts package with all optional fields', () => {
    const full = {
      ...validPackage,
      travelDate: futureDate,
      budget: 2000,
      specialRequests: 'Vegetarian meals please',
      duration: '7 days',
    };
    expect(customPackageSchema.safeParse(full).success).toBe(true);
  });

  // name
  it('rejects name shorter than 3 characters', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, name: 'AB' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      expect(messages).toContain('Package name must be at least 3 characters');
    }
  });

  it('rejects name with invalid characters', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, name: 'Safari<script>' });
    expect(result.success).toBe(false);
  });

  it('accepts name with hyphens and apostrophes', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, name: "John's Safari-Trip" }).success).toBe(true);
  });

  // contactName
  it('rejects contactName shorter than 2 characters', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, contactName: 'J' });
    expect(result.success).toBe(false);
  });

  it('rejects contactName with numbers', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, contactName: 'John123' });
    expect(result.success).toBe(false);
  });

  it('accepts contactName with hyphens and apostrophes', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, contactName: "O'Brien-Smith" }).success).toBe(true);
  });

  // email
  it('rejects invalid email', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('accepts valid email', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, email: 'user@domain.com' }).success).toBe(true);
  });

  // phone
  it('rejects phone shorter than 10 digits', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, phone: '123' });
    expect(result.success).toBe(false);
  });

  it('accepts phone with country code and spaces', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, phone: '+44 20 7946 0958' }).success).toBe(true);
  });

  // destinations
  it('rejects empty destinations array', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, destinations: [] });
    expect(result.success).toBe(false);
  });

  it('rejects more than 10 destinations', () => {
    const result = customPackageSchema.safeParse({
      ...validPackage,
      destinations: Array(11).fill(validDestination),
    });
    expect(result.success).toBe(false);
  });

  // numberOfPeople
  it('rejects numberOfPeople = 0', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, numberOfPeople: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects numberOfPeople > 50', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, numberOfPeople: 51 });
    expect(result.success).toBe(false);
  });

  it('accepts numberOfPeople = 50 (maximum)', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, numberOfPeople: 50 }).success).toBe(true);
  });

  // travelDate
  it('accepts null travelDate', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, travelDate: null }).success).toBe(true);
  });

  it('accepts undefined travelDate', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, travelDate: undefined }).success).toBe(true);
  });

  it('accepts empty string travelDate', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, travelDate: '' }).success).toBe(true);
  });

  it('accepts future date for travelDate', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, travelDate: futureDate }).success).toBe(true);
  });

  it('rejects past travelDate', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, travelDate: '2020-01-01' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      expect(messages).toContain('Travel date cannot be in the past');
    }
  });

  // budget
  it('accepts null budget', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, budget: null }).success).toBe(true);
  });

  it('rejects budget of 0', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, budget: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects budget over 1,000,000', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, budget: 1000001 });
    expect(result.success).toBe(false);
  });

  // specialRequests
  it('rejects specialRequests longer than 2000 characters', () => {
    const result = customPackageSchema.safeParse({ ...validPackage, specialRequests: 'A'.repeat(2001) });
    expect(result.success).toBe(false);
  });

  it('accepts null specialRequests', () => {
    expect(customPackageSchema.safeParse({ ...validPackage, specialRequests: null }).success).toBe(true);
  });

  // Cross-field: total days > 60
  it('rejects when total destination days exceed 60', () => {
    const tooLongDests = [
      { ...validDestination, days: 30 },
      { ...validDestination, id: 2, name: 'Queen Elizabeth NP', days: 31 },
    ];
    const result = customPackageSchema.safeParse({ ...validPackage, destinations: tooLongDests });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      expect(messages).toContain('Total trip duration cannot exceed 60 days');
    }
  });

  it('accepts exactly 60 total days across destinations', () => {
    const dests = [
      { ...validDestination, days: 30 },
      { ...validDestination, id: 2, name: 'Queen Elizabeth NP', days: 30 },
    ];
    expect(customPackageSchema.safeParse({ ...validPackage, destinations: dests }).success).toBe(true);
  });
});

// ─── customPackageClientSchema ───────────────────────────────────────────────

describe('customPackageClientSchema', () => {
  const validClient = {
    contactName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+256 700 123 456',
    numberOfPeople: 4,
  };

  it('accepts valid client data', () => {
    expect(customPackageClientSchema.safeParse(validClient).success).toBe(true);
  });

  it('accepts client data with optional name as empty string', () => {
    expect(customPackageClientSchema.safeParse({ ...validClient, name: '' }).success).toBe(true);
  });

  it('accepts client data with optional name present', () => {
    expect(customPackageClientSchema.safeParse({ ...validClient, name: 'Gorilla Trek 2025' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = customPackageClientSchema.safeParse({ ...validClient, email: 'bad' });
    expect(result.success).toBe(false);
  });

  it('accepts honeypot website field (for bot detection)', () => {
    // The website field exists as an optional field for bot detection
    expect(customPackageClientSchema.safeParse({ ...validClient, website: '' }).success).toBe(true);
  });

  it('rejects past travelDate', () => {
    const result = customPackageClientSchema.safeParse({ ...validClient, travelDate: '2020-06-01' });
    expect(result.success).toBe(false);
  });

  it('accepts future travelDate', () => {
    expect(customPackageClientSchema.safeParse({ ...validClient, travelDate: futureDate }).success).toBe(true);
  });
});
