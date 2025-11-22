"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AboutStorySection {
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

export default function AboutPageEditor() {
  const [loading, setLoading] = useState(true);
  const [storySection, setStorySection] = useState<AboutStorySection | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cms/about-story?mode=cms");

      if (response.ok) {
        const data = await response.json();
        setStorySection(data.section);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">About Page Editor</h1>
        <p className="text-muted-foreground">
          Manage content for the About page - Story, Community, Stats, Team & Values
        </p>
      </div>

      {/* Story Section Preview */}
      {storySection && (
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Story Section</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Heading:</span> {storySection.heading}</p>
            <p><span className="font-medium">Title:</span> {storySection.title} <span className="text-primary">{storySection.titleHighlight}</span></p>
            <p><span className="font-medium">Status:</span> <span className={storySection.status === 'PUBLISHED' ? 'text-green-600' : 'text-yellow-600'}>{storySection.status}</span></p>
          </div>
          <Button className="mt-4" size="sm">Edit Story Section</Button>
        </div>
      )}

      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Other Sections</h2>
        <p className="text-muted-foreground text-sm">
          Community Impact, Stats, Team Members, and Values sections are being built...
        </p>
      </div>
    </div>
  );
}
