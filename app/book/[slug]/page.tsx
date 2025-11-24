"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  Phone,
  ArrowLeft,
  Shield,
  Calendar,
  Users,
  Info,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Package {
  id: number;
  name: string;
  slug: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  image: string;
  minTravelers: number;
  maxTravelers: number;
  difficulty: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackage();
  }, [slug]);

  const fetchPackage = async () => {
    try {
      const response = await fetch("/api/cms/packages");
      if (!response.ok) throw new Error("Failed to fetch packages");

      const data = await response.json();
      const foundPkg = data.packages.find((p: Package) => p.slug === slug);

      if (!foundPkg) {
        router.push("/packages");
        return;
      }

      setPkg(foundPkg);
    } catch (error) {
      console.error("Error fetching package:", error);
      router.push("/packages");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = (confirmationNumber: string) => {
    router.push(`/booking-confirmation?confirmation=${confirmationNumber}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!pkg) {
    return null;
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <Header />

      {/* Back Navigation */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Package
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
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
                <span className="text-2xl font-bold">${pkg.price}</span>
                <span>/ person</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Complete Your Booking</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below to reserve your safari adventure. We'll send you
                    payment instructions via email.
                  </p>
                </CardHeader>
                <CardContent>
                  <BookingForm
                    bookingType="PACKAGE"
                    itemId={pkg.id}
                    itemName={pkg.name}
                    pricePerPerson={pkg.price}
                    onSuccess={handleBookingSuccess}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* What Happens Next */}
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-primary" />
                    What Happens Next
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Instant Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive your booking confirmation number immediately
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        Get bank transfer details sent to your email
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Make Payment</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete bank transfer at your convenience
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Final Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        We verify payment and send your final booking details
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Bank transfer details will be sent to your email
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Payment due within 48 hours to secure your booking
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Booking confirmed once payment is received and verified
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Full refund available up to 30 days before departure
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Trust */}
              <Card className="shadow-lg bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    Your Information is Safe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Your personal information is encrypted and securely stored. We never
                    share your details with third parties.
                  </p>
                  <Separator />
                  <p className="text-muted-foreground">
                    Licensed Tour Operator • Registered with Uganda Tourism Board
                  </p>
                </CardContent>
              </Card>

              {/* Need Help */}
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
                      href="mailto:info@nambisafaris.com"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4 text-primary" />
                      <span>info@nambisafaris.com</span>
                    </a>
                    <a
                      href="tel:+256123456789"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4 text-primary" />
                      <span>+256 123 456 789</span>
                    </a>
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
