"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
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
  Calendar
} from "lucide-react";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const confirmationNumber = searchParams.get("ref");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!confirmationNumber) {
      setError("No confirmation number provided");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${confirmationNumber}`);
        if (!response.ok) {
          throw new Error("Booking not found");
        }
        const data = await response.json();
        setBooking(data.booking);
      } catch (err) {
        setError("Unable to retrieve booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [confirmationNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-destructive/10 text-destructive rounded-lg p-6 mb-6">
          <p className="font-semibold">{error || "Booking not found"}</p>
        </div>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Message */}
      <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border-2 border-primary/20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
          <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
        </div>
        <Badge className="mb-4" variant="secondary">
          Booking Received
        </Badge>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
          Your Safari Adventure Awaits!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Thank you for choosing Nambi Uganda Safaris. Your booking request has been
          successfully received, and we're excited to help you create unforgettable memories!
        </p>
      </div>

      {/* Important Notice */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold text-amber-900">Your Booking is Pending Payment</p>
              <p className="text-sm text-amber-800">
                Your reservation will be confirmed once we receive and verify your payment.
                Please complete the payment within <strong>48 hours</strong> to secure your
                booking at the current price.
              </p>
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
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Assistance?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our team is here to help with any questions about your booking
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@nambisafaris.com"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-xs text-muted-foreground">info@nambisafaris.com</p>
                </div>
              </a>
              <a
                href="tel:+256123456789"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-xs text-muted-foreground">+256 123 456 789</p>
                </div>
              </a>
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Response time: Within 2-4 hours</span>
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
    <main className="min-h-screen bg-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
