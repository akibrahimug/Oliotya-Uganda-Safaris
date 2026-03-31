import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookingLookup } from "./booking-lookup";
import { prisma } from "@/lib/db";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

async function getCmsData() {
  const [mainHero, hero, steps, contact, galleries] = await Promise.all([
    prisma.bookingConfirmationMainHero.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.bookingConfirmationHero.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.bookingConfirmationStep.findMany({
      where: { active: true },
      orderBy: [{ stepNumber: "asc" }, { displayOrder: "asc" }],
    }),
    prisma.bookingConfirmationContact.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.bookingConfirmationGallery.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return { mainHero, hero, steps, contact, galleries };
}

export default async function BookingConfirmationPage() {
  const { mainHero, hero, steps, contact, galleries } = await getCmsData();

  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-green-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {mainHero?.title || "Booking Confirmed!"}
          </h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto">
            {mainHero?.subtitle || "Your safari adventure is one step closer. Check your email for booking details."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 lg:py-16 bg-muted/30">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          }
        >
          <BookingLookup
            cmsHero={hero}
            cmsSteps={steps}
            cmsContact={contact}
            cmsGalleries={galleries}
          />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
