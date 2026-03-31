import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { DestinationsCTASection } from "@/components/destinations-cta-section";
import { DestinationsGrid } from "@/components/destinations-grid";
import { prisma } from "@/lib/db";
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = "Destinations - Oliotya Uganda Safaris";
  const description =
    "Explore Uganda's most breathtaking destinations — national parks, mountains, lakes, and wildlife reserves. Discover the Pearl of Africa.";

  const hero = await prisma.destinationsHero.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { image: true },
  });

  const ogImage = hero?.image ? toAbsoluteUrl(hero.image, baseUrl) : `${baseUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/destinations` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/destinations`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function DestinationsPage() {
  const R2_BASE =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";

  const [heroSection, ctaSection, destinations] = await Promise.all([
    prisma.destinationsHero.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.destinationsCTA.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.destination.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
        image: true,
        description: true,
        country: true,
        region: true,
      },
    }),
  ]);

  const heroSlides = heroSection
    ? [
        {
          image: heroSection.image,
          title: heroSection.title,
          subtitle: heroSection.subtitle,
          description: heroSection.description,
        },
      ]
    : [
        {
          image: `${R2_BASE}/nambi-uganda-safaris/images/uganda-queen-elizabeth-national-park-safari.webp`,
          title: "Discover the Pearl of Africa",
          subtitle: "Explore Destinations",
          description:
            "Discover Uganda's most breathtaking locations and unique experiences across diverse landscapes and ecosystems.",
        },
      ];

  const baseUrl = getBaseUrl();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Uganda Safari Destinations",
    description: "Uganda's most breathtaking destinations — national parks, mountains, lakes, and wildlife reserves",
    url: `${baseUrl}/destinations`,
    numberOfItems: destinations.length,
    itemListElement: destinations.map((dest, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: dest.name,
      url: `${baseUrl}/destination/${dest.id}`,
      image: dest.image,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />
      <main className="flex-1">
        <PageHero slides={heroSlides} showCounter={false} showDots={false} autoPlay={false} />
        <DestinationsGrid destinations={destinations} />
        {ctaSection && <DestinationsCTASection data={ctaSection} />}
      </main>
      <Footer />
    </div>
  );
}
