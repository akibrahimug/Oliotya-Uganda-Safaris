"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { CMSLoader, CMSSectionLoader } from "@/components/cms/cms-loader";
import { ContactHeroSection } from "@/components/contact-hero-section";
import { ContactFAQSection } from "@/components/contact-faq-section";
import { ContactResourcesSection } from "@/components/contact-resources-section";
import { ContactHeroModal } from "@/components/cms/contact-hero-modal";
import { ContactInfoModal } from "@/components/cms/contact-info-modal";
import { ContactFAQModal } from "@/components/cms/contact-faq-modal";
import { ContactResourcesModal } from "@/components/cms/contact-resources-modal";

interface HeroSection {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

interface InfoSection {
  id: string;
  email: string;
  phone: string;
  whatsapp: string;
  office: string;
  businessHours: {
    monFri: string;
    sat: string;
    sun: string;
  };
  quickResponse: string;
  status: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  active: boolean;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  linkText: string;
  linkUrl: string;
  isExternal: boolean;
  displayOrder: number;
  active: boolean;
}

export default function CMSContactPageInline() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Section data
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [infoSection, setInfoSection] = useState<InfoSection | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [resourcesModalOpen, setResourcesModalOpen] = useState(false);

  // Fetch all sections
  const fetchSections = async () => {
    try {
      setLoading(true);

      const [heroRes, infoRes, faqsRes, resourcesRes] = await Promise.all([
        fetch("/api/cms/contact-hero?mode=cms"),
        fetch("/api/cms/contact-info?mode=cms"),
        fetch("/api/cms/contact-faqs?mode=cms"),
        fetch("/api/cms/contact-resources?mode=cms"),
      ]);

      if (heroRes.ok) {
        const data = await heroRes.json();
        setHeroSection(data.section);
      }

      if (infoRes.ok) {
        const data = await infoRes.json();
        setInfoSection(data.section);
      }

      if (faqsRes.ok) {
        const data = await faqsRes.json();
        setFaqs(data.faqs || []);
      }

      if (resourcesRes.ok) {
        const data = await resourcesRes.json();
        setResources(data.resources || []);
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
      const response = await fetch("/api/cms/contact-hero", {
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

  const handleSaveInfo = async (data: InfoSection, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/contact-info", {
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
          ? "Contact info published successfully. Vercel build triggered."
          : "Contact info saved as draft",
      });

      setInfoSection(result.section);
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
            <h1 className="text-2xl font-bold">Contact Page Editor</h1>
            <p className="text-sm text-muted-foreground">
              Click any section to edit. Use "Save & Publish" in the modal to make changes live.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Page Preview with Inline Editing */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="bg-background rounded-lg shadow-sm overflow-hidden">
          {/* Hero Section - Editable */}
          <EditableWrapper onEdit={() => setHeroModalOpen(true)} label="Page Hero">
            {heroSection ? (
              <ContactHeroSection data={heroSection} />
            ) : (
              <CMSSectionLoader />
            )}
          </EditableWrapper>

          {/* Contact Form & Info Section */}
          <section className="py-16 container mx-auto px-4 lg:px-8">
            <EditableWrapper onEdit={() => setInfoModalOpen(true)} label="Contact Form & Info Section">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Info Preview */}
                <div className="lg:col-span-1 space-y-6">
                  {infoSection ? (
                    <div className="bg-background border rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Contact Information</h3>
                      <div className="text-sm space-y-2 text-muted-foreground">
                        <p><strong>Email:</strong> {infoSection.email}</p>
                        <p><strong>Phone:</strong> {infoSection.phone}</p>
                        <p><strong>WhatsApp:</strong> {infoSection.whatsapp}</p>
                        <p><strong>Office:</strong> {infoSection.office}</p>
                        <div className="pt-2 border-t">
                          <p className="font-semibold text-foreground mb-1">Business Hours:</p>
                          <p>{infoSection.businessHours.monFri}</p>
                          <p>{infoSection.businessHours.sat}</p>
                          <p>{infoSection.businessHours.sun}</p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="font-semibold text-foreground mb-1">Quick Response:</p>
                          <p>{infoSection.quickResponse}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <CMSSectionLoader />
                  )}
                </div>

                {/* Contact Form - Not Editable (Functional) */}
                <div className="lg:col-span-2">
                  <div className="bg-muted/30 rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Contact Form
                      <br />
                      (Functional - not editable in CMS)
                      <br />
                      <span className="text-xs mt-2 block">
                        Contact info from the sidebar is displayed alongside the form on the live site
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </EditableWrapper>
          </section>

          {/* FAQ Section - Editable */}
          <EditableWrapper onEdit={() => setFaqModalOpen(true)} label="FAQs">
            <ContactFAQSection data={faqs.filter(f => f.active)} />
          </EditableWrapper>

          {/* Resources Section - Editable */}
          <EditableWrapper onEdit={() => setResourcesModalOpen(true)} label="Resources">
            <ContactResourcesSection data={resources.filter(r => r.active)} />
          </EditableWrapper>
        </div>
      </div>

      {/* Edit Modals */}
      {heroSection && (
        <ContactHeroModal
          open={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          onSave={handleSaveHero}
          initialData={heroSection}
        />
      )}

      {infoSection && (
        <ContactInfoModal
          open={infoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          onSave={handleSaveInfo}
          initialData={infoSection}
        />
      )}

      <ContactFAQModal
        open={faqModalOpen}
        onClose={() => setFaqModalOpen(false)}
        onRefresh={fetchSections}
        initialFAQs={faqs}
      />

      <ContactResourcesModal
        open={resourcesModalOpen}
        onClose={() => setResourcesModalOpen(false)}
        onRefresh={fetchSections}
        initialResources={resources}
      />
    </div>
  );
}
