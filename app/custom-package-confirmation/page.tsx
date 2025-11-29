"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Home,
  Mail,
  Phone,
  FileText,
  MessageCircle,
  Shield,
  Info,
  AlertCircle,
  Clock,
  Package
} from "lucide-react";

function CustomPackageConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("packageId");
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!packageId) {
      setError("No package ID provided");
      setLoading(false);
      return;
    }

    // For now, we'll just show a generic confirmation since we don't have package details API
    // In a real implementation, you'd fetch package details from an API
    setPackageDetails({
      id: packageId,
      name: "Custom Safari Package",
      submittedAt: new Date().toISOString(),
    });
    setLoading(false);
  }, [packageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !packageDetails) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Request Not Found</h2>
                <p className="text-muted-foreground">
                  We couldn't find details for this custom package request. Please contact our support team for assistance.
                </p>
              </div>

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
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold text-green-900 dark:text-green-100 text-lg">Custom Package Request Submitted!</p>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your personalized safari package request has been received and is now under review by our expert team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Request Details
          </CardTitle>
          <CardDescription>Your custom package request has been logged for processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Request ID</p>
            <p className="text-2xl font-bold text-primary font-mono tracking-wider">{packageDetails.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Package Type</p>
              <p className="font-semibold">{packageDetails.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-semibold">
                {new Date(packageDetails.submittedAt).toLocaleDateString()} at {new Date(packageDetails.submittedAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">Status</p>
              <Badge variant="secondary" className="mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Under Review
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            What Happens Next
          </CardTitle>
          <CardDescription>
            Follow these simple steps while we prepare your personalized quote
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
                <p className="text-sm text-muted-foreground mb-3">
                  We've sent a confirmation email with your request details. Please check your inbox (and spam folder) for:
                </p>
                <div className="bg-muted/50 border border-border rounded-lg p-4 mb-3">
                  <p className="text-sm font-medium text-center">Confirmation of your custom package request</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> If you don't see the email within 5 minutes, check your spam/junk folder.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-base">Review Process</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Our safari experts are reviewing your custom package request, including:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Destination feasibility and logistics</li>
                  <li>• Accommodation availability and preferences</li>
                  <li>• Activity scheduling and guide assignments</li>
                  <li>• Budget optimization and value assessment</li>
                  <li>• Custom itinerary planning</li>
                </ul>
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
                  <p className="font-semibold text-base">Receive Your Quote</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Within 24-48 hours, you'll receive a detailed quote including:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Complete day-by-day itinerary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Detailed pricing breakdown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Accommodation and transport details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Terms and conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Next steps for booking</span>
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
            <CardTitle className="text-lg">
              Need Assistance?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Have questions about your custom package request? We're here to help.
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
                href="https://wa.me/256123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
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
              Why Choose Our Custom Packages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong>Expert Planning:</strong> 15+ years of safari expertise
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong>Local Knowledge:</strong> Authentic experiences with local guides
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong>Competitive Pricing:</strong> Best value for your safari budget
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong>24/7 Support:</strong> Full support throughout your journey
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
            <Package className="mr-2 h-4 w-4" />
            Browse Standard Packages
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

export default function CustomPackageConfirmationPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Request Received!
          </h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto">
            Your custom safari package request is being reviewed by our experts. Check your email for confirmation details.
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
          <CustomPackageConfirmationContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
