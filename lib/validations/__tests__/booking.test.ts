import { bookingFormSchema } from '../booking';

describe('bookingFormSchema', () => {
  const validBookingData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1-555-555-5555',
    country: 'United States',
    bookingType: 'DESTINATION' as const,
    destinationId: 1,
    numberOfTravelers: 2,
    travelDateFrom: '2025-12-01',
    travelDateTo: '2025-12-10',
  };

  describe('firstName validation', () => {
    it('should accept valid first name', () => {
      const result = bookingFormSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('should reject first name shorter than 2 characters', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        firstName: 'J',
      });
      expect(result.success).toBe(false);
    });

    it('should reject first name with numbers', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        firstName: 'John123',
      });
      expect(result.success).toBe(false);
    });

    it('should accept names with hyphens and apostrophes', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        firstName: "Mary-Jane",
      });
      expect(result.success).toBe(true);
    });

    it('should trim whitespace', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        firstName: '  John  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('John');
      }
    });
  });

  describe('lastName validation', () => {
    it('should accept valid last name', () => {
      const result = bookingFormSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('should reject last name shorter than 2 characters', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        lastName: 'D',
      });
      expect(result.success).toBe(false);
    });

    it('should reject last name with special characters', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        lastName: 'Doe@123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('email validation', () => {
    it('should accept valid email', () => {
      const result = bookingFormSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });

    it('should convert email to lowercase', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        email: 'JOHN@EXAMPLE.COM',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
      }
    });
  });

  describe('phone validation', () => {
    it('should accept valid phone with dashes', () => {
      const result = bookingFormSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('should accept phone with parentheses', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        phone: '(555) 555-5555',
      });
      expect(result.success).toBe(true);
    });

    it('should accept phone with plus sign', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        phone: '+1 555 555 5555',
      });
      expect(result.success).toBe(true);
    });

    it('should reject phone with letters', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        phone: '555-CALL-NOW',
      });
      expect(result.success).toBe(false);
    });

    it('should reject phone shorter than 10 characters', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        phone: '555-5555',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('destinationId validation', () => {
    it('should accept positive integer', () => {
      const result = bookingFormSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('should reject zero', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        destinationId: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative numbers', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        destinationId: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject decimal numbers', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        destinationId: 1.5,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('numberOfTravelers validation', () => {
    it('should accept valid number of travelers', () => {
      const result = bookingFormSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('should reject zero travelers', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        numberOfTravelers: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject more than 50 travelers', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        numberOfTravelers: 51,
      });
      expect(result.success).toBe(false);
    });

    it('should accept 1 traveler', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        numberOfTravelers: 1,
      });
      expect(result.success).toBe(true);
    });

    it('should accept 50 travelers', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        numberOfTravelers: 50,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('date validation', () => {
    it('should accept valid future dates', () => {
      const result = bookingFormSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('should reject past travel from date', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        travelDateFrom: '2020-01-01',
        travelDateTo: '2020-01-10',
      });
      expect(result.success).toBe(false);
    });

    it('should reject when to date is before from date', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        travelDateFrom: '2025-12-10',
        travelDateTo: '2025-12-01',
      });
      expect(result.success).toBe(false);
    });

    it('should reject when from and to dates are the same', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        travelDateFrom: '2025-12-01',
        travelDateTo: '2025-12-01',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('honeypot field', () => {
    it('should accept empty website field', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        website: '',
      });
      expect(result.success).toBe(true);
    });

    it('should accept undefined website field', () => {
      const result = bookingFormSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('should accept filled website field (honeypot)', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        website: 'http://spam.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('complete validation scenarios', () => {
    it('should accept minimal valid booking', () => {
      const result = bookingFormSchema.safeParse({
        firstName: 'Jo',
        lastName: 'Do',
        email: 'jo@example.com',
        phone: '1234567890',
        country: 'USA',
        bookingType: 'DESTINATION',
        destinationId: 1,
        numberOfTravelers: 1,
        travelDateFrom: '2025-12-01',
        travelDateTo: '2025-12-02',
      });
      expect(result.success).toBe(true);
    });

    it('should accept maximum travelers', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        numberOfTravelers: 50,
      });
      expect(result.success).toBe(true);
    });

    it('should handle complex names', () => {
      const result = bookingFormSchema.safeParse({
        ...validBookingData,
        firstName: "Jean-Pierre",
        lastName: "O'Connor-Smith",
      });
      expect(result.success).toBe(true);
    });
  });
});
