import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { DestinationsCTASection } from "@/components/destinations-cta-section";
import { DestinationsGrid } from "@/components/destinations-grid";
import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPageData() {
  try {
    const [heroSection, ctaSection] = await Promise.all([
      prisma.destinationsHero.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.destinationsCTA.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
    ]);

    // Fallback hero data
    const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
    const IMAGE_PATH = "nambi-uganda-safaris/images";

    const heroSlides = heroSection
      ? [{
          image: heroSection.image,
          title: heroSection.title,
          subtitle: heroSection.subtitle,
          description: heroSection.description,
        }]
      : [{
          image: `${R2_BASE}/${IMAGE_PATH}/uganda-queen-elizabeth-national-park-safari.webp`,
          title: "Discover the Pearl of Africa",
          subtitle: "Explore Destinations",
          description: "Discover Uganda's most breathtaking locations and unique experiences across diverse landscapes and ecosystems.",
        }];

    return { heroSlides, ctaSection };
  } catch (error) {
    console.error("Error fetching destinations page data:", error);
    // Return fallback data if database query fails
    const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
    const IMAGE_PATH = "nambi-uganda-safaris/images";
    return {
      heroSlides: [{
        image: `${R2_BASE}/${IMAGE_PATH}/uganda-queen-elizabeth-national-park-safari.webp`,
        title: "Discover the Pearl of Africa",
        subtitle: "Explore Destinations",
        description: "Discover Uganda's most breathtaking locations and unique experiences across diverse landscapes and ecosystems.",
      }],
      ctaSection: null,
    };
  }
}

export default async function DestinationsPage() {
  const { heroSlides, ctaSection } = await getPageData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero slides={heroSlides} showCounter={false} showDots={false} autoPlay={false} />
        <DestinationsGrid />
        {ctaSection && <DestinationsCTASection data={ctaSection} />}
      </main>

      <Footer />
    </div>
  );
}
