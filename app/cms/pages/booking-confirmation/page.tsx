"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { CMSLoader, CMSSectionLoader } from "@/components/cms/cms-loader";
import { BookingConfirmationHeroModal } from "@/components/cms/booking-confirmation-hero-modal";
import { BookingConfirmationStepsModal } from "@/components/cms/booking-confirmation-steps-modal";
import { BookingConfirmationContactModal } from "@/components/cms/booking-confirmation-contact-modal";
import { BookingConfirmationGalleryModal } from "@/components/cms/booking-confirmation-gallery-modal";
import { Card } from "@/components/ui/card";
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

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  extraInfo?: string | null;
  displayOrder: number;
  active: boolean;
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

interface Gallery {
  id: string;
  title: string;
  description?: string | null;
  images: string[];
  displayOrder: number;
  active: boolean;
}

export default function CMSBookingConfirmationPageInline() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Section data
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [contactSection, setContactSection] = useState<ContactSection | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  // Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  // Fetch all sections
  const fetchSections = async () => {
    try {
      setLoading(true);

      const [heroRes, stepsRes, contactRes, galleryRes] = await Promise.all([
        fetch("/api/cms/booking-confirmation-hero?mode=cms"),
        fetch("/api/cms/booking-confirmation-steps?mode=cms"),
        fetch("/api/cms/booking-confirmation-contact?mode=cms"),
        fetch("/api/cms/booking-confirmation-gallery?mode=cms"),
      ]);

      if (heroRes.ok) {
        const data = await heroRes.json();
        setHeroSection(data.section);
      }

      if (stepsRes.ok) {
        const data = await stepsRes.json();
        setSteps(data.steps || []);
      }

      if (contactRes.ok) {
        const data = await contactRes.json();
        setContactSection(data.section);
      }

      if (galleryRes.ok) {
        const data = await galleryRes.json();
        setGalleries(data.galleries || []);
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

  const activeSteps = steps.filter((s) => s.active);
  const activeGalleries = galleries.filter((g) => g.active);

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

          {/* Steps Section - Editable */}
          <EditableWrapper onEdit={() => setStepsModalOpen(true)} label="Next Steps">
            <section className="py-16 container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">What Happens Next?</h2>
                {activeSteps.length > 0 ? (
                  <div className="space-y-6">
                    {activeSteps.map((step) => (
                      <Card key={step.id} className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex-shrink-0">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground mb-2">{step.description}</p>
                            {step.extraInfo && (
                              <p className="text-sm text-muted-foreground italic">{step.extraInfo}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No steps configured. Click to add steps.
                  </div>
                )}
              </div>
            </section>
          </EditableWrapper>

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

          {/* Gallery Section - Editable */}
          <EditableWrapper onEdit={() => setGalleryModalOpen(true)} label="Image Galleries">
            <section className="py-16 container mx-auto px-4">
              {activeGalleries.length > 0 ? (
                <div className="space-y-12">
                  {activeGalleries.map((gallery) => (
                    <div key={gallery.id}>
                      <h3 className="text-2xl font-bold mb-2">{gallery.title}</h3>
                      {gallery.description && (
                        <p className="text-muted-foreground mb-6">{gallery.description}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {gallery.images.map((img, idx) => (
                          <div key={idx} className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={img}
                              alt={`${gallery.title} ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No galleries configured. Click to add galleries.
                </div>
              )}
            </section>
          </EditableWrapper>
        </div>
      </div>

      {/* Edit Modals */}
      {heroSection && (
        <BookingConfirmationHeroModal
          open={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          onSave={handleSaveHero}
          initialData={heroSection}
        />
      )}

      <BookingConfirmationStepsModal
        open={stepsModalOpen}
        onClose={() => setStepsModalOpen(false)}
        onRefresh={fetchSections}
        initialSteps={steps}
      />

      {contactSection && (
        <BookingConfirmationContactModal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          onSave={handleSaveContact}
          initialData={contactSection}
        />
      )}

      <BookingConfirmationGalleryModal
        open={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        onRefresh={fetchSections}
        initialGalleries={galleries}
      />
    </div>
  );
}
