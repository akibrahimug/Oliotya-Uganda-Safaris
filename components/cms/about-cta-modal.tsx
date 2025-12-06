"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CTAData {
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

interface AboutCTAModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CTAData, publish: boolean) => Promise<void>;
  initialData: CTAData | null;
}

export function AboutCTAModal({
  open,
  onClose,
  onSave,
  initialData,
}: AboutCTAModalProps) {
  const [formData, setFormData] = useState<CTAData | null>(null);
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
          <DialogTitle>Edit Call-to-Action Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="badge">Badge Text</Label>
            <Input
              id="badge"
              value={formData.badge}
              onChange={(e) =>
                setFormData({ ...formData, badge: e.target.value })
              }
              placeholder="Join Thousands of Happy Travelers"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={formData.heading}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
                placeholder="Ready to Start Your"
              />
            </div>
            <div>
              <Label htmlFor="headingHighlight">
                Heading Highlight (colored)
              </Label>
              <Input
                id="headingHighlight"
                value={formData.headingHighlight}
                onChange={(e) =>
                  setFormData({ ...formData, headingHighlight: e.target.value })
                }
                placeholder="Uganda Adventure"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Let our expert team craft a personalized safari experience..."
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Primary Button</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="button1Text">Button Text</Label>
                <Input
                  id="button1Text"
                  value={formData.button1Text}
                  onChange={(e) =>
                    setFormData({ ...formData, button1Text: e.target.value })
                  }
                  placeholder="Explore Our Destinations"
                />
              </div>
              <div>
                <Label htmlFor="button1Link">Button Link</Label>
                <Input
                  id="button1Link"
                  value={formData.button1Link}
                  onChange={(e) =>
                    setFormData({ ...formData, button1Link: e.target.value })
                  }
                  placeholder="/destinations"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Secondary Button</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="button2Text">Button Text</Label>
                <Input
                  id="button2Text"
                  value={formData.button2Text}
                  onChange={(e) =>
                    setFormData({ ...formData, button2Text: e.target.value })
                  }
                  placeholder="Request Custom Itinerary"
                />
              </div>
              <div>
                <Label htmlFor="button2Link">Button Link</Label>
                <Input
                  id="button2Link"
                  value={formData.button2Link}
                  onChange={(e) =>
                    setFormData({ ...formData, button2Link: e.target.value })
                  }
                  placeholder="/build-package"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="footerText">Footer Text</Label>
            <Input
              id="footerText"
              value={formData.footerText}
              onChange={(e) =>
                setFormData({ ...formData, footerText: e.target.value })
              }
              placeholder="🌟 98% Customer Satisfaction • 🏆 Award-Winning Service"
            />
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
