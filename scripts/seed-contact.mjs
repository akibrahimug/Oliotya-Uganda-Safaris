import { PrismaClient } from "../prisma/app/generated/prisma-client/index.js";

const prisma = new PrismaClient();

const R2_BASE = "https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev";
const IMAGE_PATH = "nambi-uganda-safaris/images";

async function main() {
  console.log("🌱 Seeding contact page sections...");

  // 1. Contact Hero Section
  console.log("Creating Contact Hero...");
  await prisma.contactHero.deleteMany();
  await prisma.contactHero.create({
    data: {
      id: "contact-hero-1",
      image: `${R2_BASE}/${IMAGE_PATH}/uganda-safari-landscape-team-adventure.webp`,
      title: "We're here to help",
      subtitle: "Get In Touch",
      description:
        "Have questions about your Uganda adventure? Our team is ready to make your journey unforgettable.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // 2. Contact Info Section
  console.log("Creating Contact Info...");
  await prisma.contactInfo.deleteMany();
  await prisma.contactInfo.create({
    data: {
      id: "contact-info-1",
      email: "info@nambiuganda.com",
      phone: "+256 788048210",
      whatsapp: "+31682754225",
      office: "Kampala, Uganda",
      businessHours: {
        monFri: "Mon - Fri: 8AM - 6PM EAT",
        sat: "Sat: 9AM - 2PM EAT",
        sun: "Sun: Closed",
      },
      quickResponse:
        "Our team typically responds within 2-4 hours during business hours. For urgent matters, please call us directly.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // 3. FAQs
  console.log("Creating FAQs...");
  await prisma.fAQ.deleteMany();

  const faqs = [
    {
      question: "Do I need a visa to visit Uganda?",
      answer: `Most visitors can obtain a visa on arrival or apply for an e-visa online before traveling. The standard tourist visa costs $50 USD and is valid for 90 days. We recommend applying for an e-visa at least 2 weeks before your trip at <a href="https://visas.immigration.go.ug" class="text-primary hover:underline" target="_blank">visas.immigration.go.ug</a>`,
      category: "visa",
      displayOrder: 0,
    },
    {
      question: "What vaccinations do I need for Uganda?",
      answer:
        "A yellow fever vaccination certificate is required for entry into Uganda. We also recommend vaccinations for hepatitis A & B, typhoid, and malaria prophylaxis. Consult your doctor or travel clinic at least 6-8 weeks before your trip for personalized advice.",
      category: "health",
      displayOrder: 1,
    },
    {
      question: "When is the best time to visit Uganda?",
      answer:
        "Uganda is a year-round destination! The dry seasons (June-September and December-February) are ideal for gorilla trekking and wildlife viewing. The wet seasons (March-May and October-November) offer lush landscapes and fewer tourists. Gorilla permits are available year-round.",
      category: "travel",
      displayOrder: 2,
    },
    {
      question: "How much does a gorilla trekking permit cost?",
      answer:
        "A gorilla trekking permit in Uganda costs $700 USD per person for international visitors. Permits must be booked well in advance (6-12 months recommended) as they sell out quickly. The permit includes one hour with the gorillas and park ranger guides.",
      category: "booking",
      displayOrder: 3,
    },
    {
      question: "What is your cancellation policy?",
      answer: `We offer flexible cancellation options:<ul class="list-disc ml-6 mt-2 space-y-1"><li>Free cancellation up to 30 days before departure (full refund minus processing fees)</li><li>50% refund for cancellations 15-29 days before departure</li><li>No refund for cancellations less than 14 days before departure</li><li>Travel insurance is highly recommended</li></ul>`,
      category: "booking",
      displayOrder: 4,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and PayPal. A 30% deposit is required at booking, with the balance due 45 days before departure. Payment plans are available for bookings made more than 90 days in advance.",
      category: "payment",
      displayOrder: 5,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: {
        ...faq,
        active: true,
      },
    });
  }

  // 4. Contact Resources
  console.log("Creating Contact Resources...");
  await prisma.contactResource.deleteMany();

  const resources = [
    {
      title: "Uganda Travel Guide",
      description:
        "Complete guide to visiting Uganda including transportation, accommodation, culture, and safety tips.",
      icon: "Plane",
      linkText: "Read Guide",
      linkUrl: "/destinations",
      isExternal: false,
      displayOrder: 0,
    },
    {
      title: "Visa & Entry Requirements",
      description:
        "Detailed information about visa requirements, entry permits, and immigration procedures for Uganda.",
      icon: "Shield",
      linkText: "Apply for Visa",
      linkUrl: "https://visas.immigration.go.ug",
      isExternal: true,
      displayOrder: 1,
    },
    {
      title: "Booking & Payment Guide",
      description:
        "Learn about our booking process, payment options, deposit requirements, and cancellation policies.",
      icon: "CreditCard",
      linkText: "Learn More",
      linkUrl: "/about",
      isExternal: false,
      displayOrder: 2,
    },
  ];

  for (const resource of resources) {
    await prisma.contactResource.create({
      data: {
        ...resource,
        active: true,
      },
    });
  }

  console.log("✅ Contact page seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding contact page:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
