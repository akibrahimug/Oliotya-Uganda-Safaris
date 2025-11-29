const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCMSContent() {
  console.log('🌱 Seeding basic CMS content...');

  try {
    // Seed Packages Hero (for both regular packages and custom packages)
    const packagesHero = await prisma.packagesHero.upsert({
      where: { id: 'default-packages-hero' },
      update: {},
      create: {
        id: 'default-packages-hero',
        title: 'Discover the Pearl of Africa',
        subtitle: 'Safari Packages',
        description: 'Explore curated safari experiences across Uganda\'s most breathtaking destinations and national parks.',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp',
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // Seed Custom Package Hero
    const customPackageHero = await prisma.customPackageHero.upsert({
      where: { id: 'default-custom-package-hero' },
      update: {},
      create: {
        id: 'default-custom-package-hero',
        title: 'Create Your Perfect Adventure',
        subtitle: 'Custom Safari Packages',
        description: 'Design your ideal safari experience with our expert team. Choose destinations, activities, and accommodations that match your preferences.',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp',
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // Seed Custom Package Content
    const customPackageContent = await prisma.customPackageContent.upsert({
      where: { id: 'default-custom-package-content' },
      update: {},
      create: {
        id: 'default-custom-package-content',
        title: 'Build Your Custom Safari Package',
        subtitle: '',
        description: 'Select the destinations you want to visit, customize the duration, choose your preferred accommodations, and let our expert team create your perfect safari experience.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    console.log('✅ Basic CMS content seeded successfully!');
    console.log('📝 You may need to recreate other content through the CMS admin panel.');

  } catch (error) {
    console.error('❌ Error seeding CMS content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCMSContent();
