"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface TeamSection {
  id: string;
  heading: string;
  title: string;
  description: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamSectionModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialData: TeamSection | null;
}

export function TeamSectionModal({
  open,
  onClose,
  onRefresh,
  initialData,
}: TeamSectionModalProps) {
  const [formData, setFormData] = useState({
    heading: "OUR TEAM",
    title: "Meet the Nambi Uganda Safaris Family",
    description: "Our passionate team of travel experts and local guides are dedicated to creating your perfect Ugandan adventure",
  });
  const [saving, setSaving] = useState(false);
  const [publish, setPublish] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        heading: initialData.heading,
        title: initialData.title,
        description: initialData.description,
      });
      setPublish(initialData.status === "PUBLISHED");
    } else if (open && !initialData) {
      // Reset to defaults for new section
      setFormData({
        heading: "OUR TEAM",
        title: "Meet the Nambi Uganda Safaris Family",
        description: "Our passionate team of travel experts and local guides are dedicated to creating your perfect Ugandan adventure",
      });
      setPublish(false);
    }
  }, [open, initialData]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/cms/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          publish,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: publish
          ? "Team section published successfully"
          : "Team section saved as draft",
      });

      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save team section",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Team Section Settings</DialogTitle>
          <DialogDescription>
            Configure the heading, title, and description for your team section.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heading">Section Heading</Label>
            <Input
              id="heading"
              value={formData.heading}
              onChange={(e) => handleInputChange("heading", e.target.value)}
              placeholder="OUR TEAM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Main Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Meet the Nambi Uganda Safaris Family"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your team section..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="publish"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="publish" className="text-sm">
              Publish immediately
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {publish ? "Save & Publish" : "Save Draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
