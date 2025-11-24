"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { PageHero } from "@/components/page-hero";
import { DestinationsGrid } from "@/components/destinations-grid";
import { DestinationsCTASection } from "@/components/destinations-cta-section";
import { DestinationsHeroModal } from "@/components/cms/destinations-hero-modal";
import { DestinationsCTAModal } from "@/components/cms/destinations-cta-modal";
import { DestinationEditModal } from "@/components/cms/destination-edit-modal";

interface DestinationsHeroData {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

interface DestinationsCTAData {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  status: string;
}

export default function CMSDestinationsPage() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Section data
  const [heroSection, setHeroSection] = useState<DestinationsHeroData | null>(null);
  const [ctaSection, setCTASection] = useState<DestinationsCTAData | null>(null);

  // Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [ctaModalOpen, setCTAModalOpen] = useState(false);
  const [createDestinationModalOpen, setCreateDestinationModalOpen] = useState(false);
  const [editDestinationId, setEditDestinationId] = useState<string | number | null>(null);
  const [editDestinationData, setEditDestinationData] = useState<any>(null);
  const [loadingDestination, setLoadingDestination] = useState(false);

  // Fetch sections
  const fetchSections = async () => {
    try {
      setLoading(true);

      const [heroRes, ctaRes] = await Promise.all([
        fetch("/api/cms/destinations-hero?mode=cms"),
        fetch("/api/cms/destinations-cta?mode=cms"),
      ]);

      if (heroRes.ok) {
        const heroData = await heroRes.json();
        setHeroSection(heroData.section);
      }

      if (ctaRes.ok) {
        const ctaData = await ctaRes.json();
        setCTASection(ctaData.section);
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
  }, []);

  const handleSaveHero = async (data: DestinationsHeroData, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/destinations-hero", {
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
          ? "Hero section published successfully"
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

  const handleSaveCTA = async (data: DestinationsCTAData, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/destinations-cta", {
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
          ? "CTA section published successfully"
          : "CTA section saved as draft",
      });

      setCTASection(result.section);
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

  const handleDestinationClick = async (id: string | number) => {
    setLoadingDestination(true);
    setEditDestinationId(id);
    try {
      const response = await fetch(`/api/cms/destinations/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEditDestinationData(data.destination);
      } else {
        toast({
          title: "Error",
          description: "Failed to load destination",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading destination:", error);
      toast({
        title: "Error",
        description: "Failed to load destination",
        variant: "destructive",
      });
    } finally {
      setLoadingDestination(false);
    }
  };

  const handleSaveDestination = async (data: any) => {
    try {
      const url = editDestinationId
        ? `/api/cms/destinations/${editDestinationId}`
        : "/api/cms/destinations";
      const method = editDestinationId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }

      toast({
        title: "Success",
        description: editDestinationId
          ? "Destination updated successfully"
          : "Destination created successfully",
      });

      setCreateDestinationModalOpen(false);
      setEditDestinationId(null);
      setEditDestinationData(null);
      router.refresh();
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

  const handleDeleteDestination = async (id: string | number) => {
    try {
      const response = await fetch(`/api/cms/destinations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete");
      }

      toast({
        title: "Success",
        description: "Destination deleted successfully",
      });

      router.refresh();
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const heroSlides = heroSection
    ? [
        {
          image: heroSection.image,
          title: heroSection.title,
          subtitle: heroSection.subtitle,
          description: heroSection.description,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* CMS Header */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Destinations Page</h1>
            <p className="text-sm text-muted-foreground">
              Edit page sections and manage destinations. Click sections to edit.
            </p>
          </div>
          <Button
            onClick={() => setCreateDestinationModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Destination
          </Button>
        </div>
      </div>

      {/* Page Preview with Inline Editing */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="bg-background rounded-lg shadow-sm overflow-hidden">
          {/* Hero Section - Editable */}
          <EditableWrapper onEdit={() => setHeroModalOpen(true)} label="Hero Section">
            {heroSection ? (
              <PageHero
                slides={heroSlides}
                showCounter={false}
                showDots={false}
                autoPlay={false}
              />
            ) : (
              <div className="h-96 bg-muted/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
          </EditableWrapper>

          {/* Destinations Grid - Editable items */}
          <EditableWrapper
            onEdit={() => {}}
            label="Destinations"
            hideEditButton
          >
            <DestinationsGrid
              editable
              onDestinationClick={handleDestinationClick}
              onDestinationDelete={handleDeleteDestination}
            />
          </EditableWrapper>

          {/* CTA Section - Editable */}
          <EditableWrapper onEdit={() => setCTAModalOpen(true)} label="CTA Section">
            {ctaSection ? (
              <DestinationsCTASection data={ctaSection} />
            ) : (
              <div className="py-20 bg-muted/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
          </EditableWrapper>
        </div>
      </div>

      {/* Edit Modals */}
      {heroSection && (
        <DestinationsHeroModal
          open={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          onSave={handleSaveHero}
          initialData={heroSection}
        />
      )}

      {ctaSection && (
        <DestinationsCTAModal
          open={ctaModalOpen}
          onClose={() => setCTAModalOpen(false)}
          onSave={handleSaveCTA}
          initialData={ctaSection}
        />
      )}

      {/* Destination Create/Edit Modal */}
      {(createDestinationModalOpen || editDestinationId !== null) && !loadingDestination && (
        <DestinationEditModal
          open={createDestinationModalOpen || editDestinationId !== null}
          onClose={() => {
            setCreateDestinationModalOpen(false);
            setEditDestinationId(null);
            setEditDestinationData(null);
          }}
          onSave={handleSaveDestination}
          initialData={editDestinationData}
          mode={createDestinationModalOpen ? "create" : "edit"}
        />
      )}
    </div>
  );
}
