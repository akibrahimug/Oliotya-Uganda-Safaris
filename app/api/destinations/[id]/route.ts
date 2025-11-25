import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/destinations/[id]
 * Public endpoint to get a single destination with transformed data structure
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const destination = await prisma.destination.findUnique({
      where: { id: parseInt(id) },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    // Transform the flat database structure into nested objects for the frontend
    const transformedDestination = {
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      category: destination.category,
      country: destination.country,
      region: destination.region,
      description: destination.description,
      image: destination.image,
      images: destination.images || [],
      gallery2Images: destination.gallery2Images || [],

      // History section
      history: destination.historyTitle && destination.historyContent && (destination.historyContent as string[]).length > 0 ? {
        title: destination.historyTitle,
        content: destination.historyContent as string[],
      } : null,

      // Geography section
      geography: destination.geographyDescription || destination.geographyClimate ? {
        description: destination.geographyDescription || "",
        climate: destination.geographyClimate || "",
      } : null,

      // Wildlife section
      wildlife: destination.wildlifeDescription ||
                (destination.wildlifeMammals as string[])?.length > 0 ||
                (destination.wildlifeBirds as string[])?.length > 0 ||
                (destination.wildlifeFlora as string[])?.length > 0 ? {
        description: destination.wildlifeDescription || "",
        mammals: (destination.wildlifeMammals as string[]) || [],
        birds: (destination.wildlifeBirds as string[]) || [],
        flora: (destination.wildlifeFlora as string[]) || [],
      } : null,

      // Culture section
      culture: destination.cultureDescription || (destination.cultureExperiences as string[])?.length > 0 ? {
        description: destination.cultureDescription || "",
        experiences: (destination.cultureExperiences as string[]) || [],
      } : null,

      // Best time to visit section
      bestTimeToVisit: destination.bestTimeDescription ||
                       destination.drySeasonTitle ||
                       destination.wetSeasonTitle ? {
        description: destination.bestTimeDescription || "",
        drySeason: {
          title: destination.drySeasonTitle || "",
          description: destination.drySeasonDescription || "",
        },
        wetSeason: {
          title: destination.wetSeasonTitle || "",
          description: destination.wetSeasonDescription || "",
        },
      } : null,
    };

    return NextResponse.json({ destination: transformedDestination });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 }
    );
  }
}
