"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EditableWrapper } from "@/components/cms/editable-wrapper";
import { CMSLoader, CMSSectionLoader } from "@/components/cms/cms-loader";
import { AboutHeroSection } from "@/components/about-hero-section";
import { AboutStorySection } from "@/components/about-story-section";
import { AboutCommunitySection } from "@/components/about-community-section";
import { AboutStatsSection } from "@/components/about-stats-section";
import { AboutTeamSection } from "@/components/about-team-section";
import { AboutCTASection } from "@/components/about-cta-section";
import { AboutValuesSection } from "@/components/about-values-section";
import { AboutHeroModal } from "@/components/cms/about-hero-modal";
import { AboutStoryModal } from "@/components/cms/about-story-modal";
import { AboutCommunityModal } from "@/components/cms/about-community-modal";
import { AboutStatsModal } from "@/components/cms/about-stats-modal";
import { AboutTeamModal } from "@/components/cms/about-team-modal";
import { AboutCTAModal } from "@/components/cms/about-cta-modal";
import { AboutValuesModal } from "@/components/cms/about-values-modal";

interface HeroSection {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

interface StorySection {
  id: string;
  heading: string;
  title: string;
  titleHighlight: string;
  paragraph1: string;
  paragraph2: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  status: string;
}

interface CommunitySection {
  id: string;
  heading: string;
  title: string;
  titleHighlight: string;
  paragraph1: string;
  paragraph2: string;
  buttonText: string;
  buttonLink: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  status: string;
}

interface StatsSection {
  id: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  stat3Number: string;
  stat3Label: string;
  stat4Number: string;
  stat4Label: string;
  status: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  years: string;
  specialties: string[];
  displayOrder: number;
  active: boolean;
}

interface CTASection {
  id: string;
  badge: string;
  heading: string;
  headingHighlight: string;
  description: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  footerText: string;
  status: string;
}

interface Value {
  id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}

export default function CMSAboutPageInline() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Section data
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [storySection, setStorySection] = useState<StorySection | null>(null);
  const [communitySection, setCommunitySection] = useState<CommunitySection | null>(null);
  const [statsSection, setStatsSection] = useState<StatsSection | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamSection, setTeamSection] = useState<any>(null);
  const [ctaSection, setCTASection] = useState<CTASection | null>(null);
  const [values, setValues] = useState<Value[]>([]);

  // Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [ctaModalOpen, setCTAModalOpen] = useState(false);
  const [valuesModalOpen, setValuesModalOpen] = useState(false);

  // Fetch all sections
  const fetchSections = async () => {
    try {
      setLoading(true);

      const [heroRes, storyRes, communityRes, statsRes, teamRes, ctaRes, valuesRes] = await Promise.all([
        fetch("/api/cms/about-hero?mode=cms"),
        fetch("/api/cms/about-story?mode=cms"),
        fetch("/api/cms/about-community?mode=cms"),
        fetch("/api/cms/about-stats?mode=cms"),
        fetch("/api/cms/team?mode=cms"),
        fetch("/api/cms/about-cta?mode=cms"),
        fetch("/api/cms/about-values?mode=cms"),
      ]);

      if (heroRes.ok) {
        const data = await heroRes.json();
        setHeroSection(data.section);
      }

      if (storyRes.ok) {
        const data = await storyRes.json();
        setStorySection(data.section);
      }

      if (communityRes.ok) {
        const data = await communityRes.json();
        setCommunitySection(data.section);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStatsSection(data.section);
      }

      if (teamRes.ok) {
        const data = await teamRes.json();
        setTeamMembers(data.teamMembers || []);
        setTeamSection(data.teamSection);
      }

      if (ctaRes.ok) {
        const data = await ctaRes.json();
        setCTASection(data.section);
      }

      if (valuesRes.ok) {
        const data = await valuesRes.json();
        setValues(data.values || []);
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
      const response = await fetch("/api/cms/about-hero", {
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

  const handleSaveStory = async (data: StorySection, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/about-story", {
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
          ? "Story section published successfully. Vercel build triggered."
          : "Story section saved as draft",
      });

      setStorySection(result.section);
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

  const handleSaveCommunity = async (data: CommunitySection, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/about-community", {
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
          ? "Community section published successfully. Vercel build triggered."
          : "Community section saved as draft",
      });

      setCommunitySection(result.section);
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

  const handleSaveStats = async (data: StatsSection, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/about-stats", {
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
          ? "Stats section published successfully. Vercel build triggered."
          : "Stats section saved as draft",
      });

      setStatsSection(result.section);
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

  const handleSaveCTA = async (data: CTASection, publish: boolean) => {
    try {
      const response = await fetch("/api/cms/about-cta", {
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
          ? "CTA section published successfully. Vercel build triggered."
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

  if (loading) {
    return <CMSLoader />;
  }

  return (
    <div className="space-y-6">
      {/* CMS Header */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">About Page Editor</h1>
            <p className="text-sm text-muted-foreground">
              Click any section to edit. Use "Save & Publish" in the modal to make changes live.
            </p>
          </div>
        </div>
      </div>

      {/* About Page Preview with Inline Editing */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="bg-background rounded-lg shadow-sm overflow-hidden">
          {/* Hero Section - Editable */}
          <EditableWrapper onEdit={() => setHeroModalOpen(true)} label="Page Hero">
            {heroSection ? (
              <AboutHeroSection data={heroSection} />
            ) : (
              <CMSSectionLoader />
            )}
          </EditableWrapper>

          {/* Story Section - Editable */}
          <EditableWrapper onEdit={() => setStoryModalOpen(true)} label="Our Story">
            {storySection ? (
              <AboutStorySection data={storySection} />
            ) : (
              <CMSSectionLoader />
            )}
          </EditableWrapper>

          {/* Community Section - Editable */}
          <EditableWrapper onEdit={() => setCommunityModalOpen(true)} label="Community Impact">
            {communitySection ? (
              <AboutCommunitySection data={communitySection} />
            ) : (
              <CMSSectionLoader />
            )}
          </EditableWrapper>

          {/* Stats Section - Editable */}
          <EditableWrapper onEdit={() => setStatsModalOpen(true)} label="Statistics">
            {statsSection ? (
              <AboutStatsSection data={statsSection} />
            ) : (
              <CMSSectionLoader />
            )}
          </EditableWrapper>

          {/* Team Section - Editable */}
          <EditableWrapper onEdit={() => setTeamModalOpen(true)} label="Team Members">
            <AboutTeamSection data={teamMembers.filter(m => m.active)} sectionData={teamSection} />
          </EditableWrapper>

          {/* CTA Section - Editable */}
          <EditableWrapper onEdit={() => setCTAModalOpen(true)} label="Call to Action">
            {ctaSection ? (
              <AboutCTASection data={ctaSection} />
            ) : (
              <CMSSectionLoader />
            )}
          </EditableWrapper>

          {/* Values Section - Editable */}
          <EditableWrapper onEdit={() => setValuesModalOpen(true)} label="Values">
            <AboutValuesSection data={values.filter(v => v.active)} />
          </EditableWrapper>
        </div>
      </div>

      {/* Edit Modals */}
      {heroSection && (
        <AboutHeroModal
          open={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          onSave={handleSaveHero}
          initialData={heroSection}
        />
      )}

      {storySection && (
        <AboutStoryModal
          open={storyModalOpen}
          onClose={() => setStoryModalOpen(false)}
          onSave={handleSaveStory}
          initialData={storySection}
        />
      )}

      {communitySection && (
        <AboutCommunityModal
          open={communityModalOpen}
          onClose={() => setCommunityModalOpen(false)}
          onSave={handleSaveCommunity}
          initialData={communitySection}
        />
      )}

      {statsSection && (
        <AboutStatsModal
          open={statsModalOpen}
          onClose={() => setStatsModalOpen(false)}
          onSave={handleSaveStats}
          initialData={statsSection}
        />
      )}

      <AboutTeamModal
        open={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        onRefresh={fetchSections}
        initialTeamMembers={teamMembers || []}
      />

      {ctaSection && (
        <AboutCTAModal
          open={ctaModalOpen}
          onClose={() => setCTAModalOpen(false)}
          onSave={handleSaveCTA}
          initialData={ctaSection}
        />
      )}

      <AboutValuesModal
        open={valuesModalOpen}
        onClose={() => setValuesModalOpen(false)}
        onRefresh={fetchSections}
        initialValues={values}
      />
    </div>
  );
}
