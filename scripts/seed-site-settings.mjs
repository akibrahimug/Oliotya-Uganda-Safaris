import { PrismaClient } from '../prisma/app/generated/prisma-client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding site settings...');

  // Brand settings
  await prisma.siteSettings.upsert({
    where: { key: 'brand' },
    update: {
      value: {
        siteName: 'Oliotya Uganda Safaris',
        logo: process.env.NEXT_PUBLIC_R2_PUBLIC_URL + '/oliotya-safaris-safaris/images/fox_logo.webp',
        tagline: 'Experience the Pearl of Africa',
      },
      category: 'brand',
    },
    create: {
      key: 'brand',
      value: {
        siteName: 'Oliotya Uganda Safaris',
        logo: process.env.NEXT_PUBLIC_R2_PUBLIC_URL + '/oliotya-safaris-safaris/images/fox_logo.webp',
        tagline: 'Experience the Pearl of Africa',
      },
      category: 'brand',
    },
  });

  // Contact settings
  await prisma.siteSettings.upsert({
    where: { key: 'contact' },
    update: {
      value: {
        phone: '+256 788048210',
        email: 'Info@oliotyaugandasafaris.com',
        address: 'Kampala, Uganda',
        whatsapp: '+256 788048210',
      },
      category: 'contact',
    },
    create: {
      key: 'contact',
      value: {
        phone: '+256 788048210',
        email: 'Info@oliotyaugandasafaris.com',
        address: 'Kampala, Uganda',
        whatsapp: '+256 788048210',
      },
      category: 'contact',
    },
  });

  // Social media settings
  await prisma.siteSettings.upsert({
    where: { key: 'social' },
    update: {
      value: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      },
      category: 'social',
    },
    create: {
      key: 'social',
      value: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      },
      category: 'social',
    },
  });

  // Newsletter settings
  await prisma.siteSettings.upsert({
    where: { key: 'newsletter' },
    update: {
      value: {
        title: 'Subscribe to Our Newsletter',
        description: 'Get exclusive travel tips, special offers, and updates on Uganda\'s best safari experiences',
      },
      category: 'newsletter',
    },
    create: {
      key: 'newsletter',
      value: {
        title: 'Subscribe to Our Newsletter',
        description: 'Get exclusive travel tips, special offers, and updates on Uganda\'s best safari experiences',
      },
      category: 'newsletter',
    },
  });

  // Footer settings
  await prisma.siteSettings.upsert({
    where: { key: 'footer' },
    update: {
      value: {
        description: 'Experience the Pearl of Africa with expert-guided safaris, cultural tours, and unforgettable adventures.',
        copyright: '© 2025 Oliotya Uganda Safaris. All rights reserved.',
      },
      category: 'footer',
    },
    create: {
      key: 'footer',
      value: {
        description: 'Experience the Pearl of Africa with expert-guided safaris, cultural tours, and unforgettable adventures.',
        copyright: '© 2025 Oliotya Uganda Safaris. All rights reserved.',
      },
      category: 'footer',
    },
  });

  console.log('✅ Site settings seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding site settings:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
