import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { HomePageContent } from "@/components/home-page-content";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/db";

// Force dynamic rendering - fetch data from database on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // Fetch all section data on the server
  try {
    const [experienceSection, tourGuideSection, videoSection] = await Promise.all([
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
    ]);

    return (
      <main className="min-h-screen">
        <Header />
        <HeroCarousel />
        <HomePageContent
          experienceData={experienceSection}
          tourGuideData={tourGuideSection}
          videoData={videoSection}
        />
        <Footer />
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
