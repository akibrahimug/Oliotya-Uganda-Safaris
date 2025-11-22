#!/usr/bin/env node
import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";
const getImageUrl = (filename) => `${R2_BASE}/${IMAGE_PATH}/${filename}`;

async function seedHomeSections() {
  console.log("Seeding home page sections...\n");

  // Seed Experience Section
  console.log("Creating Experience Section...");
  const existingExperience = await prisma.experienceSection.findFirst();

  if (existingExperience) {
    await prisma.experienceSection.update({
      where: { id: existingExperience.id },
      data: {
        heading: "We are collectors of",
        title: "Unique Experiences",
        description: "Committed to be home country's traditional values and the highest possible standard and service. We focus on our customers needs and truly believe that if we get essential clients' holidays WINS made.",
        image: getImageUrl("international.webp"),
        stat1Value: "10+",
        stat1Label: "Destinations",
        stat2Value: "8+",
        stat2Label: "Years Experience",
        badgeText: "1 International Travel",
        backgroundText: "UGANDA",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Updated Experience Section");
  } else {
    await prisma.experienceSection.create({
      data: {
        heading: "We are collectors of",
        title: "Unique Experiences",
        description: "Committed to be home country's traditional values and the highest possible standard and service. We focus on our customers needs and truly believe that if we get essential clients' holidays WINS made.",
        image: getImageUrl("international.webp"),
        stat1Value: "10+",
        stat1Label: "Destinations",
        stat2Value: "8+",
        stat2Label: "Years Experience",
        badgeText: "1 International Travel",
        backgroundText: "UGANDA",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Created Experience Section");
  }

  // Seed Tour Guide Section
  console.log("Creating Tour Guide Section...");
  const existingTourGuide = await prisma.tourGuideSection.findFirst();

  if (existingTourGuide) {
    await prisma.tourGuideSection.update({
      where: { id: existingTourGuide.id },
      data: {
        title: "Escape the",
        subtitle: "Ordinary",
        description: "Nambi Uganda Safaris is a safari company that offers customized tours to experience the extra ordinary landscape and wildlife of Uganda. The company's tours include cultural experiences, wildlife tours, hiking tours, and special occasion tours. They take care of everything, from the pick-up and drop-off at the airport to booking hotels. Nambi Uganda Safaris is committed to providing the best experience possible, and their team pays close attention to every detail to ensure that each safari is unique and tailored to the customer's needs. With a dedicated tour guide assigned to each customer, Nambi Uganda Safaris aims to provide an unforgettable Ugandan safari experience. At Nambi Uganda Safaris, we pride ourselves on promoting responsible and sustainable tourism. We believe in preserving the natural environment and local communities while providing unforgettable experiences for our customers. We work closely with local communities and conservation organizations to create safari experiences that benefit both the environment and the people living in the area. Our goal is to leave a positive impact on the communities we visit while providing our customers with an authentic Ugandan safari experience. By traveling with us, you can be confident that you are contributing to the preservation of Uganda's natural and cultural heritage.",
        mapImage: getImageUrl("uganda-map-with-national-parks-markers.svg"),
        buttonText: "Read More",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Updated Tour Guide Section");
  } else {
    await prisma.tourGuideSection.create({
      data: {
        title: "Escape the",
        subtitle: "Ordinary",
        description: "Nambi Uganda Safaris is a safari company that offers customized tours to experience the extra ordinary landscape and wildlife of Uganda. The company's tours include cultural experiences, wildlife tours, hiking tours, and special occasion tours. They take care of everything, from the pick-up and drop-off at the airport to booking hotels. Nambi Uganda Safaris is committed to providing the best experience possible, and their team pays close attention to every detail to ensure that each safari is unique and tailored to the customer's needs. With a dedicated tour guide assigned to each customer, Nambi Uganda Safaris aims to provide an unforgettable Ugandan safari experience. At Nambi Uganda Safaris, we pride ourselves on promoting responsible and sustainable tourism. We believe in preserving the natural environment and local communities while providing unforgettable experiences for our customers. We work closely with local communities and conservation organizations to create safari experiences that benefit both the environment and the people living in the area. Our goal is to leave a positive impact on the communities we visit while providing our customers with an authentic Ugandan safari experience. By traveling with us, you can be confident that you are contributing to the preservation of Uganda's natural and cultural heritage.",
        mapImage: getImageUrl("uganda-map-with-national-parks-markers.svg"),
        buttonText: "Read More",
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Created Tour Guide Section");
  }

  // Seed Video Section
  console.log("Creating Video Section...");
  const existingVideo = await prisma.videoSection.findFirst();

  if (existingVideo) {
    await prisma.videoSection.update({
      where: { id: existingVideo.id },
      data: {
        title: "Experience Uganda's Natural Wonders",
        description: "Watch our latest safari adventure showcasing the breathtaking landscapes and incredible wildlife of the Pearl of Africa.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video URL
        thumbnailUrl: getImageUrl("uganda-safari-landscape-team-adventure.webp"),
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Updated Video Section");
  } else {
    await prisma.videoSection.create({
      data: {
        title: "Experience Uganda's Natural Wonders",
        description: "Watch our latest safari adventure showcasing the breathtaking landscapes and incredible wildlife of the Pearl of Africa.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video URL
        thumbnailUrl: getImageUrl("uganda-safari-landscape-team-adventure.webp"),
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✓ Created Video Section");
  }

  console.log("\n✅ Successfully seeded home page sections!");
}

seedHomeSections()
  .catch((error) => {
    console.error("❌ Error seeding home sections:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
