"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { CMSLoader, CMSSectionLoader } from "@/components/cms/cms-loader";
import { BookingConfirmationMainHeroModal } from "@/components/cms/booking-confirmation-main-hero-modal";
import { BookingConfirmationHeroModal } from "@/components/cms/booking-confirmation-hero-modal";
import { BookingConfirmationNextStepsModal } from "@/components/cms/booking-confirmation-next-steps-modal";
import { BookingConfirmationContactModal } from "@/components/cms/booking-confirmation-contact-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, CreditCard, Mail, Phone } from "lucide-react";

interface HeroSection {
  id: string;
  title: string;
  description: string;
  badge: string;
  importantNotice: string;
  paymentDeadline: string;
  status: string;
}


interface ContactSection {
  id: string;
  sectionTitle: string;
  description: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  responseTime: string;
  status: string;
}


export default function CMSBookingConfirmationPageInline() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Section data
  const [mainHeroSection, setMainHeroSection] = useState<any>(null);
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [nextStepsSection, setNextStepsSection] = useState<any>(null);
  const [contactSection, setContactSection] = useState<ContactSection | null>(null);

  // Modal states
  const [mainHeroModalOpen, setMainHeroModalOpen] = useState(false);
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [nextStepsModalOpen, setNextStepsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Fetch all sections
  const fetchSections = async () => {
    try {
      setLoading(true);

      const [mainHeroRes, heroRes, nextStepsRes, contactRes] = await Promise.all([
        fetch("/api/cms/booking-confirmation-main-hero?mode=cms"),
        fetch("/api/cms/booking-confirmation-hero?mode=cms"),
        fetch("/api/cms/booking-confirmation-next-steps?mode=cms"),
        fetch("/api/cms/booking-confirmation-contact?mode=cms"),
      ]);

      if (mainHeroRes.ok) {
        const data = await mainHeroRes.json();
        setMainHeroSection(data.section);
      }

      if (heroRes.ok) {
        const data = await heroRes.json();
        setHeroSection(data.section);
      }

      if (nextStepsRes.ok) {
        const data = await nextStepsRes.json();
        setNextStepsSection(data.section);
      }

      if (contactRes.ok) {
        const data = await contactRes.json();
        setContactSection(data.section);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast({
        title: "Error",
        description: "Failed to load page content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveHero = async (data: HeroSection, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/booking-confirmation-hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, publish }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: publish
          ? "Hero section published successfully. Vercel build triggered."
          : "Hero section saved as draft",
      });

      setHeroSection(result.section);
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSaveMainHero = async (data: any, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/booking-confirmation-main-hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, publish }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: publish
          ? "Main hero section published successfully. Vercel build triggered."
          : "Main hero section saved as draft",
      });

      setMainHeroSection(result.section);
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save main hero section",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSaveNextSteps = async (data: any, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/booking-confirmation-next-steps", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, publish }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: publish
          ? "Next steps section published successfully. Vercel build triggered."
          : "Next steps section saved as draft",
      });

      setNextStepsSection(result.section);
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save next steps section",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSaveContact = async (data: ContactSection, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/booking-confirmation-contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, publish }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: publish
          ? "Contact section published successfully. Vercel build triggered."
          : "Contact section saved as draft",
      });

      setContactSection(result.section);
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (loading) {
    return <CMSLoader />;
  }


  return (
    <div className="space-y-6">
      {/* CMS Header */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Booking Confirmation Page Editor</h1>
            <p className="text-sm text-muted-foreground">
              Click any section to edit. Use "Save & Publish" in the modal to make changes live.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Page Preview with Inline Editing */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="bg-background rounded-lg shadow-sm overflow-hidden">
          {/* Main Hero Section - Editable */}
          <EditableWrapper onEdit={() => setMainHeroModalOpen(true)} label="Main Hero Section">
            <section className="bg-green-600 text-white py-16 md:py-24">
              <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {mainHeroSection?.title || "Booking Confirmed!"}
                </h1>
                <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto">
                  {mainHeroSection?.subtitle || "Your safari adventure is one step closer. Check your email for booking details."}
                </p>
              </div>
            </section>
          </EditableWrapper>

          {/* Hero Section - Editable */}
          <EditableWrapper onEdit={() => setHeroModalOpen(true)} label="Hero Section">
            {heroSection ? (
              <div className="bg-gradient-to-br from-primary/10 via-background to-background py-16 px-4">
                <div className="container mx-auto max-w-3xl text-center space-y-6">
                  <Badge className="mx-auto">{heroSection.badge}</Badge>
                  <h1 className="text-4xl font-bold">{heroSection.title}</h1>
                  <p className="text-lg text-muted-foreground">{heroSection.description}</p>
                  <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-left">
                        <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                          Important:
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300">{heroSection.importantNotice}</p>
                        <p className="mt-2 text-yellow-700 dark:text-yellow-300">
                          <strong>Payment deadline:</strong> {heroSection.paymentDeadline}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <CMSSectionLoader />
            )}
          </EditableWrapper>

          {/* Next Steps Section - Editable */}
          <EditableWrapper onEdit={() => setNextStepsModalOpen(true)} label="What Happens Next">
            <section className="py-16 container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">{nextStepsSection?.title || "What Happens Next"}</h2>
                <div className="space-y-6">
                  {/* Preview of next steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{nextStepsSection?.emailStep?.title || "Check Your Email"}</p>
                        <p className="text-sm text-muted-foreground">{nextStepsSection?.emailStep?.description || "We've sent a confirmation email..."}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{nextStepsSection?.paymentStep?.title || "Make Payment"}</p>
                        <p className="text-sm text-muted-foreground">{nextStepsSection?.paymentStep?.description || "Complete the bank transfer..."}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{nextStepsSection?.contactStep?.title || "Send Payment Confirmation"}</p>
                        <p className="text-sm text-muted-foreground">{nextStepsSection?.contactStep?.description || "After making the transfer..."}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">4</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{nextStepsSection?.confirmStep?.title || "Booking Confirmed"}</p>
                        <p className="text-sm text-muted-foreground">{nextStepsSection?.confirmStep?.description || "Once we verify your payment..."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </EditableWrapper>

          {/* Confirmation Details - Non-editable preview */}
          <div className="bg-muted/30 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <div className="text-center text-muted-foreground mb-4">
              <p className="text-sm font-medium">Confirmation Details Section</p>
              <p className="text-xs">This section displays dynamic booking information and is not editable</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Confirmation Details</CardTitle>
                <CardDescription>Please save this confirmation number for your records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Confirmation Number</p>
                  <p className="text-2xl font-bold text-primary font-mono">[CONFIRMATION-NUMBER]</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-semibold">[CUSTOMER-NAME]</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold">[CUSTOMER-EMAIL]</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Travel Dates</p>
                    <p className="font-semibold">[TRAVEL-DATES]</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Travelers</p>
                    <p className="font-semibold">[NUMBER-OF-TRAVELERS]</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-lg text-primary">[TOTAL-PRICE]</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact/Assistance Section - Editable */}
          <EditableWrapper onEdit={() => setContactModalOpen(true)} label="Assistance Section">
            {contactSection ? (
              <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                  <h2 className="text-2xl font-bold mb-4">{contactSection.sectionTitle}</h2>
                  <p className="text-muted-foreground mb-8">{contactSection.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{contactSection.email}</p>
                      </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{contactSection.phone}</p>
                      </div>
                    </Card>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Response time: {contactSection.responseTime}
                  </p>
                </div>
              </section>
            ) : (
              <CMSSectionLoader />
            )}
          </EditableWrapper>

        </div>
      </div>

      {/* Edit Modals */}
      <BookingConfirmationMainHeroModal
        open={mainHeroModalOpen}
        onClose={() => setMainHeroModalOpen(false)}
        onRefresh={fetchSections}
        initialData={mainHeroSection}
      />

      {heroSection && (
        <BookingConfirmationHeroModal
          open={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          onSave={handleSaveHero}
          initialData={heroSection}
        />
      )}

      <BookingConfirmationNextStepsModal
        open={nextStepsModalOpen}
        onClose={() => setNextStepsModalOpen(false)}
        onRefresh={fetchSections}
        initialData={nextStepsSection}
      />

      {contactSection && (
        <BookingConfirmationContactModal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          onSave={handleSaveContact}
          initialData={contactSection}
        />
      )}

    </div>
  );
}
