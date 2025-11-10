#!/usr/bin/env node
import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const existingSlides = [
  {
    title: "Discover the Magic of",
    subtitle: "Uganda",
    description:
      "Home to the endangered mountain gorillas, Uganda offers unforgettable wildlife encounters in pristine rainforests.",
    image: "/uganda-mountain-gorillas-bwindi-forest.jpg",
    displayOrder: 0,
    active: true,
  },
  {
    title: "Experience Wildlife",
    subtitle: "Safari Adventures",
    description:
      "Witness the Big Five and diverse ecosystems across Uganda's stunning national parks and game reserves.",
    image: "/uganda-queen-elizabeth-national-park-safari.jpg",
    displayOrder: 1,
    active: true,
  },
  {
    title: "Explore Natural Wonders",
    subtitle: "Murchison Falls",
    description:
      "Marvel at the world's most powerful waterfall where the Nile explodes through a narrow gorge.",
    image: "/uganda-murchison-falls-waterfall.jpg",
    displayOrder: 2,
    active: true,
  },
  {
    title: "Relax by the Waters",
    subtitle: "Lake Victoria",
    description:
      "Discover Africa's largest lake with pristine beaches, fishing villages, and stunning sunsets.",
    image: "/uganda-lake-victoria-sunset.jpg",
    displayOrder: 3,
    active: true,
  },
  {
    title: "Conquer the Peaks",
    subtitle: "Rwenzori Mountains",
    description:
      "Trek the legendary Mountains of the Moon with snow-capped peaks near the equator.",
    image: "/uganda-rwenzori-mountains-snow.jpg",
    displayOrder: 4,
    active: true,
  },
];

async function seedHeroSlides() {
  console.log("Seeding hero slides...\n");

  // Check if slides already exist
  const existingCount = await prisma.heroSlide.count();
  if (existingCount > 0) {
    console.log(`⚠️  Found ${existingCount} existing slides.`);
    console.log("Do you want to delete them and reseed? (Ctrl+C to cancel)\n");

    // Wait 3 seconds for user to cancel
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("Deleting existing slides...");
    await prisma.heroSlide.deleteMany();
    console.log("✓ Deleted\n");
  }

  // Create slides
  for (const slide of existingSlides) {
    const created = await prisma.heroSlide.create({
      data: slide,
    });
    console.log(`✓ Created slide ${slide.displayOrder + 1}: "${slide.subtitle}"`);
  }

  console.log(`\n✅ Successfully seeded ${existingSlides.length} hero slides!`);
}

seedHeroSlides()
  .catch((error) => {
    console.error("❌ Error seeding hero slides:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
