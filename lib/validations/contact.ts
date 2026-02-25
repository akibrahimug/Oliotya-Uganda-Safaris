import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
    .trim(),

  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),

  phone: z.string().optional(),

  subject: z.string()
    .min(1, 'Please select a subject')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),

  // Honeypot field for bot detection
  website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
