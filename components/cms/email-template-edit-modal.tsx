"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Palette, Mail } from "lucide-react";
import { EmailTemplate } from "@/prisma/app/generated/prisma-client";

interface EmailTemplateEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<EmailTemplate>) => Promise<void>;
  initialData: EmailTemplate;
  templateLabel: string;
}

export function EmailTemplateEditModal({
  open,
  onClose,
  onSave,
  initialData,
  templateLabel,
}: EmailTemplateEditModalProps) {
  const [formData, setFormData] = useState<Partial<EmailTemplate>>(initialData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof EmailTemplate, value: string | boolean) => {
    setFormData((prev: Partial<EmailTemplate>) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {templateLabel}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Brand Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-5 w-5" />
              <h3 className="font-semibold">Brand Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName || ""}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  placeholder="Oliotya Uganda Safaris"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  placeholder="Info@oliotyaugandasafaris.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor || "#059669"}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="w-20 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.primaryColor || "#059669"}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    placeholder="#059669"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={formData.accentColor || "#3b82f6"}
                    onChange={(e) => updateField("accentColor", e.target.value)}
                    className="w-20 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.accentColor || "#3b82f6"}
                    onChange={(e) => updateField("accentColor", e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5" />
              <h3 className="font-semibold">Email Content</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={formData.subject || ""}
                onChange={(e) => updateField("subject", e.target.value)}
                placeholder="Booking Confirmed! - {confirmationNumber}"
              />
              <p className="text-xs text-muted-foreground">
                Use placeholders like {"{confirmationNumber}"}, {"{name}"}, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading">Main Heading</Label>
              <Input
                id="heading"
                value={formData.heading || ""}
                onChange={(e) => updateField("heading", e.target.value)}
                placeholder="Booking Confirmed!"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="greeting">Greeting</Label>
              <Input
                id="greeting"
                value={formData.greeting || ""}
                onChange={(e) => updateField("greeting", e.target.value)}
                placeholder="Dear {name},"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="introText">Introduction Text</Label>
              <Textarea
                id="introText"
                value={formData.introText || ""}
                onChange={(e) => updateField("introText", e.target.value)}
                placeholder="Thank you for booking with us..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextStepsTitle">Next Steps Title (Optional)</Label>
              <Input
                id="nextStepsTitle"
                value={formData.nextStepsTitle || ""}
                onChange={(e) => updateField("nextStepsTitle", e.target.value)}
                placeholder="What Happens Next?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextStepsText">Next Steps Text (Optional)</Label>
              <Textarea
                id="nextStepsText"
                value={formData.nextStepsText || ""}
                onChange={(e) => updateField("nextStepsText", e.target.value)}
                placeholder="1. Our team will review your booking&#10;2. You'll receive confirmation..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signatureText">Signature Text</Label>
              <Textarea
                id="signatureText"
                value={formData.signatureText || ""}
                onChange={(e) => updateField("signatureText", e.target.value)}
                placeholder="Best regards,&#10;The Team"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Textarea
                id="footerText"
                value={formData.footerText || ""}
                onChange={(e) => updateField("footerText", e.target.value)}
                placeholder="Company Name - Tagline"
                rows={2}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
