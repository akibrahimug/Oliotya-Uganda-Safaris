import { PrismaClient } from '../prisma/app/generated/prisma-client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding meta settings...');

  try {
    // Upsert meta settings
    await prisma.siteSettings.upsert({
      where: { key: 'meta' },
      update: {
        value: {
          title: "Oliotya Uganda Safaris - Discover Uganda",
          description: "Experience the Pearl of Africa with Oliotya Uganda Safaris. Explore Uganda's wildlife, mountains, and natural wonders with expert-guided tours.",
          keywords: "Uganda safaris, Uganda tours, wildlife safaris, gorilla trekking, Uganda travel, African safari, Pearl of Africa, Uganda adventure, Oliotya Uganda Safaris",
          ogImage: "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/fox_logo.webp",
          ogType: "website",
          twitterCard: "summary_large_image",
          favicon: "/fox_logo.webp"
        },
        category: 'meta',
      },
      create: {
        key: 'meta',
        value: {
          title: "Oliotya Uganda Safaris - Discover Uganda",
          description: "Experience the Pearl of Africa with Oliotya Uganda Safaris. Explore Uganda's wildlife, mountains, and natural wonders with expert-guided tours.",
          keywords: "Uganda safaris, Uganda tours, wildlife safaris, gorilla trekking, Uganda travel, African safari, Pearl of Africa, Uganda adventure, Oliotya Uganda Safaris",
          ogImage: "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/fox_logo.webp",
          ogType: "website",
          twitterCard: "summary_large_image",
          favicon: "/fox_logo.webp"
        },
        category: 'meta',
      },
    });

    console.log('✅ Meta settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding meta settings:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
