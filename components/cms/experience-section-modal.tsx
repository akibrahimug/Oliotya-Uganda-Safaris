"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/cms/image-picker";
import { Loader2 } from "lucide-react";

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

interface ExperienceSectionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExperienceSectionData, publish: boolean) => Promise<void>;
  initialData: ExperienceSectionData | null;
}

export function ExperienceSectionModal({
  open,
  onClose,
  onSave,
  initialData,
}: ExperienceSectionModalProps) {
  const [formData, setFormData] = useState<ExperienceSectionData | null>(null);
  const [saving, setSaving] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = async (publish: boolean) => {
    if (!formData) return;

    setSaving(true);
    try {
      await onSave(formData, publish);
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!formData) return null;

  return (
    <>
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Experience Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                placeholder="We are collectors of"
              />
            </div>
            <div>
              <Label htmlFor="title">Title (Highlighted)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Unique Experiences"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description text..."
            />
          </div>

          <div>
            <Label>Image</Label>
            {formData.image ? (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden max-w-md">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setImagePickerOpen(true)}
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-32"
                onClick={() => setImagePickerOpen(true)}
              >
                Select Image
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stat1Value">Stat 1 Value</Label>
              <Input
                id="stat1Value"
                value={formData.stat1Value}
                onChange={(e) => setFormData({ ...formData, stat1Value: e.target.value })}
                placeholder="10+"
              />
            </div>
            <div>
              <Label htmlFor="stat1Label">Stat 1 Label</Label>
              <Input
                id="stat1Label"
                value={formData.stat1Label}
                onChange={(e) => setFormData({ ...formData, stat1Label: e.target.value })}
                placeholder="Destinations"
              />
            </div>
            <div>
              <Label htmlFor="stat2Value">Stat 2 Value</Label>
              <Input
                id="stat2Value"
                value={formData.stat2Value}
                onChange={(e) => setFormData({ ...formData, stat2Value: e.target.value })}
                placeholder="8+"
              />
            </div>
            <div>
              <Label htmlFor="stat2Label">Stat 2 Label</Label>
              <Input
                id="stat2Label"
                value={formData.stat2Label}
                onChange={(e) => setFormData({ ...formData, stat2Label: e.target.value })}
                placeholder="Years Experience"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="badgeText">Badge Text</Label>
              <Input
                id="badgeText"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                placeholder="1 International Travel"
              />
            </div>
            <div>
              <Label htmlFor="backgroundText">Background Text</Label>
              <Input
                id="backgroundText"
                value={formData.backgroundText}
                onChange={(e) => setFormData({ ...formData, backgroundText: e.target.value })}
                placeholder="UGANDA"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving}>
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
      </DialogContent>
    </Dialog>

    <ImagePicker
      open={imagePickerOpen}
      onClose={() => setImagePickerOpen(false)}
      onSelect={(url) => {
        setFormData({ ...formData!, image: url });
        setImagePickerOpen(false);
      }}
    />
  </>
  );
}
