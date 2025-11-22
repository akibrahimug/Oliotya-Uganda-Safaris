"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/cms/image-picker";
import { Loader2 } from "lucide-react";

interface StoryData {
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

interface AboutStoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: StoryData, publish: boolean) => Promise<void>;
  initialData: StoryData | null;
}

export function AboutStoryModal({
  open,
  onClose,
  onSave,
  initialData,
}: AboutStoryModalProps) {
  const [formData, setFormData] = useState<StoryData | null>(null);
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
        <DialogContent className="max-w-[95vw] lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Our Story Section</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="OUR STORY"
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Crafting Unforgettable"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="titleHighlight">Title Highlight (colored part)</Label>
              <Input
                id="titleHighlight"
                value={formData.titleHighlight}
                onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                placeholder="African Adventures"
              />
            </div>

            <div>
              <Label htmlFor="paragraph1">First Paragraph</Label>
              <Textarea
                id="paragraph1"
                rows={4}
                value={formData.paragraph1}
                onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
                placeholder="First paragraph of your story..."
              />
            </div>

            <div>
              <Label htmlFor="paragraph2">Second Paragraph</Label>
              <Textarea
                id="paragraph2"
                rows={4}
                value={formData.paragraph2}
                onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })}
                placeholder="Second paragraph of your story..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="Explore Our Tours"
                />
              </div>
              <div>
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="/destinations"
                />
              </div>
            </div>

            <div>
              <Label>Story Image</Label>
              {formData.image ? (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden max-w-md mt-2">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
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
                  className="w-full h-32 mt-2"
                  onClick={() => setImagePickerOpen(true)}
                >
                  Select Image
                </Button>
              )}
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
