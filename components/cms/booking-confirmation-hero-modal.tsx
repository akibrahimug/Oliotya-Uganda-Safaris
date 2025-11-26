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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface HeroSection {
  id: string;
  title: string;
  description: string;
  badge: string;
  importantNotice: string;
  paymentDeadline: string;
  status: string;
}

interface BookingConfirmationHeroModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: HeroSection, publish: boolean) => Promise<void>;
  initialData: HeroSection;
}

export function BookingConfirmationHeroModal({
  open,
  onClose,
  onSave,
  initialData,
}: BookingConfirmationHeroModalProps) {
  const [formData, setFormData] = useState<HeroSection>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = async (publish: boolean) => {
    setLoading(true);
    try {
      await onSave(formData, publish);
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hero Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="badge">Badge Text</Label>
            <Input
              id="badge"
              value={formData.badge}
              onChange={(e) =>
                setFormData({ ...formData, badge: e.target.value })
              }
              placeholder="e.g., Booking Confirmed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Main heading"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Welcome message and instructions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="importantNotice">Important Notice</Label>
            <Textarea
              id="importantNotice"
              value={formData.importantNotice}
              onChange={(e) =>
                setFormData({ ...formData, importantNotice: e.target.value })
              }
              rows={3}
              placeholder="Important information about payment"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDeadline">Payment Deadline</Label>
            <Input
              id="paymentDeadline"
              value={formData.paymentDeadline}
              onChange={(e) =>
                setFormData({ ...formData, paymentDeadline: e.target.value })
              }
              placeholder="e.g., 48 hours"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Status: <span className="font-medium">{formData.status}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
            <Button onClick={() => handleSave(true)} disabled={loading}>
              {loading ? (
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
