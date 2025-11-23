import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactHeroSection } from "@/components/contact-hero-section";
import { ContactInfoSection } from "@/components/contact-info-section";
import { ContactFAQSection } from "@/components/contact-faq-section";
import { ContactResourcesSection } from "@/components/contact-resources-section";
import { ContactFormSection } from "@/components/contact-form-section";
import { prisma } from "@/lib/db";

// Force dynamic rendering - fetch data from database on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  // Fetch all Contact page sections from database
  const [heroSection, infoSection, faqs, resources] = await Promise.all([
    prisma.contactHero.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.contactInfo.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.fAQ.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.contactResource.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      {heroSection && <ContactHeroSection data={heroSection} />}

      {/* Contact Info Section */}
      {infoSection && <ContactInfoSection data={infoSection} />}

      {/* Contact Form Section */}
      <ContactFormSection />

      {/* Resources Section */}
      {resources.length > 0 && <ContactResourcesSection resources={resources} />}

      {/* FAQ Section */}
      {faqs.length > 0 && <ContactFAQSection faqs={faqs} />}

      <Footer />
    </main>
  );
}
