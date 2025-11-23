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

interface ContactHeroModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: HeroData, publish: boolean) => Promise<void>;
  initialData: HeroData | null;
}

export function ContactHeroModal({
  open,
  onClose,
  onSave,
  initialData,
}: ContactHeroModalProps) {
  const [formData, setFormData] = useState<HeroData | null>(null);
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
            <DialogTitle>Edit Contact Page Hero</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="We're here to help"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Get In Touch"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Have questions about your Uganda adventure?"
              />
            </div>

            <div>
              <Label>Hero Image</Label>
              <div className="mt-2">
                {formData.image && (
                  <div className="mb-4 rounded-lg overflow-hidden border">
                    <img
                      src={formData.image}
                      alt="Hero preview"
                      className="w-full h-48 object-cover"
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
          </div>

          <div className="flex justify-between pt-4 border-t">
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
                  "Save Draft"
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
        onSelect={(imageUrl) => {
          setFormData({ ...formData, image: imageUrl });
          setImagePickerOpen(false);
        }}
        category="hero"
      />
    </>
  );
}
