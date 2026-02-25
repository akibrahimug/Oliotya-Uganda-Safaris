import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { HomePageContent } from "@/components/home-page-content";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oliotya Uganda Safaris - Discover Uganda",
  description:
    "Experience the Pearl of Africa with Oliotya Uganda Safaris. Explore Uganda's wildlife, mountains, and natural wonders.",
};

// Cache homepage for faster repeat loads while still refreshing CMS content regularly.
export const revalidate = 300;

export default async function Home() {
  // Fetch all section data on the server
  try {
    const [experienceSection, tourGuideSection, videoSection, heroSlides, siteSettings] = await Promise.all([
      prisma.experienceSection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.tourGuideSection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.videoSection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.heroSlide.findMany({
        where: { active: true },
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          subtitle: true,
          description: true,
          image: true,
          displayOrder: true,
        },
      }),
      getSiteSettings(),
    ]);

    return (
      <main className="min-h-screen">
        <Header initialSettings={siteSettings} />
        <HeroCarousel initialSlides={heroSlides} />
        <HomePageContent
          experienceData={experienceSection}
          tourGuideData={tourGuideSection}
          videoData={videoSection}
        />
        <Footer initialSettings={siteSettings} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching home page data:", error);
    // Return page with null data - components will handle gracefully
    return (
      <main className="min-h-screen">
        <Header />
        <HeroCarousel />
        <HomePageContent
          experienceData={null}
          tourGuideData={null}
          videoData={null}
        />
        <Footer />
      </main>
    );
  }
}
