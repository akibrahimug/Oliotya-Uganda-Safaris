import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const R2_BASE = "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";

async function main() {
  console.log("Seeding About Hero and CTA sections...");

  // Hero Section
  await prisma.aboutHero.upsert({
    where: { id: "about-hero-1" },
    update: {},
    create: {
      id: "about-hero-1",
      image: `${R2_BASE}/${IMAGE_PATH}/uganda-safari-landscape-team-adventure.webp`,
      title: "Your trusted partner in",
      subtitle: "About Nambi Uganda Safaris",
      description: "Discovering the Pearl of Africa - crafting unforgettable experiences through passionate, personalized service.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log("✅ Hero section seeded");

  // CTA Section
  await prisma.aboutCTA.upsert({
    where: { id: "about-cta-1" },
    update: {},
    create: {
      id: "about-cta-1",
      badge: "Join Thousands of Happy Travelers",
      heading: "Ready to Start Your",
      headingHighlight: "Uganda Adventure",
      description: "Let our expert team craft a personalized safari experience tailored to your dreams. From gorilla trekking to cultural tours, your perfect adventure awaits.",
      button1Text: "Explore Our Destinations",
      button1Link: "/destinations",
      button2Text: "Get Custom Itinerary",
      button2Link: "/contact",
      footerText: "🌟 98% Customer Satisfaction • 🏆 Award-Winning Service • 💚 Eco-Friendly Tours",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log("✅ CTA section seeded");
  console.log("✅ About Hero and CTA sections seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
