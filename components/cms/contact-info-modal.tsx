"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ContactInfoData {
  id: string;
  email: string;
  phone: string;
  whatsapp: string;
  office: string;
  businessHours: {
    monFri: string;
    sat: string;
    sun: string;
  };
  quickResponse: string;
  status: string;
}

interface ContactInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ContactInfoData, publish: boolean) => Promise<void>;
  initialData: ContactInfoData | null;
}

export function ContactInfoModal({
  open,
  onClose,
  onSave,
  initialData,
}: ContactInfoModalProps) {
  const [formData, setFormData] = useState<ContactInfoData | null>(null);
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
          <DialogTitle>Edit Contact Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@oliotyasafaris.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+256 788048210"
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+31 682754225"
              />
            </div>

            <div>
              <Label htmlFor="office">Office Location</Label>
              <Input
                id="office"
                value={formData.office}
                onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                placeholder="Kampala, Uganda"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business Hours</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="monFri" className="text-xs text-muted-foreground">Mon-Fri</Label>
                <Input
                  id="monFri"
                  value={formData.businessHours.monFri}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessHours: { ...formData.businessHours, monFri: e.target.value },
                    })
                  }
                  placeholder="Mon - Fri: 8AM - 6PM EAT"
                />
              </div>
              <div>
                <Label htmlFor="sat" className="text-xs text-muted-foreground">Saturday</Label>
                <Input
                  id="sat"
                  value={formData.businessHours.sat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessHours: { ...formData.businessHours, sat: e.target.value },
                    })
                  }
                  placeholder="Sat: 9AM - 2PM EAT"
                />
              </div>
              <div>
                <Label htmlFor="sun" className="text-xs text-muted-foreground">Sunday</Label>
                <Input
                  id="sun"
                  value={formData.businessHours.sun}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessHours: { ...formData.businessHours, sun: e.target.value },
                    })
                  }
                  placeholder="Sun: Closed"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="quickResponse">Quick Response Text</Label>
            <Textarea
              id="quickResponse"
              rows={3}
              value={formData.quickResponse}
              onChange={(e) => setFormData({ ...formData, quickResponse: e.target.value })}
              placeholder="Our team typically responds within 2-4 hours during business hours..."
            />
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
  );
}
