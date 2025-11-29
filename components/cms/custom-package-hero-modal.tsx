"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/cms/image-picker";
import { Loader2 } from "lucide-react";

interface HeroData {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

interface CustomPackageHeroModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: HeroData, publish: boolean) => Promise<void>;
  initialData: HeroData | null;
}

export function CustomPackageHeroModal({
  open,
  onClose,
  onSave,
  initialData,
}: CustomPackageHeroModalProps) {
  const [formData, setFormData] = useState<HeroData | null>(null);
  const [saving, setSaving] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialize with empty data
      setFormData({
        id: "",
        image: "",
        title: "Create Your Perfect Adventure",
        subtitle: "Custom Safari Packages",
        description: "Design your ideal safari experience with our expert team. Choose destinations, activities, and accommodations that match your preferences.",
        status: "DRAFT",
      });
    }
  }, [initialData]);

  const handleSave = async (publish: boolean) => {
    if (!formData) return;

    setSaving(true);
    try {
      await onSave(formData, publish);
      onClose();
    } catch (error) {
      console.error("Error saving custom package hero:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof HeroData, value: string) => {
    if (!formData) return;

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleImageSelect = (imageUrl: string) => {
    if (!formData) return;

    setFormData({
      ...formData,
      image: imageUrl,
    });
    setImagePickerOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Custom Package Hero Section</DialogTitle>
        </DialogHeader>

        {formData && (
          <div className="space-y-6">
            {/* Image Section */}
            <div className="space-y-2">
              <Label>Hero Image</Label>
              <div className="space-y-3">
                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Hero preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImagePickerOpen(true)}
                  className="w-full"
                >
                  {formData.image ? "Change Image" : "Select Image"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter the main title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                placeholder="Enter the subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter the description"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleSave(false)}
                disabled={saving}
                variant="outline"
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>

              <Button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Save & Publish"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Image Picker Modal */}
        <ImagePicker
          open={imagePickerOpen}
          onClose={() => setImagePickerOpen(false)}
          onSelect={handleImageSelect}
          title="Select Hero Image"
        />
      </DialogContent>
    </Dialog>
  );
}
