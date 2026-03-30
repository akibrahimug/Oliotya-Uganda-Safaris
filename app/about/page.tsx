import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AboutHeroSection } from "@/components/about-hero-section";
import { AboutStorySection } from "@/components/about-story-section";
import { AboutCommunitySection } from "@/components/about-community-section";
import { AboutStatsSection } from "@/components/about-stats-section";
import { AboutValuesSection } from "@/components/about-values-section";
import { AboutTeamSection } from "@/components/about-team-section";
import { AboutCTASection } from "@/components/about-cta-section";
import { prisma } from "@/lib/db";
import { getBaseUrl } from "@/lib/seo";

// Force dynamic rendering - fetch data from database on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateMetadata(): Metadata {
  const baseUrl = getBaseUrl();
  return {
    title: "About Us - Oliotya Uganda Safaris",
    description: "Learn about Oliotya Uganda Safaris — our story, team, values, and commitment to delivering authentic African safari experiences.",
    alternates: {
      canonical: `${baseUrl}/about`,
    },
    openGraph: {
      title: "About Us - Oliotya Uganda Safaris",
      description: "Learn about Oliotya Uganda Safaris — our story, team, values, and commitment to delivering authentic African safari experiences.",
      url: `${baseUrl}/about`,
    },
  };
}

export default async function AboutPage() {
  try {
    // Fetch all About page sections from database
    const [
      heroSection,
      storySection,
      communitySection,
      statsSection,
      valuesData,
      teamMembers,
      ctaSection,
    ] = await Promise.all([
      prisma.aboutHero.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.aboutStorySection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.aboutCommunitySection.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.aboutStats.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.aboutValue.findMany({
        where: { active: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.teamMember.findMany({
        where: { active: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.aboutCTA.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
    ]);

    return (
      <main className="min-h-screen">
        <Header />

        {/* Hero Section */}
        {heroSection && <AboutHeroSection data={heroSection} />}

        {/* Our Story Section */}
        {storySection && <AboutStorySection data={storySection} />}

        {/* Community Impact Section */}
        {communitySection && <AboutCommunitySection data={communitySection} />}

        {/* Stats Section */}
        {statsSection && <AboutStatsSection data={statsSection} />}

        {/* Team Section */}
        {teamMembers.length > 0 && <AboutTeamSection members={teamMembers} />}

        {/* CTA Section */}
        {ctaSection && <AboutCTASection data={ctaSection} />}

        {/* Values Section */}
        {valuesData.length > 0 && <AboutValuesSection values={valuesData} />}

        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error fetching about page data:", error);
    // Return page with empty sections if database query fails
    return (
      <main className="min-h-screen">
        <Header />
        <Footer />
      </main>
    );
  }
}
