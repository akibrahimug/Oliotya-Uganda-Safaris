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

// Force dynamic rendering - fetch data from database on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  // Fetch all About page sections from database
  const [
    heroSection,
    storySection,
    communitySection,
    statsData,
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
    prisma.aboutStats.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
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
      {statsData.length > 0 && <AboutStatsSection stats={statsData} />}

      {/* Team Section */}
      {teamMembers.length > 0 && <AboutTeamSection members={teamMembers} />}

      {/* CTA Section */}
      {ctaSection && <AboutCTASection data={ctaSection} />}

      {/* Values Section */}
      {valuesData.length > 0 && <AboutValuesSection values={valuesData} />}

      <Footer />
    </main>
  );
}
