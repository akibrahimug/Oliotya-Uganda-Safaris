#!/usr/bin/env node
import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";
const getImageUrl = (filename) => `${R2_BASE}/${IMAGE_PATH}/${filename}`;

async function seedPackagesDestinationsSections() {
  console.log("Seeding Packages and Destinations page sections...\n");

  // Seed Packages Hero Section
  console.log("Creating Packages Hero Section...");
  const existingPackagesHero = await prisma.packagesHero.findFirst();

  if (existingPackagesHero) {
    await prisma.packagesHero.update({
      where: { id: existingPackagesHero.id },
      data: {
        image: getImageUrl("uganda-queen-elizabeth-national-park-safari.webp"),
        title: "Discover the Pearl of Africa",
        subtitle: "Safari Packages",
        description: "Explore curated safari experiences across Uganda's most breathtaking destinations and national parks.",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Updated Packages Hero Section");
  } else {
    await prisma.packagesHero.create({
      data: {
        image: getImageUrl("uganda-queen-elizabeth-national-park-safari.webp"),
        title: "Discover the Pearl of Africa",
        subtitle: "Safari Packages",
        description: "Explore curated safari experiences across Uganda's most breathtaking destinations and national parks.",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Created Packages Hero Section");
  }

  // Seed Destinations Hero Section
  console.log("Creating Destinations Hero Section...");
  const existingDestinationsHero = await prisma.destinationsHero.findFirst();

  if (existingDestinationsHero) {
    await prisma.destinationsHero.update({
      where: { id: existingDestinationsHero.id },
      data: {
        image: getImageUrl("uganda-queen-elizabeth-national-park-safari.webp"),
        title: "Discover the Pearl of Africa",
        subtitle: "Explore Destinations",
        description: "Discover Uganda's most breathtaking locations and unique experiences across diverse landscapes and ecosystems.",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Updated Destinations Hero Section");
  } else {
    await prisma.destinationsHero.create({
      data: {
        image: getImageUrl("uganda-queen-elizabeth-national-park-safari.webp"),
        title: "Discover the Pearl of Africa",
        subtitle: "Explore Destinations",
        description: "Discover Uganda's most breathtaking locations and unique experiences across diverse landscapes and ecosystems.",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Created Destinations Hero Section");
  }

  // Seed Destinations CTA Section
  console.log("Creating Destinations CTA Section...");
  const existingDestinationsCTA = await prisma.destinationsCTA.findFirst();

  if (existingDestinationsCTA) {
    await prisma.destinationsCTA.update({
      where: { id: existingDestinationsCTA.id },
      data: {
        title: "Ready to Start Your Adventure?",
        description: "Browse our curated safari packages and find the perfect journey for you",
        buttonText: "View Safari Packages",
        buttonLink: "/packages",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Updated Destinations CTA Section");
  } else {
    await prisma.destinationsCTA.create({
      data: {
        title: "Ready to Start Your Adventure?",
        description: "Browse our curated safari packages and find the perfect journey for you",
        buttonText: "View Safari Packages",
        buttonLink: "/packages",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Created Destinations CTA Section");
  }

  console.log("\n✅ Successfully seeded Packages and Destinations page sections!");
}

seedPackagesDestinationsSections()
  .catch((error) => {
    console.error("❌ Error seeding Packages/Destinations sections:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
