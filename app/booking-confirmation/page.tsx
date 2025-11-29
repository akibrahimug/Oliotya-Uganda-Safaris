"use client";

import { useEffect, useState, Suspense } from "react";
export const dynamic = 'force-dynamic';
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Home,
  Mail,
  Phone,
  Clock,
  CreditCard,
  FileText,
  MessageCircle,
  Shield,
  Info,
  Calendar,
  AlertCircle
} from "lucide-react";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const confirmationNumber = searchParams.get("ref");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CMS content
  const [cmsMainHero, setCmsMainHero] = useState<any>(null);
  const [cmsHero, setCmsHero] = useState<any>(null);
  const [cmsSteps, setCmsSteps] = useState<any[]>([]);
  const [cmsContact, setCmsContact] = useState<any>(null);
  const [cmsGalleries, setCmsGalleries] = useState<any[]>([]);

  useEffect(() => {
    if (!confirmationNumber) {
      setError("No confirmation number provided");
      setLoading(false);
      toast({
        title: "❌ Missing Confirmation Number",
        description: "No booking confirmation number was provided. Please check your email or try booking again.",
        variant: "destructive",
        duration: 7000,
      });
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch booking and CMS content in parallel
        const [bookingRes, mainHeroRes, heroRes, stepsRes, contactRes, galleryRes] = await Promise.all([
          fetch(`/api/bookings/${confirmationNumber}`),
          fetch("/api/cms/booking-confirmation-main-hero"),
          fetch("/api/cms/booking-confirmation-hero"),
          fetch("/api/cms/booking-confirmation-steps"),
          fetch("/api/cms/booking-confirmation-contact"),
          fetch("/api/cms/booking-confirmation-gallery"),
        ]);

        if (!bookingRes.ok) {
          throw new Error("Booking not found");
        }

        const bookingData = await bookingRes.json();
        setBooking(bookingData.booking);

        // Load CMS content (non-blocking)
        if (mainHeroRes.ok) {
          const mainHeroData = await mainHeroRes.json();
          setCmsMainHero(mainHeroData.section);
        }

        if (heroRes.ok) {
          const heroData = await heroRes.json();
          setCmsHero(heroData.section);
        }

        if (stepsRes.ok) {
          const stepsData = await stepsRes.json();
          setCmsSteps(stepsData.steps || []);
        }

        if (contactRes.ok) {
          const contactData = await contactRes.json();
          setCmsContact(contactData.section);
        }

        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setCmsGalleries(galleryData.galleries || []);
        }
      } catch (err) {
        const errorMessage = "Unable to retrieve booking details";
        setError(errorMessage);
        toast({
          title: "❌ Booking Not Found",
          description: `${errorMessage}. Please check your confirmation number or contact support for assistance.`,
          variant: "destructive",
          duration: 7000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [confirmationNumber, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {error === "No confirmation number provided"
                    ? "No Confirmation Number"
                    : "Booking Not Found"}
                </h2>
                <p className="text-muted-foreground">
                  {error === "No confirmation number provided"
                    ? "It looks like you navigated to this page directly. You should receive a booking confirmation email with a link to view your booking details."
                    : "We couldn't find a booking with this confirmation number. Please check your email for the correct link or contact our support team."}
                </p>
              </div>

              {confirmationNumber && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Confirmation Number Searched:</p>
                  <p className="font-mono font-semibold">{confirmationNumber}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button asChild variant="default" size="lg">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Return Home
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left w-full">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Need Help?
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Check your email for the booking confirmation</li>
                  <li>• Look in your spam/junk folder</li>
                  <li>• Contact us at {cmsContact?.email || "info@foxadventures.com"}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Important Notice */}
      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-900/20 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold text-amber-900 dark:text-amber-100">Important</p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {cmsHero?.importantNotice || "Your reservation will be confirmed once we receive and verify your payment. Please complete the payment within 48 hours to secure your booking at the current price."}
              </p>
              {cmsHero?.paymentDeadline && (
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Payment deadline:</strong> {cmsHero.paymentDeadline}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmation Details</CardTitle>
          <CardDescription>Please save this confirmation number for your records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Confirmation Number</p>
            <p className="text-2xl font-bold text-primary">{booking.confirmationNumber}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-semibold">{booking.firstName} {booking.lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-semibold">{booking.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Travel Dates</p>
              <p className="font-semibold">
                {new Date(booking.travelDateFrom).toLocaleDateString()} - {new Date(booking.travelDateTo).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Travelers</p>
              <p className="font-semibold">{booking.numberOfTravelers} {booking.numberOfTravelers === 1 ? "Person" : "People"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-semibold text-lg text-primary">${Number(booking.totalPrice).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            What Happens Next
          </CardTitle>
          <CardDescription>
            Follow these simple steps to complete your booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {cmsSteps.length > 0 ? (
              cmsSteps.map((step, index) => (
                <div key={step.id}>
                  {index > 0 && <Separator />}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{step.stepNumber}</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-semibold text-base mb-2">{step.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {step.description}
                      </p>
                      {step.extraInfo && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {step.extraInfo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Fallback content if no CMS steps configured */
              <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-base">Check Your Email</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  We've sent a confirmation email with detailed payment instructions to:
                </p>
                <p className="text-sm font-medium bg-muted px-3 py-2 rounded inline-block">
                  {booking.email}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Note:</strong> Check your spam/junk folder if you don't see it in your
                  inbox within 5 minutes.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-base">Make Payment</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete the bank transfer using the details provided in your email:
                </p>
                <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Due:</span>
                    <span className="font-bold text-primary text-lg">
                      ${Number(booking.totalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Deadline:</span>
                    <span className="font-semibold">
                      {new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Important:</strong> Payment must be completed within 48 hours to
                  guarantee availability.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-base">Send Payment Confirmation</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  After making the transfer, send us the payment reference number via:
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="mailto:info@nambisafaris.com"
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email: info@nambisafaris.com
                  </a>
                  <a
                    href="https://wa.me/256123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    WhatsApp: +256 123 456 789
                  </a>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">4</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-base">Booking Confirmed</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Once we verify your payment (usually within 2-4 hours), you'll receive:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Final booking confirmation email
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Detailed safari itinerary
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Packing list and preparation guide
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Contact details for your safari guide
                  </li>
                </ul>
              </div>
            </div>
          </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {cmsGalleries.length > 0 && (
        <div className="space-y-8">
          {cmsGalleries.map((gallery) => (
            <Card key={gallery.id}>
              <CardHeader>
                <CardTitle>{gallery.title}</CardTitle>
                {gallery.description && (
                  <CardDescription>{gallery.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.images.map((img: string, idx: number) => (
                    <div key={idx} className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={img}
                        alt={`${gallery.title} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {cmsContact?.sectionTitle || "Need Assistance?"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {cmsContact?.description || "Our team is here to help with any questions about your booking"}
            </p>
            <div className="space-y-3">
              <a
                href={`mailto:${cmsContact?.email || "info@nambisafaris.com"}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-xs text-muted-foreground">{cmsContact?.email || "info@nambisafaris.com"}</p>
                </div>
              </a>
              <a
                href={`tel:${cmsContact?.phone || "+256123456789"}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-xs text-muted-foreground">{cmsContact?.phone || "+256 123 456 789"}</p>
                </div>
              </a>
              {cmsContact?.whatsapp && (
                <a
                  href={`https://wa.me/${cmsContact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">{cmsContact.whatsapp}</p>
                  </div>
                </a>
              )}
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Response time: {cmsContact?.responseTime || "Within 2-4 hours"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Your Booking is Secure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Licensed and registered with Uganda Tourism Board
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Full refund if cancelled 30+ days before departure
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                24/7 support during your safari adventure
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                All personal information securely encrypted
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild size="lg" className="flex-1">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/packages">
            <Calendar className="mr-2 h-4 w-4" />
            Browse More Safaris
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/contact">
            <Mail className="mr-2 h-4 w-4" />
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section with Solid Green Background */}
      <section className="bg-green-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto">
            Your safari adventure is one step closer. Check your email for booking details.
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
          <BookingConfirmationContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
