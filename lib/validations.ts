import { z } from "zod";

// Custom Package Builder Validation
export const customPackageSchema = z.object({
  name: z.string().min(1, "Package name is required").max(100, "Package name too long"),
  destinations: z
    .array(
      z.object({
        id: z.number().positive(),
        name: z.string(),
        category: z.string(),
        image: z.string().url("Invalid image URL"),
        days: z.number().min(1, "Must be at least 1 day").max(30, "Maximum 30 days per destination"),
      })
    )
    .min(1, "Select at least one destination")
    .max(10, "Maximum 10 destinations allowed"),
  numberOfPeople: z
    .number()
    .min(1, "At least 1 person required")
    .max(100, "Maximum 100 people allowed"),
  travelDate: z.string().optional(),
  budget: z
    .number()
    .min(0, "Budget cannot be negative")
    .max(1000000, "Budget too high")
    .optional()
    .nullable(),
  specialRequests: z.string().max(1000, "Special requests too long").optional(),
});

export type CustomPackageFormData = z.infer<typeof customPackageSchema>;

// Package Bundle Validation
export const packageBundleSchema = z.object({
  name: z.string().min(1, "Bundle name is required").max(100, "Bundle name too long").optional(),
  packages: z
    .array(
      z.object({
        packageId: z.number().positive(),
        notes: z.string().max(500, "Notes too long").optional(),
      })
    )
    .min(1, "Select at least one package")
    .max(5, "Maximum 5 packages in a bundle"),
  numberOfPeople: z
    .number()
    .min(1, "At least 1 person required")
    .max(100, "Maximum 100 people allowed"),
  travelDate: z.string().optional(),
  specialRequests: z.string().max(1000, "Special requests too long").optional(),
});

export type PackageBundleFormData = z.infer<typeof packageBundleSchema>;

// Client-side schema for bundle form fields (packages array managed as separate state)
export const bundleClientSchema = z.object({
  name: z.string().max(100, "Bundle name too long").optional(),
  numberOfPeople: z.number().int().min(1, "At least 1 person required").max(100, "Maximum 100 people allowed"),
  travelDate: z.string().optional(),
  specialRequests: z.string().max(1000, "Special requests too long").optional(),
});

export type BundleClientData = z.infer<typeof bundleClientSchema>;

// Quote Request Validation
export const quoteRequestSchema = z.object({
  packageName: z.string().min(1, "Package name is required"),
  packageSlug: z.string().min(1, "Package slug is required"),
  numberOfPeople: z
    .number()
    .min(1, "At least 1 person required")
    .max(1000, "Maximum 1000 people allowed"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  message: z.string().max(2000, "Message too long").optional(),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;

// Contact Form Validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Booking Form Validation
export const bookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number"),
  destinationId: z.number().positive("Please select a destination"),
  numberOfTravelers: z
    .number()
    .min(1, "At least 1 traveler required")
    .max(100, "Maximum 100 travelers allowed"),
  travelDateFrom: z.string().min(1, "Start date is required"),
  travelDateTo: z.string().min(1, "End date is required"),
  specialRequests: z.string().max(1000, "Special requests too long").optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Server-side validation helper
export function validateFormData<T>(schema: z.Schema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ["Validation failed"] };
  }
}

// Sanitize user input (prevent XSS)
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Sanitize all fields in an object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}

// Email validation helper
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Phone validation helper
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

// Date validation helpers
export function isValidFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export function isDateRangeValid(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
}
