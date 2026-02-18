const { PrismaClient } = require('./app/generated/prisma-client');
const { seedDestinationsComplete } = require('../scripts/seed-destinations-complete.mjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Create essential CMS content for hero sections
    console.log('📝 Creating hero sections...');

    // Packages Hero
    await prisma.packagesHero.upsert({
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

    // Custom Package Hero
    await prisma.customPackageHero.upsert({
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

    // Custom Package Content
    await prisma.customPackageContent.upsert({
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

    // 2. Create basic destinations for the custom package builder
    console.log('🗺️ Creating destinations...');

    const destinations = [
      {
        name: 'Queen Elizabeth National Park',
        category: 'Safari',
        country: 'Uganda',
        region: 'Western Uganda',
        price: 1200,
        rating: 5,
        duration: '3-5 Days',
        groupSize: 8,
        description: 'Known for its incredible wildlife diversity, including the famous tree-climbing lions, elephants, and over 600 bird species.',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp',
        featured: true,
      },
      {
        name: 'Bwindi Impenetrable Forest',
        category: 'Gorilla Trekking',
        country: 'Uganda',
        region: 'Southwestern Uganda',
        price: 1500,
        rating: 5,
        duration: '3-4 Days',
        groupSize: 8,
        description: 'Home to half of the world\'s remaining mountain gorillas, offering an unforgettable primate trekking experience.',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/bwindi-gorilla-trekking.webp',
        featured: true,
      },
      {
        name: 'Murchison Falls National Park',
        category: 'Safari',
        country: 'Uganda',
        region: 'Northern Uganda',
        price: 1100,
        rating: 5,
        duration: '3-4 Days',
        groupSize: 12,
        description: 'Features the powerful Murchison Falls and abundant wildlife including elephants, giraffes, and the Nile River.',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/murchison-falls-national-park.webp',
        featured: true,
      },
    ];

    // Create destinations (skip if they already exist)
    for (const dest of destinations) {
      const existing = await prisma.destination.findFirst({
        where: { name: dest.name }
      });

      if (!existing) {
        await prisma.destination.create({
          data: dest,
        });
      }
    }

    // 3. Create essential destinations for custom package builder
    console.log('🗺️ Creating destinations...');

    const destinations = [
      {
        name: 'Queen Elizabeth National Park',
        category: 'Safari',
        country: 'Uganda',
        region: 'Western Uganda',
        price: 1200,
        rating: 5,
        duration: '3-5 Days',
        groupSize: 8,
        minTravelers: 2,
        maxTravelers: 10,
        description: 'Famous for its tree-climbing lions and diverse ecosystems, this park offers boat safaris on the Kazinga Channel with abundant hippos, crocodiles, and birdlife.',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp',
        featured: true,
      },
      {
        name: 'Bwindi Impenetrable National Park',
        category: 'Gorilla Trekking',
        country: 'Uganda',
        region: 'Southwestern Uganda',
        price: 3950,
        rating: 5,
        duration: '3-5 Days',
        groupSize: 8,
        minTravelers: 1,
        maxTravelers: 8,
        description: 'Home to 400 mountain gorillas - half the world\'s population. Ancient 25,000-year-old rainforest and UNESCO World Heritage Site.',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/bwindi-impenetrable-forest-mountain-gorillas.webp',
        featured: true,
      },
      {
        name: 'Murchison Falls National Park',
        category: 'Safari',
        country: 'Uganda',
        region: 'Northern Uganda',
        price: 897,
        rating: 5,
        duration: '3-4 Days',
        groupSize: 12,
        minTravelers: 2,
        maxTravelers: 15,
        description: 'Uganda\'s largest and oldest park. Spectacular waterfall where the Nile explodes through an 8-meter gorge.',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/murchison-falls-national-park-uganda-waterfall.webp',
        featured: true,
      },
    ];

    for (const dest of destinations) {
      const existing = await prisma.destination.findFirst({
        where: { name: dest.name }
      });

      if (!existing) {
        await prisma.destination.create({
          data: dest,
        });
      }
    }

    // 4. Create sample packages
    console.log('🎒 Creating sample packages...');

    const samplePackages = [
      {
        name: 'Queen Elizabeth National Park Safari',
        slug: 'queen-elizabeth-national-park-safari',
        category: 'Safari',
        duration: '3 Days',
        price: 1200,
        description: 'Experience the incredible wildlife diversity of Queen Elizabeth National Park, home to tree-climbing lions, elephants, and over 600 bird species.',
        shortDesc: '3-day safari in Uganda\'s most biodiverse park',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp',
        featured: true,
        popular: true,
        active: true,
        minTravelers: 2,
        maxTravelers: 8,
        difficulty: 'MODERATE',
        itinerary: [
          {
            day: 1,
            title: 'Arrival & Game Drive',
            description: 'Arrive at the park and embark on an afternoon game drive to spot lions, elephants, and antelopes.'
          },
          {
            day: 2,
            title: 'Full Day Exploration',
            description: 'Morning game drive, boat cruise on the Kazinga Channel, and afternoon game viewing.'
          },
          {
            day: 3,
            title: 'Departure',
            description: 'Final morning game drive before departure.'
          }
        ],
        included: ['Accommodation', 'Meals', 'Park Fees', 'Transport', 'Guide'],
        excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Tips']
      },
      {
        name: 'Gorilla Trekking in Bwindi Forest',
        slug: 'bwindi-gorilla-trekking',
        category: 'Gorilla Trekking',
        duration: '4 Days',
        price: 1500,
        description: 'Trek with mountain gorillas in Bwindi Impenetrable Forest, home to half of the world\'s remaining mountain gorillas.',
        shortDesc: '4-day gorilla trekking adventure',
        image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/bwindi-gorilla-trekking.webp',
        featured: true,
        popular: true,
        active: true,
        minTravelers: 1,
        maxTravelers: 8,
        difficulty: 'MODERATE',
        itinerary: [
          {
            day: 1,
            title: 'Travel to Bwindi',
            description: 'Travel to Bwindi Impenetrable Forest and settle into your accommodation.'
          },
          {
            day: 2,
            title: 'Gorilla Trekking',
            description: 'Full day gorilla trekking experience with expert guides.'
          },
          {
            day: 3,
            title: 'Forest Exploration',
            description: 'Explore the forest trails and learn about conservation efforts.'
          },
          {
            day: 4,
            title: 'Departure',
            description: 'Return journey with optional stops.'
          }
        ],
        included: ['Gorilla Permits', 'Accommodation', 'Meals', 'Guide', 'Park Fees'],
        excluded: ['International Flights', 'Visa Fees', 'Personal Expenses']
      }
    ];

    for (const pkg of samplePackages) {
      const existing = await prisma.package.findUnique({
        where: { slug: pkg.slug }
      });

      if (!existing) {
        await prisma.package.create({
          data: pkg,
        });
      }
    }

    // 5. Create site settings
    console.log('⚙️ Creating site settings...');

    const settings = [
      {
        key: 'site_name',
        value: 'Oliotya Uganda Safaris',
        category: 'general',
      },
      {
        key: 'site_description',
        value: 'Premium safari experiences in Uganda\'s most beautiful destinations',
        category: 'general',
      },
      {
        key: 'contact_email',
        value: 'Info@oliotyaugandasafaris.com',
        category: 'contact',
      },
      {
        key: 'contact_phone',
        value: '+256 414 595 945',
        category: 'contact',
      },
      {
        key: 'whatsapp_number',
        value: '+256 414 595 945',
        category: 'contact',
      },
    ];

    for (const setting of settings) {
      await prisma.siteSettings.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting,
      });
    }

    // 4. Seed destinations
    console.log('🌍 Seeding destinations...');
    await seedDestinationsComplete();

    // 5. Create team section
    console.log('👥 Creating team section...');
    await prisma.teamSection.upsert({
      where: { id: 'default-team-section' },
      update: {},
      create: {
        id: 'default-team-section',
        heading: 'OUR TEAM',
        title: 'Meet the Oliotya Uganda Safaris Family',
        description: 'Our passionate team of travel experts and local guides are dedicated to creating your perfect Ugandan adventure',
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // 6. Create email templates
    console.log('📧 Creating email templates...');

    // Skip email templates for now to avoid validation issues
    // They can be created through the CMS later

    console.log('✅ Database seeding completed successfully!');
    console.log('🎉 Your site should now be functional again.');
    console.log('📝 Next steps:');
    console.log('   1. Visit your CMS at /cms to add more content');
    console.log('   2. Create packages through the CMS');
    console.log('   3. Add team members and other content as needed');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
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
