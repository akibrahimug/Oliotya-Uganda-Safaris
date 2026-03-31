import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactHeroSection } from "@/components/contact-hero-section";
import { ContactFormSection } from "@/components/contact-form-section";
import { ContactFAQSection } from "@/components/contact-faq-section";
import { ContactResourcesSection } from "@/components/contact-resources-section";
import { prisma } from "@/lib/db";
import { getBaseUrl, toAbsoluteUrl } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = "Contact Us - Oliotya Uganda Safaris";
  const description = "Get in touch with Oliotya Uganda Safaris to plan your dream safari. Contact us by email, phone, or WhatsApp — we're here to help.";

  const hero = await prisma.contactHero.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { image: true },
  });

  const ogImage = hero?.image ? toAbsoluteUrl(hero.image, baseUrl) : `${baseUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/contact` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/contact`,
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

export default async function ContactPage() {
  try {
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

    const faqSchema = faqs.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    } : null;

    const baseUrl = getBaseUrl();
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/#business`,
      name: "Oliotya Uganda Safaris",
      url: baseUrl,
      description: "Expert-guided Uganda safari packages — gorilla trekking, wildlife safaris, mountain expeditions, and cultural tours.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kampala",
        addressCountry: "UG",
        ...(infoSection?.office ? { streetAddress: infoSection.office } : {}),
      },
      ...(infoSection?.phone ? { telephone: infoSection.phone } : {}),
      ...(infoSection?.email ? { email: infoSection.email } : {}),
      openingHoursSpecification: infoSection?.businessHours ? [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: "09:00",
          closes: "16:00",
        },
      ] : undefined,
      sameAs: [`${baseUrl}/about`],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        ...(infoSection?.phone ? { telephone: infoSection.phone } : {}),
        ...(infoSection?.email ? { email: infoSection.email } : {}),
        availableLanguage: "English",
      },
    };

    return (
      <main className="min-h-screen">
        <Header />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

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
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    // Return page with contact form if database query fails
    return (
      <main className="min-h-screen">
        <Header />
        <ContactFormSection infoData={null} />
        <Footer />
      </main>
    );
  }
}
