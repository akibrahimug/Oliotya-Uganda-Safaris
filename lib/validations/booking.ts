import { z } from 'zod';

export const bookingFormSchema = z.object({
  // Personal Information
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters in first name')
    .trim(),

  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters in last name')
    .trim(),

  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),

  phone: z.string()
    .min(10, 'Phone number too short')
    .max(20, 'Phone number too long')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone format')
    .trim(),

  // Trip Details
  destinationId: z.number()
    .int('Invalid destination')
    .positive('Invalid destination'),

  numberOfTravelers: z.number()
    .int('Number of travelers must be a whole number')
    .min(1, 'At least 1 traveler required')
    .max(50, 'Too many travelers'),

  specialRequests: z.string()
    .max(2000, 'Special requests too long')
    .trim()
    .optional(),

  // Travel Dates
  travelDateFrom: z.string()
    .refine((date) => {
      const d = new Date(date);
      return d > new Date();
    }, 'Travel date must be in the future'),

  travelDateTo: z.string(),

  // Honeypot field
  website: z.string().optional(),
}).refine((data) => {
  const from = new Date(data.travelDateFrom);
  const to = new Date(data.travelDateTo);
  return to > from;
}, {
  message: 'End date must be after start date',
  path: ['travelDateTo'],
}).refine((data) => {
  const from = new Date(data.travelDateFrom);
  const to = new Date(data.travelDateTo);
  const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 365;
}, {
  message: 'Trip duration cannot exceed 1 year',
  path: ['travelDateTo'],
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
