import {
  customPackageSchema,
  packageBundleSchema,
  quoteRequestSchema,
  contactFormSchema,
  bookingFormSchema,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  isValidFutureDate,
  isDateRangeValid,
} from "@/lib/validations";

describe("Validation Schemas", () => {
  describe("customPackageSchema", () => {
    it("should validate a valid custom package", () => {
      const validData = {
        name: "My Safari",
        destinations: [
          {
            id: 1,
            name: "Bwindi",
            category: "Wildlife",
            image: "https://example.com/image.jpg",
            days: 3,
          },
        ],
        numberOfPeople: 4,
        travelDate: "2025-12-01",
        budget: 5000,
        specialRequests: "Vegetarian meals",
      };

      const result = customPackageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail when package name is empty", () => {
      const invalidData = {
        name: "",
        destinations: [
          {
            id: 1,
            name: "Bwindi",
            category: "Wildlife",
            image: "https://example.com/image.jpg",
            days: 3,
          },
        ],
        numberOfPeople: 4,
      };

      const result = customPackageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("required");
      }
    });

    it("should fail when no destinations are selected", () => {
      const invalidData = {
        name: "My Safari",
        destinations: [],
        numberOfPeople: 4,
      };

      const result = customPackageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("at least one destination");
      }
    });

    it("should fail when too many destinations", () => {
      const invalidData = {
        name: "My Safari",
        destinations: Array(11).fill({
          id: 1,
          name: "Bwindi",
          category: "Wildlife",
          image: "https://example.com/image.jpg",
          days: 3,
        }),
        numberOfPeople: 4,
      };

      const result = customPackageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Maximum 10 destinations");
      }
    });

    it("should fail when days per destination is too high", () => {
      const invalidData = {
        name: "My Safari",
        destinations: [
          {
            id: 1,
            name: "Bwindi",
            category: "Wildlife",
            image: "https://example.com/image.jpg",
            days: 31,
          },
        ],
        numberOfPeople: 4,
      };

      const result = customPackageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Maximum 30 days");
      }
    });

    it("should fail when numberOfPeople is 0", () => {
      const invalidData = {
        name: "My Safari",
        destinations: [
          {
            id: 1,
            name: "Bwindi",
            category: "Wildlife",
            image: "https://example.com/image.jpg",
            days: 3,
          },
        ],
        numberOfPeople: 0,
      };

      const result = customPackageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("At least 1 person");
      }
    });

    it("should fail when numberOfPeople exceeds 100", () => {
      const invalidData = {
        name: "My Safari",
        destinations: [
          {
            id: 1,
            name: "Bwindi",
            category: "Wildlife",
            image: "https://example.com/image.jpg",
            days: 3,
          },
        ],
        numberOfPeople: 101,
      };

      const result = customPackageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Maximum 100 people");
      }
    });

    it("should allow optional fields to be omitted", () => {
      const validData = {
        name: "My Safari",
        destinations: [
          {
            id: 1,
            name: "Bwindi",
            category: "Wildlife",
            image: "https://example.com/image.jpg",
            days: 3,
          },
        ],
        numberOfPeople: 4,
      };

      const result = customPackageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("packageBundleSchema", () => {
    it("should validate a valid package bundle", () => {
      const validData = {
        name: "My Bundle",
        packages: [
          { packageId: 1, notes: "First package" },
          { packageId: 2, notes: "Second package" },
        ],
        numberOfPeople: 4,
        travelDate: "2025-12-01",
        specialRequests: "Early morning pickup",
      };

      const result = packageBundleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail when no packages are selected", () => {
      const invalidData = {
        packages: [],
        numberOfPeople: 4,
      };

      const result = packageBundleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("at least one package");
      }
    });

    it("should fail when too many packages", () => {
      const invalidData = {
        packages: Array(6).fill({ packageId: 1 }),
        numberOfPeople: 4,
      };

      const result = packageBundleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Maximum 5 packages");
      }
    });

    it("should allow optional name field", () => {
      const validData = {
        packages: [{ packageId: 1 }],
        numberOfPeople: 4,
      };

      const result = packageBundleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("quoteRequestSchema", () => {
    it("should validate a valid quote request", () => {
      const validData = {
        packageName: "5-Days Safari",
        packageSlug: "5-days-safari",
        numberOfPeople: 4,
        name: "John Doe",
        email: "john@example.com",
        phone: "0700123456",
        message: "Looking forward to this trip",
      };

      const result = quoteRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with invalid email", () => {
      const invalidData = {
        packageName: "5-Days Safari",
        packageSlug: "5-days-safari",
        numberOfPeople: 4,
        name: "John Doe",
        email: "not-an-email",
      };

      const result = quoteRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Invalid email");
      }
    });

    it("should fail with short name", () => {
      const invalidData = {
        packageName: "5-Days Safari",
        packageSlug: "5-days-safari",
        numberOfPeople: 4,
        name: "J",
        email: "john@example.com",
      };

      const result = quoteRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("at least 2 characters");
      }
    });

    it("should fail with invalid phone number", () => {
      const invalidData = {
        packageName: "5-Days Safari",
        packageSlug: "5-days-safari",
        numberOfPeople: 4,
        name: "John Doe",
        email: "john@example.com",
        phone: "abc",
      };

      const result = quoteRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Invalid phone number");
      }
    });

    it("should allow phone to be empty string", () => {
      const validData = {
        packageName: "5-Days Safari",
        packageSlug: "5-days-safari",
        numberOfPeople: 4,
        name: "John Doe",
        email: "john@example.com",
        phone: "",
      };

      const result = quoteRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with too many people", () => {
      const invalidData = {
        packageName: "5-Days Safari",
        packageSlug: "5-days-safari",
        numberOfPeople: 1001,
        name: "John Doe",
        email: "john@example.com",
      };

      const result = quoteRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Maximum 1000 people");
      }
    });
  });

  describe("contactFormSchema", () => {
    it("should validate a valid contact form", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        subject: "Inquiry about tours",
        message: "I would like to know more about your safari packages.",
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail with short message", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        subject: "Inquiry",
        message: "Too short",
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("at least 10 characters");
      }
    });
  });

  describe("bookingFormSchema", () => {
    it("should validate a valid booking form", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "0700123456",
        destinationId: 1,
        numberOfTravelers: 4,
        travelDateFrom: "2025-12-01",
        travelDateTo: "2025-12-05",
        specialRequests: "Vegetarian meals",
      };

      const result = bookingFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail when dates are missing", () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+256-700-123-456",
        destinationId: 1,
        numberOfTravelers: 4,
        travelDateFrom: "",
        travelDateTo: "",
      };

      const result = bookingFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe("Helper Functions", () => {
  describe("sanitizeInput", () => {
    it("should sanitize HTML special characters", () => {
      const input = '<script>alert("XSS")</script>';
      const expected = "&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;";
      expect(sanitizeInput(input)).toBe(expected);
    });

    it("should handle single quotes", () => {
      const input = "It's a test";
      const expected = "It&#x27;s a test";
      expect(sanitizeInput(input)).toBe(expected);
    });

    it("should handle normal text without changes", () => {
      const input = "Normal text without special chars";
      expect(sanitizeInput(input)).toBe(input);
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name+tag@example.co.uk")).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(isValidEmail("notanemail")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });

    it("should reject emails longer than 254 chars", () => {
      const longEmail = "a".repeat(250) + "@example.com";
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("should validate correct phone numbers", () => {
      expect(isValidPhone("0700123456")).toBe(true);
      expect(isValidPhone("+256700123456")).toBe(true);
      expect(isValidPhone("(555)1234567")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(isValidPhone("abc")).toBe(false);
      expect(isValidPhone("12")).toBe(false); // too short
    });
  });

  describe("isValidFutureDate", () => {
    it("should accept future dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isValidFutureDate(futureDate.toISOString())).toBe(true);
    });

    it("should accept today's date", () => {
      const today = new Date();
      expect(isValidFutureDate(today.toISOString())).toBe(true);
    });

    it("should reject past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isValidFutureDate(pastDate.toISOString())).toBe(false);
    });
  });

  describe("isDateRangeValid", () => {
    it("should validate correct date ranges", () => {
      expect(isDateRangeValid("2025-12-01", "2025-12-05")).toBe(true);
    });

    it("should allow same start and end date", () => {
      expect(isDateRangeValid("2025-12-01", "2025-12-01")).toBe(true);
    });

    it("should reject invalid date ranges", () => {
      expect(isDateRangeValid("2025-12-05", "2025-12-01")).toBe(false);
    });
  });
});
