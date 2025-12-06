"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit, BookOpen, Heart, BarChart3, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AboutStoryModal } from "@/components/cms/about-story-modal";
import { AboutCommunityModal } from "@/components/cms/about-community-modal";
import { AboutStatsModal } from "@/components/cms/about-stats-modal";

interface Section {
  id: string;
  status: string;
  [key: string]: any;
}

export default function AboutPageCMS() {
  const [loading, setLoading] = useState(true);
  const [storySection, setStorySection] = useState<Section | null>(null);
  const [communitySection, setCommunitySection] = useState<Section | null>(null);
  const [statsSection, setStatsSection] = useState<Section | null>(null);
  const [values, setValues] = useState<any[]>([]);

  // Modal states
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchAllSections();
  }, []);

  const fetchAllSections = async () => {
    try {
      setLoading(true);

      const [storyRes, communityRes, statsRes, valuesRes] = await Promise.all([
        fetch("/api/cms/about-story?mode=cms"),
        fetch("/api/cms/about-community?mode=cms"),
        fetch("/api/cms/about-stats?mode=cms"),
        fetch("/api/cms/about-values"),
      ]);

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

      if (valuesRes.ok) {
        const data = await valuesRes.json();
        setValues(data.values || []);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast({
        title: "Error",
        description: "Failed to load about page content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStory = async (data: any, publish: boolean) => {
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

  const handleSaveCommunity = async (data: any, publish: boolean) => {
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

  const handleSaveStats = async (data: any, publish: boolean) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">About Page Editor</h1>
        <p className="text-muted-foreground">
          Manage all sections of the About page - Story, Community Impact, Statistics, and Values
        </p>
      </div>

      {/* Story Section */}
      {storySection && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Our Story Section</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Main narrative about Oliotya Safaris
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={storySection.status === "PUBLISHED" ? "default" : "secondary"}>
                {storySection.status}
              </Badge>
              <Button size="sm" className="gap-2" onClick={() => setStoryModalOpen(true)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Heading:</span>
                <p className="mt-1">{storySection.heading}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Title:</span>
                <p className="mt-1">
                  {storySection.title} <span className="text-primary">{storySection.titleHighlight}</span>
                </p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-muted-foreground">First Paragraph:</span>
                <p className="mt-1 line-clamp-2">{storySection.paragraph1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Section */}
      {communitySection && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Community Impact Section</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Akaana Foundation partnership details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={communitySection.status === "PUBLISHED" ? "default" : "secondary"}>
                {communitySection.status}
              </Badge>
              <Button size="sm" className="gap-2" onClick={() => setCommunityModalOpen(true)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Feature 1:</span>
                <p className="mt-1">{communitySection.feature1Title}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Feature 2:</span>
                <p className="mt-1">{communitySection.feature2Title}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Feature 3:</span>
                <p className="mt-1">{communitySection.feature3Title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Section */}
      {statsSection && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Statistics Section</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Key numbers and achievements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statsSection.status === "PUBLISHED" ? "default" : "secondary"}>
                {statsSection.status}
              </Badge>
              <Button size="sm" className="gap-2" onClick={() => setStatsModalOpen(true)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {[
                { number: statsSection.stat1Number, label: statsSection.stat1Label },
                { number: statsSection.stat2Number, label: statsSection.stat2Label },
                { number: statsSection.stat3Number, label: statsSection.stat3Label },
                { number: statsSection.stat4Number, label: statsSection.stat4Label },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stat.number}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Values Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Values Section</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Core values and principles ({values.length} values)
              </p>
            </div>
          </div>
          <Button size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Manage Values
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {values.map((value) => (
              <div key={value.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <div className="w-5 h-5 flex items-center justify-center text-primary font-semibold text-sm">
                      {value.icon.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{value.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Members Section */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <p className="text-sm text-muted-foreground">
            Managed separately in the Team Members page
          </p>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <a href="/cms/team">Go to Team Management</a>
          </Button>
        </CardContent>
      </Card>

      {/* Edit Modals */}
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
    </div>
  );
}
