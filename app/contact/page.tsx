import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactHeroSection } from "@/components/contact-hero-section";
import { ContactFormSection } from "@/components/contact-form-section";
import { ContactFAQSection } from "@/components/contact-faq-section";
import { ContactResourcesSection } from "@/components/contact-resources-section";
import { prisma } from "@/lib/db";

// Force dynamic rendering - fetch data from database on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  // Fetch all Contact page sections from database
  const [heroSection, infoSectionRaw, faqsRaw, resources] = await Promise.all([
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

  // Transform the data to match component prop types
  const infoSection = infoSectionRaw ? {
    email: infoSectionRaw.email,
    phone: infoSectionRaw.phone,
    whatsapp: infoSectionRaw.whatsapp,
    office: infoSectionRaw.office,
    businessHours: infoSectionRaw.businessHours as { monFri: string; sat: string; sun: string },
    quickResponse: infoSectionRaw.quickResponse,
  } : null;

  const faqs = faqsRaw.map(faq => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category || undefined,
  }));

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      {heroSection && <ContactHeroSection data={heroSection} />}

      {/* Contact Form Section with Info Sidebar */}
      <ContactFormSection infoData={infoSection} />

      {/* FAQ Section */}
      {faqs.length > 0 && <ContactFAQSection data={faqs} />}

      {/* Resources Section */}
      {resources.length > 0 && <ContactResourcesSection data={resources} />}

      <Footer />
    </main>
  );
}
