"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { PageHero } from "@/components/page-hero";
import { CustomPackageContentModal } from "@/components/cms/custom-package-content-modal";
import { CustomPackageHeroModal } from "@/components/cms/custom-package-hero-modal";

interface CustomPackageHeroData {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

interface CustomPackageContentData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

export default function CMSCustomPackagePage() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Section data
  const [heroSection, setHeroSection] = useState<CustomPackageHeroData | null>(null);
  const [contentSection, setContentSection] = useState<CustomPackageContentData | null>(null);

  // Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);

  // Fetch sections
  const fetchSections = async () => {
    try {
      setLoading(true);
      const [heroRes, contentRes] = await Promise.all([
        fetch("/api/cms/custom-package-hero?mode=cms"),
        fetch("/api/cms/custom-package-content?mode=cms"),
      ]);

      if (heroRes.ok) {
        const heroData = await heroRes.json();
        setHeroSection(heroData.section);
      }

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContentSection(contentData.section);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast({
        title: "❌ Error",
        description: "Failed to load page content. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Save handlers
  const handleSaveHero = async (data: CustomPackageHeroData, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/custom-package-hero", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: data.image,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          publish,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save hero section");
      }

      const result = await response.json();
      setHeroSection(result.section);

      toast({
        title: "✅ Success",
        description: publish
          ? "Hero section published successfully!"
          : "Hero section saved as draft!",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast({
        title: "❌ Error",
        description: "Failed to save hero section. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  const handleSaveContent = async (data: CustomPackageContentData, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/custom-package-content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          publish,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content section");
      }

      const result = await response.json();
      setContentSection(result.section);

      toast({
        title: "✅ Success",
        description: publish
          ? "Content section published successfully!"
          : "Content section saved as draft!",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving content section:", error);
      toast({
        title: "❌ Error",
        description: "Failed to save content section. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CMS Header */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Custom Package Page Editor</h1>
            <p className="text-sm text-muted-foreground">
              Click any section to edit. Use "Save & Publish" in the modal to make changes live.
            </p>
          </div>
          <Button onClick={() => router.push("/cms")}>← Back to CMS</Button>
        </div>
      </div>

      {/* Custom Package Page Preview with Inline Editing */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="bg-background rounded-lg shadow-sm overflow-hidden">
          {/* Hero Section - Editable */}
          <EditableWrapper onEdit={() => setHeroModalOpen(true)} label="Hero Section">
            <Suspense
              fallback={
                <div className="h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] w-full bg-muted animate-pulse" />
              }
            >
              <PageHero
                slides={
                  heroSection
                    ? [
                        {
                          image: heroSection.image,
                          title: heroSection.title,
                          subtitle: heroSection.subtitle,
                          description: heroSection.description,
                        },
                      ]
                    : []
                }
                showCounter={false}
                showDots={false}
                autoPlay={false}
              />
            </Suspense>
          </EditableWrapper>

          {/* Content Section - Editable */}
          <EditableWrapper onEdit={() => setContentModalOpen(true)} label="Page Content">
            <section className="pt-32 pb-20 container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="font-inter text-4xl md:text-5xl font-bold mb-4">
                    {contentSection?.title || "Build Your Custom Safari Package"}
                  </h1>
                  {contentSection?.subtitle && (
                    <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                      {contentSection.subtitle}
                    </h2>
                  )}
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {contentSection?.description ||
                      "Select the destinations you want to visit, customize the duration, choose your preferred accommodations, and let our expert team create your perfect safari experience."}
                  </p>
                </div>
              </div>
            </section>
          </EditableWrapper>

          {/* Destination Selection - Not editable (functional component) */}
          <div className="relative bg-muted/20">
            <section className="py-16 container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                  Choose Your Destinations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Placeholder cards */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6">
                      <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                      <h3 className="font-semibold mb-2">Destination {i + 1}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Experience the beauty of Uganda's wildlife and landscapes.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">From $1,200</span>
                        <span className="text-sm text-muted-foreground">3-5 days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center pointer-events-none">
              <Badge variant="secondary">Destination Selection (Functional - Not Editable)</Badge>
            </div>
          </div>

          {/* Form Section - Not editable (functional component) */}
          <div className="relative bg-background">
            <section className="py-16 container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-center mb-8">
                    Customize Your Package
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Package Name</label>
                      <input className="w-full p-3 border rounded-lg" placeholder="My Custom Safari" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Number of Travelers</label>
                      <input className="w-full p-3 border rounded-lg" placeholder="2" type="number" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Travel Date</label>
                      <input className="w-full p-3 border rounded-lg" type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Budget Range</label>
                      <select className="w-full p-3 border rounded-lg">
                        <option>$1,000 - $3,000</option>
                        <option>$3,000 - $5,000</option>
                        <option>$5,000+</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="text-sm font-medium">Special Requirements</label>
                    <textarea
                      className="w-full p-3 border rounded-lg mt-2"
                      rows={4}
                      placeholder="Tell us about your preferences, dietary requirements, accessibility needs, etc."
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90">
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center pointer-events-none">
              <Badge variant="secondary">Package Form (Functional - Not Editable)</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomPackageHeroModal
        open={heroModalOpen}
        onClose={() => setHeroModalOpen(false)}
        onSave={handleSaveHero}
        initialData={heroSection}
      />

      <CustomPackageContentModal
        open={contentModalOpen}
        onClose={() => setContentModalOpen(false)}
        onSave={handleSaveContent}
        initialData={contentSection}
      />
    </div>
  );
}
