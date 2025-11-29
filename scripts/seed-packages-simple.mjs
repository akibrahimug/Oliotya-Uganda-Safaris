#!/usr/bin/env node
import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";
const getImageUrl = (filename) => `${R2_BASE}/${IMAGE_PATH}/${filename}`;

const samplePackages = [
  {
    name: "Queen Elizabeth National Park Safari",
    slug: "queen-elizabeth-national-park-safari",
    description: "Experience the incredible wildlife diversity of Queen Elizabeth National Park, home to tree-climbing lions, elephants, and over 600 bird species.",
    shortDescription: "3-day safari in Uganda's most biodiverse park",
    price: 1200,
    duration: "3 Days",
    groupSize: 8,
    minTravelers: 2,
    category: "Safari",
    image: getImageUrl("uganda-queen-elizabeth-national-park-safari.webp"),
    featured: true,
    popular: true,
    active: true,
    itinerary: [
      {
        day: 1,
        title: "Arrival & Game Drive",
        description: "Arrive at the park and embark on an afternoon game drive to spot lions, elephants, and antelopes."
      },
      {
        day: 2,
        title: "Full Day Exploration",
        description: "Morning game drive, boat cruise on the Kazinga Channel, and afternoon game viewing."
      },
      {
        day: 3,
        title: "Departure",
        description: "Final morning game drive before departure."
      }
    ],
    includes: ["Accommodation", "Meals", "Park Fees", "Transport", "Guide"],
    excludes: ["International Flights", "Visa Fees", "Personal Expenses", "Tips"]
  },
  {
    name: "Gorilla Trekking in Bwindi Forest",
    slug: "bwindi-gorilla-trekking",
    description: "Trek with mountain gorillas in Bwindi Impenetrable Forest, home to half of the world's remaining mountain gorillas.",
    shortDescription: "4-day gorilla trekking adventure",
    price: 1500,
    duration: "4 Days",
    groupSize: 8,
    minTravelers: 2,
    category: "Gorilla Trekking",
    image: getImageUrl("bwindi-gorilla-trekking.webp"),
    featured: true,
    popular: true,
    active: true,
    itinerary: [
      {
        day: 1,
        title: "Travel to Bwindi",
        description: "Travel to Bwindi Impenetrable Forest and settle into your accommodation."
      },
      {
        day: 2,
        title: "Gorilla Trekking",
        description: "Full day gorilla trekking experience with expert guides."
      },
      {
        day: 3,
        title: "Forest Exploration",
        description: "Explore the forest trails and learn about conservation efforts."
      },
      {
        day: 4,
        title: "Departure",
        description: "Return journey with optional stops."
      }
    ],
    includes: ["Gorilla Permits", "Accommodation", "Meals", "Guide", "Park Fees"],
    excludes: ["International Flights", "Visa Fees", "Personal Expenses"]
  },
  {
    name: "Murchison Falls Adventure",
    slug: "murchison-falls-adventure",
    description: "Experience the power of Murchison Falls and abundant wildlife in Uganda's largest national park.",
    shortDescription: "3-day adventure at the mighty Murchison Falls",
    price: 1100,
    duration: "3 Days",
    groupSize: 12,
    minTravelers: 2,
    category: "Safari",
    image: getImageUrl("murchison-falls-national-park.webp"),
    featured: true,
    popular: false,
    active: true,
    itinerary: [
      {
        day: 1,
        title: "Arrival & Game Drive",
        description: "Arrive at Murchison Falls and begin with an afternoon game drive."
      },
      {
        day: 2,
        title: "Falls & River Cruise",
        description: "Visit the falls and take a boat cruise on the Nile River."
      },
      {
        day: 3,
        title: "Final Exploration",
        description: "Morning game drive before departure."
      }
    ],
    includes: ["Accommodation", "Meals", "Park Fees", "Transport", "Guide"],
    excludes: ["International Flights", "Visa Fees", "Personal Expenses"]
  }
];

async function seedPackages() {
  console.log("Seeding packages to database...\n");

  for (const pkg of samplePackages) {
    console.log(`Processing package: ${pkg.name}...`);

    try {
      // Check if package already exists
      const existing = await prisma.package.findUnique({
        where: { slug: pkg.slug },
      });

      if (existing) {
        console.log(`  ⏭️  Package ${pkg.name} already exists, skipping...`);
        continue;
      }

      console.log(`  📝 Creating package: ${pkg.name}`);

      const packageData = {
        name: pkg.name,
        slug: pkg.slug,
        description: pkg.description,
        shortDesc: pkg.shortDescription,
        price: pkg.price,
        duration: pkg.duration,
        minTravelers: pkg.minTravelers,
        maxTravelers: pkg.groupSize,
        category: pkg.category,
        image: pkg.image,
        featured: pkg.featured,
        popular: pkg.popular,
        active: pkg.active,
        itinerary: pkg.itinerary,
        included: pkg.includes,
        excluded: pkg.excludes,
        difficulty: 'MODERATE',
      };

      const createdPackage = await prisma.package.create({
        data: packageData,
      });

      console.log(`  ✅ Created package: ${createdPackage.name}`);
    } catch (error) {
      console.error(`  ❌ Error creating package ${pkg.name}:`, error.message);
    }
  }

  console.log("\n✅ Package seeding completed!");
}

seedPackages()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
