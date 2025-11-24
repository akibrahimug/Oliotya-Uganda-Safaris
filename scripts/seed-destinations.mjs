#!/usr/bin/env node
import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";
import { allDestinationsOnly } from "../lib/destinations-only-data.ts";

const prisma = new PrismaClient();

async function seedDestinations() {
  console.log("Seeding destinations to database...\n");

  for (const dest of allDestinationsOnly) {
    console.log(`Processing destination: ${dest.name}...`);

    try {
      // Check if destination already exists
      const existing = await prisma.destination.findUnique({
        where: { id: dest.id },
      });

      const destinationData = {
        name: dest.name,
        category: dest.category,
        country: dest.country,
        region: dest.region || null,
        price: 0, // Default price - not in source data
        rating: 5, // Default rating
        duration: "3 Days", // Default duration - not in source data
        groupSize: 10, // Default group size
        minTravelers: 1,
        maxTravelers: 10,
        description: dest.description,
        image: dest.image,
        images: dest.images || [],
        // History
        historyTitle: dest.history?.title || null,
        historyContent: dest.history?.content || [],
        // Geography
        geographyDescription: dest.geography?.description || null,
        geographyClimate: dest.geography?.climate || null,
        // Wildlife
        wildlifeDescription: dest.wildlife?.description || null,
        wildlifeMammals: dest.wildlife?.mammals || [],
        wildlifeBirds: dest.wildlife?.birds || [],
        wildlifeFlora: dest.wildlife?.flora || [],
        // Culture
        cultureDescription: dest.culture?.description || null,
        cultureExperiences: dest.culture?.experiences || [],
        // Best time to visit
        bestTimeDescription: dest.bestTimeToVisit?.description || null,
        drySeasonTitle: dest.bestTimeToVisit?.drySeason?.title || null,
        drySeasonDescription: dest.bestTimeToVisit?.drySeason?.description || null,
        wetSeasonTitle: dest.bestTimeToVisit?.wetSeason?.title || null,
        wetSeasonDescription: dest.bestTimeToVisit?.wetSeason?.description || null,
      };

      if (existing) {
        await prisma.destination.update({
          where: { id: dest.id },
          data: destinationData,
        });
        console.log(`✓ Updated destination: ${dest.name}`);
      } else {
        await prisma.destination.create({
          data: {
            id: dest.id,
            ...destinationData,
          },
        });
        console.log(`✓ Created destination: ${dest.name}`);
      }
    } catch (error) {
      console.error(`✗ Error processing destination ${dest.name}:`, error.message);
    }
  }

  console.log(`\n✅ Successfully seeded ${allDestinationsOnly.length} destinations!`);
}

seedDestinations()
  .catch((error) => {
    console.error("❌ Error seeding destinations:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
