import { PrismaClient } from '../prisma/app/generated/prisma-client/index.js';

const prisma = new PrismaClient();

const emailTemplates = [
  {
    type: 'booking_confirmation',
    subject: 'Booking Confirmed! - {confirmationNumber}',
    companyName: 'Nambi Uganda Safaris',
    heading: 'Booking Confirmed!',
    greeting: 'Dear {firstName},',
    introText: 'Thank you for booking with Nambi Uganda Safaris! Your safari adventure is confirmed.',
    nextStepsTitle: 'What Happens Next?',
    nextStepsText: `1. Our team will review your booking details
2. We'll send you a detailed itinerary within 48 hours
3. You'll receive payment instructions
4. We'll confirm final arrangements 2 weeks before departure`,
    signatureText: `We can't wait to welcome you on this incredible journey!

The Nambi Uganda Safaris Team`,
    footerText: 'Nambi Uganda Safaris - Unforgettable Safari Experiences',
    contactEmail: 'info@nambiugandasafaris.com',
    primaryColor: '#059669',
    accentColor: '#3b82f6',
    active: true,
  },
  {
    type: 'booking_notification',
    subject: 'New Booking Received - {confirmationNumber}',
    companyName: 'Nambi Uganda Safaris',
    heading: '🎉 New Booking Received!',
    greeting: '',
    introText: 'A new booking has been submitted through the website.',
    nextStepsTitle: null,
    nextStepsText: null,
    signatureText: 'Please respond to the customer promptly.',
    footerText: 'This notification was sent from Nambi Uganda Safaris booking system.',
    contactEmail: 'info@nambiugandasafaris.com',
    primaryColor: '#059669',
    accentColor: '#fbbf24',
    active: true,
  },
  {
    type: 'contact_confirmation',
    subject: 'We Received Your Message',
    companyName: 'Nambi Uganda Safaris',
    heading: 'Thank You for Contacting Nambi Uganda Safaris',
    greeting: 'Dear {name},',
    introText: `Thank you for reaching out to us regarding "{subject}". We've received your message and our team will get back to you within 24 hours.

At Nambi Uganda Safaris, we're passionate about creating unforgettable safari experiences. Whether you're dreaming of gorilla trekking in Bwindi, witnessing the Big Five, or exploring Uganda's pristine landscapes, we're here to make it happen.`,
    nextStepsTitle: 'What\'s Next?',
    nextStepsText: `• Our team will review your inquiry
• We'll respond with personalized recommendations
• You'll receive a detailed quote tailored to your needs`,
    signatureText: `Best regards,

The Nambi Uganda Safaris Team`,
    footerText: 'Nambi Uganda Safaris - Unforgettable Safari Experiences',
    contactEmail: 'info@nambiugandasafaris.com',
    primaryColor: '#059669',
    accentColor: '#86efac',
    active: true,
  },
  {
    type: 'contact_notification',
    subject: 'New Contact Form Submission - {subject}',
    companyName: 'Nambi Uganda Safaris',
    heading: '📧 New Contact Form Submission',
    greeting: '',
    introText: 'A new contact form has been submitted through the website.',
    nextStepsTitle: null,
    nextStepsText: null,
    signatureText: 'Please respond to this inquiry promptly.',
    footerText: 'This notification was sent from Nambi Uganda Safaris contact form.',
    contactEmail: 'info@nambiugandasafaris.com',
    primaryColor: '#059669',
    accentColor: '#f59e0b',
    active: true,
  },
  {
    type: 'custom_package_confirmation',
    subject: 'Custom Package Request Received',
    companyName: 'Nambi Uganda Safaris',
    heading: 'Custom Package Request Received!',
    greeting: 'Dear {contactName},',
    introText: 'Thank you for choosing Nambi Uganda Safaris to create your dream safari experience! We\'ve received your custom package request for "{name}".',
    nextStepsTitle: 'What Happens Next?',
    nextStepsText: `1. Our safari experts will review your custom itinerary
2. We'll create a personalized quote based on your preferences
3. You'll receive a detailed proposal within 24-48 hours
4. We'll work with you to perfect every detail of your adventure`,
    signatureText: `We're excited to start planning your adventure!

The Nambi Uganda Safaris Team`,
    footerText: 'Nambi Uganda Safaris - Unforgettable Safari Experiences',
    contactEmail: 'info@nambiugandasafaris.com',
    primaryColor: '#059669',
    accentColor: '#3b82f6',
    active: true,
  },
  {
    type: 'custom_package_notification',
    subject: 'New Custom Package Request - {name}',
    companyName: 'Nambi Uganda Safaris',
    heading: '🎯 New Custom Package Request!',
    greeting: '',
    introText: 'A new custom package request has been submitted through the package builder.',
    nextStepsTitle: null,
    nextStepsText: null,
    signatureText: 'Please respond to the customer with a personalized quote.',
    footerText: 'This notification was sent from Nambi Uganda Safaris custom package builder.',
    contactEmail: 'info@nambiugandasafaris.com',
    primaryColor: '#059669',
    accentColor: '#8b5cf6',
    active: true,
  },
];

async function main() {
  console.log('🌱 Seeding email templates...');

  for (const template of emailTemplates) {
    try {
      const existing = await prisma.emailTemplate.findUnique({
        where: { type: template.type },
      });

      if (existing) {
        console.log(`📧 Updating template: ${template.type}`);
        await prisma.emailTemplate.update({
          where: { type: template.type },
          data: template,
        });
      } else {
        console.log(`📧 Creating template: ${template.type}`);
        await prisma.emailTemplate.create({
          data: template,
        });
      }
    } catch (error) {
      console.error(`❌ Error seeding template ${template.type}:`, error);
    }
  }

  console.log('✅ Email templates seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding email templates:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
