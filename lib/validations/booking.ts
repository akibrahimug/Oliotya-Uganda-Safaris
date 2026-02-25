import { z } from 'zod';

// Base fields shared between client and server schemas
const bookingBaseFields = {
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

  country: z.string()
    .min(2, 'Country is required')
    .max(100, 'Country name too long')
    .trim(),

  numberOfTravelers: z.number()
    .int('Number of travelers must be a whole number')
    .min(1, 'At least 1 traveler required')
    .max(50, 'Too many travelers'),

  specialRequests: z.string()
    .max(2000, 'Special requests too long')
    .trim()
    .optional(),

  travelDateFrom: z.string()
    .min(1, 'Travel start date is required'),

  travelDateTo: z.string()
    .min(1, 'Travel end date is required'),

  website: z.string().optional(),
};

// Client-side schema for the booking form (user-editable fields only)
export const bookingClientSchema = z.object(bookingBaseFields)
  .refine((data) => {
    if (!data.travelDateFrom) return true;
    const [year, month, day] = data.travelDateFrom.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  }, {
    message: 'Travel start date cannot be in the past',
    path: ['travelDateFrom'],
  })
  .refine((data) => {
    if (!data.travelDateFrom || !data.travelDateTo) return true;
    const from = new Date(data.travelDateFrom);
    const to = new Date(data.travelDateTo);
    return to > from;
  }, {
    message: 'End date must be after start date',
    path: ['travelDateTo'],
  })
  .refine((data) => {
    if (!data.travelDateFrom || !data.travelDateTo) return true;
    const from = new Date(data.travelDateFrom);
    const to = new Date(data.travelDateTo);
    const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 365;
  }, {
    message: 'Trip duration cannot exceed 1 year',
    path: ['travelDateTo'],
  });

export type BookingClientData = z.infer<typeof bookingClientSchema>;

// Full server-side schema (includes bookingType, packageId, destinationId, payment)
export const bookingFormSchema = z.object({
  ...bookingBaseFields,

  bookingType: z.enum(['PACKAGE', 'DESTINATION']),

  packageId: z.number()
    .int('Invalid package')
    .positive('Invalid package')
    .optional(),

  destinationId: z.number()
    .int('Invalid destination')
    .positive('Invalid destination')
    .optional(),

  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
}).refine((data) => {
  if (data.bookingType === 'PACKAGE' && !data.packageId) {
    return false;
  }
  if (data.bookingType === 'DESTINATION' && !data.destinationId) {
    return false;
  }
  return true;
}, {
  message: 'Package or destination must be selected based on booking type',
  path: ['packageId'],
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
