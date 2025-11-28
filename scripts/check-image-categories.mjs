import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImageCategories() {
  try {
    console.log('Checking image categories in database...\n');

    // Count total images
    const totalImages = await prisma.cMSImage.count();
    console.log(`Total images: ${totalImages}\n`);

    // Count images by category
    const categoryStats = await prisma.cMSImage.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
    });

    console.log('Images by category:');
    categoryStats.forEach(stat => {
      const category = stat.category || 'NULL';
      console.log(`  ${category}: ${stat._count.id} images`);
    });

    console.log('\n');

    // Check for images without categories
    const nullCategoryImages = await prisma.cMSImage.findMany({
      where: {
        category: null,
      },
      select: {
        id: true,
        filename: true,
        url: true,
      },
      take: 10, // Limit to 10 for display
    });

    if (nullCategoryImages.length > 0) {
      console.log('Sample images with NULL category:');
      nullCategoryImages.forEach(img => {
        console.log(`  - ${img.filename} (${img.url})`);
      });
      console.log(`  ... and ${totalImages - nullCategoryImages.length} more`);
    }

    // Check what categories are actually used
    const usedCategories = await prisma.cMSImage.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    console.log('\nUsed categories:');
    usedCategories.forEach(cat => {
      console.log(`  - ${cat.category}`);
    });

  } catch (error) {
    console.error('Error checking image categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImageCategories();
