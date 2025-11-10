import { z } from 'zod';

// List of common disposable email domains to block
const disposableDomains = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwaway.email',
  'temp-mail.org',
  'mailinator.com',
];

export const newsletterSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim()
    .refine((email) => {
      const domain = email.split('@')[1];
      return !disposableDomains.includes(domain);
    }, 'Temporary email addresses are not allowed'),

  // Honeypot field
  website: z.string().optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
