"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Rocket, AlertCircle, Loader2 } from "lucide-react";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { HeroCarousel } from "@/components/hero-carousel";
import { SearchForm } from "@/components/search-form";
import { ExperienceSection } from "@/components/experience-section";
import { TourGuideSection } from "@/components/tour-guide-section";
import { VideoSection } from "@/components/video-section";
import { PopularPlaces } from "@/components/popular-places";
import { ExploreDestinations } from "@/components/explore-destinations";
import { HeroSlidesManagerModal } from "@/components/cms/hero-slides-manager-modal";
import { ExperienceSectionModal } from "@/components/cms/experience-section-modal";
import { TourGuideSectionModal } from "@/components/cms/tour-guide-section-modal";
import { VideoSectionModal } from "@/components/cms/video-section-modal";

interface ExperienceSectionData {
  id: string;
  heading: string;
  title: string;
  description: string;
  image: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  badgeText: string;
  backgroundText: string;
  status: string;
}

interface TourGuideSectionData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mapImage: string;
  buttonText: string;
  status: string;
}

interface VideoSectionData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  status: string;
}

export default function CMSHomePageInline() {
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Section data
  const [experienceSection, setExperienceSection] = useState<ExperienceSectionData | null>(null);
  const [tourGuideSection, setTourGuideSection] = useState<TourGuideSectionData | null>(null);
  const [videoSection, setVideoSection] = useState<VideoSectionData | null>(null);

  // Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [tourGuideModalOpen, setTourGuideModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Fetch all sections
  const fetchSections = async () => {
    try {
      setLoading(true);

      const [expRes, tourRes, vidRes] = await Promise.all([
        fetch("/api/cms/experience-section?mode=cms"),
        fetch("/api/cms/tour-guide-section?mode=cms"),
        fetch("/api/cms/video-section?mode=cms"),
      ]);

      if (expRes.ok) {
        const expData = await expRes.json();
        setExperienceSection(expData.section);
      }

      if (tourRes.ok) {
        const tourData = await tourRes.json();
        setTourGuideSection(tourData.section);
      }

      if (vidRes.ok) {
        const vidData = await vidRes.json();
        setVideoSection(vidData.section);
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

  const handleSaveExperience = async (data: ExperienceSectionData, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/experience-section", {
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
          ? "Experience section published successfully. Vercel build triggered."
          : "Experience section saved as draft",
      });

      // Update local state instead of refetching
      setExperienceSection(result.section);
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

  const handleSaveTourGuide = async (data: TourGuideSectionData, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/tour-guide-section", {
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
          ? "Tour Guide section published successfully. Vercel build triggered."
          : "Tour Guide section saved as draft",
      });

      // Update local state instead of refetching
      setTourGuideSection(result.section);
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

  const handleSaveVideo = async (data: VideoSectionData, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/video-section", {
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
          ? "Video section published successfully. Vercel build triggered."
          : "Video section saved as draft",
      });

      // Update local state instead of refetching
      setVideoSection(result.section);
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
    return (
      <div className="flex items-center justify-center min-h-screen">
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
            <h1 className="text-2xl font-bold">Home Page Editor</h1>
            <p className="text-sm text-muted-foreground">
              Click any section to edit. Use "Save & Publish" in the modal to make changes live.
            </p>
          </div>
        </div>
      </div>

      {/* Landing Page Preview with Inline Editing */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="bg-background rounded-lg shadow-sm overflow-hidden">
          {/* Hero Section - Editable */}
          <EditableWrapper onEdit={() => setHeroModalOpen(true)} label="Hero Carousel">
            <HeroCarousel />
          </EditableWrapper>

          {/* Search Form - Not editable (functional component) */}
          <div className="relative">
            <SearchForm onSearch={() => {}} />
            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center pointer-events-none">
              <Badge variant="secondary">Search Form (Functional - Not Editable)</Badge>
            </div>
          </div>

          {/* Tour Guide Section - Editable */}
          <EditableWrapper onEdit={() => setTourGuideModalOpen(true)} label="Tour Guide">
            {tourGuideSection ? (
              <TourGuideSection data={tourGuideSection} />
            ) : (
              <div className="py-20 bg-muted/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
          </EditableWrapper>

          {/* Video Section - Editable */}
          <EditableWrapper onEdit={() => setVideoModalOpen(true)} label="Video">
            {videoSection ? (
              <VideoSection data={videoSection} />
            ) : (
              <div className="py-20 bg-muted/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
          </EditableWrapper>

          {/* Popular Places - Editable */}
          <EditableWrapper onEdit={() => router.push("/cms/packages")} label="Popular Places">
            <PopularPlaces filters={null} />
          </EditableWrapper>

          {/* Explore Destinations - Editable */}
          <EditableWrapper onEdit={() => router.push("/cms/destinations")} label="Explore Destinations">
            <ExploreDestinations filters={null} />
          </EditableWrapper>

          {/* Experience Section - Editable */}
          <EditableWrapper onEdit={() => setExperienceModalOpen(true)} label="Experience">
            {experienceSection ? (
              <ExperienceSection data={experienceSection} />
            ) : (
              <div className="py-20 bg-muted/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
          </EditableWrapper>
        </div>
      </div>

      {/* Edit Modals */}
      <HeroSlidesManagerModal
        open={heroModalOpen}
        onClose={() => setHeroModalOpen(false)}
      />

      {experienceSection && (
        <ExperienceSectionModal
          open={experienceModalOpen}
          onClose={() => setExperienceModalOpen(false)}
          onSave={handleSaveExperience}
          initialData={experienceSection}
        />
      )}

      {tourGuideSection && (
        <TourGuideSectionModal
          open={tourGuideModalOpen}
          onClose={() => setTourGuideModalOpen(false)}
          onSave={handleSaveTourGuide}
          initialData={tourGuideSection}
        />
      )}

      {videoSection && (
        <VideoSectionModal
          open={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          onSave={handleSaveVideo}
          initialData={videoSection}
        />
      )}
    </div>
  );
}
