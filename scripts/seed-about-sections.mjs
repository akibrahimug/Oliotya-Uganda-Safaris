import { PrismaClient } from '../prisma/app/generated/prisma-client/index.js';

const prisma = new PrismaClient();

const R2_BASE = "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "oliotya-safaris-safaris/images";

async function main() {
  console.log('Seeding about page sections...');

  // Seed About Story Section
  const storySection = await prisma.aboutStorySection.upsert({
    where: { id: 'about-story-1' },
    update: {},
    create: {
      id: 'about-story-1',
      heading: 'OUR STORY',
      title: 'Crafting Unforgettable',
      titleHighlight: 'African Adventures',
      paragraph1: 'We are Oliotya Safaris, a safari company founded out of a passion for the people, extraordinary landscape, and wildlife of Uganda. Our company arranges a variety of tours and we can, of course, customize the experience to fit the customers\' interests.',
      paragraph2: 'This means a combination of cultural experiences together with wildlife tours, hiking tours, and of course special location tours like an escape to celebrate your honeymoon, Volunteering trips, tourism internships, and social work internships. We take care of everything from the pickup and drop off at the airport to the booking of the customers\' hotels.',
      buttonText: 'Explore Our Tours',
      buttonLink: '/destinations',
      image: `${R2_BASE}/${IMAGE_PATH}/uganda-gorilla-trekking-adventure.webp`,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Story section seeded');

  // Seed About Community Section
  const communitySection = await prisma.aboutCommunitySection.upsert({
    where: { id: 'about-community-1' },
    update: {},
    create: {
      id: 'about-community-1',
      heading: 'COMMUNITY IMPACT',
      title: 'Giving Back Through',
      titleHighlight: 'Akaana Foundation',
      paragraph1: 'At Oliotya Safaris, we believe in making a positive impact beyond tourism. We\'re proud partners of Akaana Foundation Africa, a nonprofit organization dedicated to supporting street children in Kampala.',
      paragraph2: 'Through this partnership, a portion of every tour helps fund education, shelter, and rehabilitation programs for vulnerable children, creating lasting change in our community.',
      buttonText: 'Learn More About Akaana',
      buttonLink: 'https://www.akaanafoundation.nl',
      feature1Title: 'Supporting Children',
      feature1Description: 'Providing education and safe environments for street children in Kampala',
      feature2Title: 'Community Development',
      feature2Description: 'Empowering local communities through sustainable tourism initiatives',
      feature3Title: 'Long-term Impact',
      feature3Description: 'Creating lasting change through education, rehabilitation, and support programs',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Community section seeded');

  // Seed About Stats
  const stats = await prisma.aboutStats.upsert({
    where: { id: 'about-stats-1' },
    update: {},
    create: {
      id: 'about-stats-1',
      stat1Number: '8+',
      stat1Label: 'Years Experience',
      stat2Number: '10+',
      stat2Label: 'Destinations',
      stat3Number: '1200+',
      stat3Label: 'Happy Travelers',
      stat4Number: '98%',
      stat4Label: 'Satisfaction Rate',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Stats seeded');

  // Seed About Values
  const values = [
    {
      id: 'value-1',
      title: 'Passion for Uganda',
      description: 'We\'re deeply passionate about showcasing Uganda\'s natural beauty, wildlife, and rich cultural heritage to the world. Every tour is crafted with love for our country.',
      icon: 'Heart',
      displayOrder: 1,
      active: true,
    },
    {
      id: 'value-2',
      title: 'Safety & Security',
      description: 'Your safety is our top priority. We maintain the highest safety standards, use well-maintained vehicles, and employ experienced guides trained in emergency response.',
      icon: 'Shield',
      displayOrder: 2,
      active: true,
    },
    {
      id: 'value-3',
      title: 'Local Expertise',
      description: 'Our experienced, knowledgeable guides are locals who bring destinations to life with authentic stories, deep cultural insights, and genuine connections.',
      icon: 'Users',
      displayOrder: 3,
      active: true,
    },
    {
      id: 'value-4',
      title: 'Sustainable Tourism',
      description: 'We\'re committed to responsible tourism that benefits local communities, protects wildlife, and preserves Uganda\'s pristine environment for future generations.',
      icon: 'Globe',
      displayOrder: 4,
      active: true,
    },
  ];

  for (const value of values) {
    await prisma.aboutValue.upsert({
      where: { id: value.id },
      update: {},
      create: value,
    });
  }

  console.log('✅ Values seeded');

  console.log('🎉 About page seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
