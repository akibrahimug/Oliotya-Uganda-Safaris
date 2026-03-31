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
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = "About Us - Oliotya Uganda Safaris";
  const description = "Learn about Oliotya Uganda Safaris — our story, team, values, and commitment to delivering authentic African safari experiences.";

  const hero = await prisma.aboutHero.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { image: true },
  });

  const ogImage = hero?.image ? toAbsoluteUrl(hero.image, baseUrl) : `${baseUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/about` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/about`,
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

    const baseUrl = getBaseUrl();

    const aboutPageSchema = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Oliotya Uganda Safaris",
      description: storySection?.description || "Oliotya Uganda Safaris — expert-guided safaris, cultural tours, and unforgettable adventures across Uganda.",
      url: `${baseUrl}/about`,
      ...(heroSection?.image ? { image: toAbsoluteUrl(heroSection.image, baseUrl) } : {}),
      mainEntity: {
        "@type": "Organization",
        name: "Oliotya Uganda Safaris",
        url: baseUrl,
        description: storySection?.description || "Experience the Pearl of Africa with Oliotya Uganda Safaris.",
        ...(heroSection?.image ? { image: toAbsoluteUrl(heroSection.image, baseUrl) } : {}),
        numberOfEmployees: teamMembers.length > 0 ? { "@type": "QuantitativeValue", value: teamMembers.length } : undefined,
        member: teamMembers.map((m) => ({
          "@type": "Person",
          name: m.name,
          jobTitle: m.role,
          ...(m.image ? { image: toAbsoluteUrl(m.image, baseUrl) } : {}),
        })),
      },
    };

    return (
      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
        />
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
