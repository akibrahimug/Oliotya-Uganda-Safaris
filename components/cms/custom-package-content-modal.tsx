"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ContentData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

interface CustomPackageContentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ContentData, publish: boolean) => Promise<void>;
  initialData: ContentData | null;
}

export function CustomPackageContentModal({
  open,
  onClose,
  onSave,
  initialData,
}: CustomPackageContentModalProps) {
  const [formData, setFormData] = useState<ContentData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialize with empty data
      setFormData({
        id: "",
        title: "Build Your Custom Safari Package",
        subtitle: "",
        description: "Select the destinations you want to visit, customize the duration, choose your preferred accommodations, and let our expert team create your perfect safari experience.",
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
      console.error("Error saving custom package content:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ContentData, value: string) => {
    if (!formData) return;

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Custom Package Page Content</DialogTitle>
        </DialogHeader>

        {formData && (
          <div className="space-y-6">
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
                placeholder="Enter the subtitle (optional)"
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
      </DialogContent>
    </Dialog>
  );
}
