"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { PageHero } from "@/components/page-hero";
import { PackagesContent } from "@/components/packages-content";
import { PackagesHeroModal } from "@/components/cms/packages-hero-modal";
import { PackageEditModal } from "@/components/cms/package-edit-modal";

interface PackagesHeroData {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

export default function CMSPackagesPage() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Section data
  const [heroSection, setHeroSection] = useState<PackagesHeroData | null>(null);

  // Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [createPackageModalOpen, setCreatePackageModalOpen] = useState(false);
  const [editPackageId, setEditPackageId] = useState<number | null>(null);
  const [editPackageData, setEditPackageData] = useState<any>(null);
  const [loadingPackage, setLoadingPackage] = useState(false);

  // Fetch sections
  const fetchSections = async () => {
    try {
      setLoading(true);
      const heroRes = await fetch("/api/cms/packages-hero?mode=cms");

      if (heroRes.ok) {
        const heroData = await heroRes.json();
        setHeroSection(heroData.section);
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

  const handleSaveHero = async (data: PackagesHeroData, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/packages-hero", {
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

  const handlePackageClick = async (id: number) => {
    setLoadingPackage(true);
    setEditPackageId(id);
    try {
      const response = await fetch(`/api/cms/packages/${id}`);
      if (response.ok) {
        const data = await response.json();
        const packageData = data.package;

        // Ensure itinerary is an array
        if (packageData.itinerary && !Array.isArray(packageData.itinerary)) {
          packageData.itinerary = [];
        }

        // Ensure all array fields are arrays
        packageData.highlights = Array.isArray(packageData.highlights) ? packageData.highlights : [];
        packageData.included = Array.isArray(packageData.included) ? packageData.included : [];
        packageData.excluded = Array.isArray(packageData.excluded) ? packageData.excluded : [];
        packageData.images = Array.isArray(packageData.images) ? packageData.images : [];

        setEditPackageData(packageData);
      } else {
        toast({
          title: "Error",
          description: "Failed to load package",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading package:", error);
      toast({
        title: "Error",
        description: "Failed to load package",
        variant: "destructive",
      });
    } finally {
      setLoadingPackage(false);
    }
  };

  const handleSavePackage = async (data: any) => {
    try {
      const url = editPackageId
        ? `/api/cms/packages/${editPackageId}`
        : "/api/cms/packages";
      const method = editPackageId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || "Failed to save";
        console.error("Save error:", errorData);
        throw new Error(errorMessage);
      }

      toast({
        title: "Success",
        description: editPackageId
          ? "Package updated successfully"
          : "Package created successfully",
      });

      setCreatePackageModalOpen(false);
      setEditPackageId(null);
      setEditPackageData(null);
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

  const handleDeletePackage = async (id: number) => {
    try {
      const response = await fetch(`/api/cms/packages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete");
      }

      toast({
        title: "Success",
        description: "Package deleted successfully",
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
            <h1 className="text-2xl font-bold">Packages Page</h1>
            <p className="text-sm text-muted-foreground">
              Edit page sections and manage safari packages. Click sections to edit.
            </p>
          </div>
          <Button
            onClick={() => setCreatePackageModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Package
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

          {/* Packages Listing - Editable items */}
          <EditableWrapper
            onEdit={() => {}}
            label="Safari Packages"
            hideEditButton
          >
            <PackagesContent
              editable
              onPackageClick={handlePackageClick}
              onPackageDelete={handleDeletePackage}
            />
          </EditableWrapper>
        </div>
      </div>

      {/* Edit Modals */}
      {heroSection && (
        <PackagesHeroModal
          open={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          onSave={handleSaveHero}
          initialData={heroSection}
        />
      )}

      {/* Package Create/Edit Modal */}
      {(createPackageModalOpen || editPackageId !== null) && !loadingPackage && (
        <PackageEditModal
          open={createPackageModalOpen || editPackageId !== null}
          onClose={() => {
            setCreatePackageModalOpen(false);
            setEditPackageId(null);
            setEditPackageData(null);
          }}
          onSave={handleSavePackage}
          initialData={editPackageData}
          mode={createPackageModalOpen ? "create" : "edit"}
        />
      )}
    </div>
  );
}
