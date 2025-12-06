import { PrismaClient } from '../prisma/app/generated/prisma-client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding booking confirmation CMS...');

  // 1. Create Hero Section
  const hero = await prisma.bookingConfirmationHero.upsert({
    where: { id: 'default-hero' },
    update: {},
    create: {
      id: 'default-hero',
      badge: 'Booking Confirmed',
      title: 'Your Safari Adventure Awaits!',
      description: 'Thank you for choosing Oliotya Safaris. Your booking request has been successfully received, and we\'re excited to help you create unforgettable memories!',
      importantNotice: 'Your reservation will be confirmed once we receive and verify your payment. Please complete the payment to secure your booking at the current price.',
      paymentDeadline: '48 hours from booking',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });
  console.log('✅ Hero section created');

  // 2. Create Steps
  const steps = [
    {
      stepNumber: 1,
      title: 'Check Your Email',
      description: 'We\'ve sent a confirmation email with detailed payment instructions to your email address.',
      icon: 'Mail',
      extraInfo: 'Check your spam/junk folder if you don\'t see it in your inbox within 5 minutes.',
      displayOrder: 1,
    },
    {
      stepNumber: 2,
      title: 'Make Payment',
      description: 'Complete the bank transfer using the details provided in your email.',
      icon: 'CreditCard',
      extraInfo: 'Payment must be completed within 48 hours to guarantee availability.',
      displayOrder: 2,
    },
    {
      stepNumber: 3,
      title: 'Send Payment Confirmation',
      description: 'After making the transfer, send us the payment reference number via email or WhatsApp.',
      icon: 'MessageCircle',
      extraInfo: null,
      displayOrder: 3,
    },
    {
      stepNumber: 4,
      title: 'Booking Confirmed',
      description: 'Once we verify your payment (usually within 2-4 hours), you\'ll receive your final booking confirmation, detailed safari itinerary, packing list, and guide contact details.',
      icon: 'CheckCircle2',
      extraInfo: null,
      displayOrder: 4,
    },
  ];

  for (const step of steps) {
    await prisma.bookingConfirmationStep.upsert({
      where: { id: `step-${step.stepNumber}` },
      update: step,
      create: {
        id: `step-${step.stepNumber}`,
        ...step,
      },
    });
  }
  console.log('✅ Steps created');

  // 3. Create Contact Section
  const contact = await prisma.bookingConfirmationContact.upsert({
    where: { id: 'default-contact' },
    update: {},
    create: {
      id: 'default-contact',
      sectionTitle: 'Need Assistance?',
      description: 'Our team is here to help with any questions about your booking',
      email: 'info@foxadventures.com',
      phone: '+256 123 456 789',
      whatsapp: '+256 123 456 789',
      responseTime: 'Within 2-4 hours',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });
  console.log('✅ Contact section created');

  // 4. Create Security Points
  const securityPoints = [
    {
      title: 'Your Booking is Secure',
      points: [
        'Licensed and registered with Uganda Tourism Board',
        'Full refund if cancelled 30+ days before departure',
        '24/7 support during your safari adventure',
        'All personal information securely encrypted',
      ],
      displayOrder: 1,
    },
  ];

  for (const point of securityPoints) {
    await prisma.bookingConfirmationSecurity.upsert({
      where: { id: 'security-1' },
      update: point,
      create: {
        id: 'security-1',
        ...point,
      },
    });
  }
  console.log('✅ Security points created');

  console.log('✅ Booking confirmation CMS seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding booking confirmation CMS:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
