import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingForm } from "@/components/booking-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  Phone,
  Shield,
  Users,
  Info,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;

  const [pkg, siteSettings] = await Promise.all([
    prisma.package.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        duration: true,
        price: true,
        description: true,
        image: true,
        minTravelers: true,
        maxTravelers: true,
        difficulty: true,
      },
    }),
    getSiteSettings(),
  ]);

  if (!pkg) {
    notFound();
  }

  const price = Number(pkg.price);
  const supportPhone = siteSettings?.contact?.phone || "";

  return (
    <main className="min-h-screen bg-muted/30">
      <Header showBackButton backButtonText="Back to Package" />

      <section className="relative bg-linear-to-br from-primary to-primary/80 text-primary-foreground pt-26 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl">
            <Badge className="bg-background/20 text-primary-foreground border-primary-foreground/20 mb-4">
              {pkg.category}
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Book Your Safari Adventure
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-6">
              {pkg.name}
            </p>
            <div className="flex flex-wrap gap-6 text-primary-foreground/90">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>
                  {pkg.minTravelers}-{pkg.maxTravelers} travelers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${price}</span>
                <span>/ person</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Complete Your Booking
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below to reserve your safari adventure.
                    We'll send you payment instructions via email.
                  </p>
                </CardHeader>
                <CardContent>
                  <BookingForm
                    bookingType="PACKAGE"
                    itemId={pkg.id}
                    itemName={pkg.name}
                    pricePerPerson={price}
                    initialTravelers={pkg.minTravelers}
                    minTravelers={pkg.minTravelers}
                    maxTravelers={pkg.maxTravelers}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-primary" />
                    What Happens Next
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: "Instant Confirmation",
                      desc: "Receive your booking confirmation number immediately",
                    },
                    {
                      step: 2,
                      title: "Email Instructions",
                      desc: "Get bank transfer details sent to your email",
                    },
                    {
                      step: 3,
                      title: "Make Payment",
                      desc: "Complete bank transfer at your convenience",
                    },
                    {
                      step: 4,
                      title: "Final Confirmation",
                      desc: "We verify payment and send your final booking details",
                    },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {step}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{title}</h4>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    "Bank transfer details will be sent to your email",
                    "Payment due within 48 hours to secure your booking",
                    "Booking confirmed once payment is received and verified",
                    "Full refund available up to 30 days before departure",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    Your Information is Safe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Your personal information is encrypted and securely stored.
                    We never share your details with third parties.
                  </p>
                  <Separator />
                  <p className="text-muted-foreground">
                    Licensed Tour Operator • Registered with Uganda Tourism
                    Board
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our team is here to assist you with your booking
                  </p>
                  <div className="space-y-3">
                    <a
                      href="mailto:Info@oliotyaugandasafaris.com"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Info@oliotyaugandasafaris.com</span>
                    </a>
                    {supportPhone && (
                      <a
                        href={`tel:${supportPhone.replace(/[^\d+]/g, "")}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{supportPhone}</span>
                      </a>
                    )}
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/contact">Contact Us</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
