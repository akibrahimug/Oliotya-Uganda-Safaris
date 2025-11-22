import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const R2_BASE = "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris";

async function main() {
  console.log("Seeding team members...");

  // Team member 1
  await prisma.teamMember.upsert({
    where: { id: "team-1" },
    update: {},
    create: {
      id: "team-1",
      name: "Sarah Nambi",
      role: "Founder & CEO",
      bio: "With over 15 years of experience in the tourism industry, Sarah founded Nambi Uganda Safaris to share the beauty of Uganda with the world. Her passion for conservation and community development drives everything we do.",
      image: `${R2_BASE}/${IMAGE_PATH}/team-placeholder-1.jpg`,
      years: "15+ Years",
      specialties: ["Wildlife Conservation", "Sustainable Tourism", "Community Development"],
      displayOrder: 0,
      active: true,
    },
  });

  // Team member 2
  await prisma.teamMember.upsert({
    where: { id: "team-2" },
    update: {},
    create: {
      id: "team-2",
      name: "David Mukasa",
      role: "Head Safari Guide",
      bio: "Born and raised in Uganda, David has an encyclopedic knowledge of East African wildlife. His engaging storytelling and keen eye make every safari unforgettable.",
      image: `${R2_BASE}/${IMAGE_PATH}/team-placeholder-2.jpg`,
      years: "12+ Years",
      specialties: ["Wildlife Tracking", "Bird Watching", "Cultural Tours"],
      displayOrder: 1,
      active: true,
    },
  });

  // Team member 3
  await prisma.teamMember.upsert({
    where: { id: "team-3" },
    update: {},
    create: {
      id: "team-3",
      name: "Grace Atim",
      role: "Operations Manager",
      bio: "Grace ensures every detail of your safari runs smoothly. From logistics to customer care, her meticulous planning guarantees a seamless experience.",
      image: `${R2_BASE}/${IMAGE_PATH}/team-placeholder-3.jpg`,
      years: "8+ Years",
      specialties: ["Logistics", "Customer Service", "Itinerary Planning"],
      displayOrder: 2,
      active: true,
    },
  });

  console.log("✅ Team members seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
