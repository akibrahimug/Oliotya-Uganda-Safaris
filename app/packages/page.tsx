import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { PackagesContent } from "@/components/packages-content";
import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHeroData() {
  const heroSection = await prisma.packagesHero.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  if (!heroSection) {
    // Fallback to default
    const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
    const IMAGE_PATH = "nambi-uganda-safaris/images";

    return [{
      image: `${R2_BASE}/${IMAGE_PATH}/uganda-queen-elizabeth-national-park-safari.webp`,
      title: "Discover the Pearl of Africa",
      subtitle: "Safari Packages",
      description: "Explore curated safari experiences across Uganda's most breathtaking destinations and national parks.",
    }];
  }

  return [{
    image: heroSection.image,
    title: heroSection.title,
    subtitle: heroSection.subtitle,
    description: heroSection.description,
  }];
}

export default async function PackagesPage() {
  const heroSlides = await getHeroData();

  return (
    <main className="min-h-screen">
      <Header />
      <PageHero slides={heroSlides} showCounter={false} showDots={false} autoPlay={false} />
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        }
      >
        <PackagesContent />
      </Suspense>
      <Footer />
    </main>
  );
}
