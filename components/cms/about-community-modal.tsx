"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CommunityData {
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

interface AboutCommunityModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CommunityData, publish: boolean) => Promise<void>;
  initialData: CommunityData | null;
}

export function AboutCommunityModal({
  open,
  onClose,
  onSave,
  initialData,
}: AboutCommunityModalProps) {
  const [formData, setFormData] = useState<CommunityData | null>(null);
  const [saving, setSaving] = useState(false);

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Community Impact Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                placeholder="COMMUNITY IMPACT"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Giving Back Through"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="titleHighlight">Title Highlight</Label>
            <Input
              id="titleHighlight"
              value={formData.titleHighlight}
              onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
              placeholder="Akaana Foundation"
            />
          </div>

          <div>
            <Label htmlFor="paragraph1">First Paragraph</Label>
            <Textarea
              id="paragraph1"
              rows={3}
              value={formData.paragraph1}
              onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="paragraph2">Second Paragraph</Label>
            <Textarea
              id="paragraph2"
              rows={3}
              value={formData.paragraph2}
              onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-4">Features</h3>

            <div className="space-y-4">
              <div>
                <Label>Feature 1</Label>
                <Input
                  value={formData.feature1Title}
                  onChange={(e) => setFormData({ ...formData, feature1Title: e.target.value })}
                  placeholder="Title"
                  className="mb-2"
                />
                <Textarea
                  rows={2}
                  value={formData.feature1Description}
                  onChange={(e) => setFormData({ ...formData, feature1Description: e.target.value })}
                  placeholder="Description"
                />
              </div>

              <div>
                <Label>Feature 2</Label>
                <Input
                  value={formData.feature2Title}
                  onChange={(e) => setFormData({ ...formData, feature2Title: e.target.value })}
                  placeholder="Title"
                  className="mb-2"
                />
                <Textarea
                  rows={2}
                  value={formData.feature2Description}
                  onChange={(e) => setFormData({ ...formData, feature2Description: e.target.value })}
                  placeholder="Description"
                />
              </div>

              <div>
                <Label>Feature 3</Label>
                <Input
                  value={formData.feature3Title}
                  onChange={(e) => setFormData({ ...formData, feature3Title: e.target.value })}
                  placeholder="Title"
                  className="mb-2"
                />
                <Textarea
                  rows={2}
                  value={formData.feature3Description}
                  onChange={(e) => setFormData({ ...formData, feature3Description: e.target.value })}
                  placeholder="Description"
                />
              </div>
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
  );
}
