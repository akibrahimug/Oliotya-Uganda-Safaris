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

interface MainHeroSection {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingConfirmationMainHeroModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialData: MainHeroSection | null;
}

export function BookingConfirmationMainHeroModal({
  open,
  onClose,
  onRefresh,
  initialData,
}: BookingConfirmationMainHeroModalProps) {
  const [formData, setFormData] = useState({
    title: "Booking Confirmed!",
    subtitle: "Your safari adventure is one step closer. Check your email for booking details.",
  });
  const [saving, setSaving] = useState(false);
  const [publish, setPublish] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        title: initialData.title,
        subtitle: initialData.subtitle,
      });
      setPublish(initialData.status === "PUBLISHED");
    } else if (open && !initialData) {
      // Reset to defaults for new section
      setFormData({
        title: "Booking Confirmed!",
        subtitle: "Your safari adventure is one step closer. Check your email for booking details.",
      });
      setPublish(false);
    }
  }, [open, initialData]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/cms/booking-confirmation-main-hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: initialData?.id,
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
          ? "Main hero section published successfully. Vercel build triggered."
          : "Main hero section saved as draft",
      });

      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save main hero section",
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
          <DialogTitle>Main Hero Section</DialogTitle>
          <DialogDescription>
            Configure the main hero section that appears at the top of the booking confirmation page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Main Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Booking Confirmed!"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              placeholder="Your safari adventure is one step closer..."
              rows={3}
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
