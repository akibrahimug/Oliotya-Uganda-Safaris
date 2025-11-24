#!/usr/bin/env node
import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";
import { allPackages } from "../lib/packages-data.ts";

const prisma = new PrismaClient();

async function seedPackages() {
  console.log("Seeding packages to database...\n");

  for (const pkg of allPackages) {
    console.log(`Processing package: ${pkg.name}...`);

    try {
      // Check if package already exists
      const existing = await prisma.package.findUnique({
        where: { id: pkg.id },
      });

      const packageData = {
        name: pkg.name,
        slug: pkg.slug,
        category: pkg.category,
        duration: pkg.duration,
        price: pkg.price,
        description: pkg.description,
        shortDesc: pkg.description.substring(0, 150), // Use first 150 chars as short desc
        image: pkg.image,
        images: pkg.images,
        highlights: pkg.highlights,
        itinerary: pkg.itinerary,
        included: pkg.included,
        excluded: pkg.excluded,
        minTravelers: pkg.minTravelers,
        maxTravelers: pkg.maxTravelers,
        difficulty: pkg.difficulty,
        featured: pkg.featured || false,
        popular: pkg.popular || false,
        active: pkg.active !== undefined ? pkg.active : true,
        displayOrder: pkg.id,
      };

      if (existing) {
        await prisma.package.update({
          where: { id: pkg.id },
          data: packageData,
        });
        console.log(`✓ Updated package: ${pkg.name}`);
      } else {
        await prisma.package.create({
          data: {
            id: pkg.id,
            ...packageData,
          },
        });
        console.log(`✓ Created package: ${pkg.name}`);
      }
    } catch (error) {
      console.error(`✗ Error processing package ${pkg.name}:`, error.message);
    }
  }

  console.log(`\n✅ Successfully seeded ${allPackages.length} packages!`);
}

seedPackages()
  .catch((error) => {
    console.error("❌ Error seeding packages:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
