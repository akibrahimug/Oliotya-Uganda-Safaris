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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, CreditCard, MessageCircle, CheckCircle2 } from "lucide-react";

interface NextStepsSection {
  id: string;
  title: string;
  description: string;
  emailStep: any;
  paymentStep: any;
  contactStep: any;
  confirmStep: any;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingConfirmationNextStepsModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialData: NextStepsSection | null;
}

export function BookingConfirmationNextStepsModal({
  open,
  onClose,
  onRefresh,
  initialData,
}: BookingConfirmationNextStepsModalProps) {
  const [formData, setFormData] = useState({
    title: "What Happens Next",
    description: "Follow these simple steps to complete your booking",
    emailStep: {
      title: "Check Your Email",
      description: "We've sent a confirmation email with detailed payment instructions to:",
      emailNote: "Check your spam/junk folder if you don't see it in your inbox within 5 minutes."
    },
    paymentStep: {
      title: "Make Payment",
      description: "Complete the bank transfer using the details provided in your email:",
      deadlineNote: "Payment must be completed within 48 hours to guarantee availability."
    },
    contactStep: {
      title: "Send Payment Confirmation",
      description: "After making the transfer, send us the payment reference number via:",
      email: "Info@oliotyaugandasafaris.com",
      whatsapp: "+256 123 456 789"
    },
    confirmStep: {
      title: "Booking Confirmed",
      description: "Once we verify your payment (usually within 2-4 hours), you'll receive:",
      benefits: [
        "Final booking confirmation email",
        "Detailed safari itinerary",
        "Packing list and preparation guide",
        "Contact details for your safari guide"
      ]
    }
  });
  const [saving, setSaving] = useState(false);
  const [publish, setPublish] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        emailStep: initialData.emailStep || formData.emailStep,
        paymentStep: initialData.paymentStep || formData.paymentStep,
        contactStep: initialData.contactStep || formData.contactStep,
        confirmStep: initialData.confirmStep || formData.confirmStep,
      });
      setPublish(initialData.status === "PUBLISHED");
    } else if (open && !initialData) {
      // Reset to defaults for new section
      setFormData({
        title: "What Happens Next",
        description: "Follow these simple steps to complete your booking",
        emailStep: {
          title: "Check Your Email",
          description: "We've sent a confirmation email with detailed payment instructions to:",
          emailNote: "Check your spam/junk folder if you don't see it in your inbox within 5 minutes."
        },
        paymentStep: {
          title: "Make Payment",
          description: "Complete the bank transfer using the details provided in your email:",
          deadlineNote: "Payment must be completed within 48 hours to guarantee availability."
        },
        contactStep: {
          title: "Send Payment Confirmation",
          description: "After making the transfer, send us the payment reference number via:",
          email: "Info@oliotyaugandasafaris.com",
          whatsapp: "+256 123 456 789"
        },
        confirmStep: {
          title: "Booking Confirmed",
          description: "Once we verify your payment (usually within 2-4 hours), you'll receive:",
          benefits: [
            "Final booking confirmation email",
            "Detailed safari itinerary",
            "Packing list and preparation guide",
            "Contact details for your safari guide"
          ]
        }
      });
      setPublish(false);
    }
  }, [open, initialData]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/cms/booking-confirmation-next-steps", {
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
          ? "Next steps section published successfully. Vercel build triggered."
          : "Next steps section saved as draft",
      });

      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save next steps section",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateStepData = (step: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const updateBenefits = (benefits: string[]) => {
    setFormData(prev => ({
      ...prev,
      confirmStep: {
        ...prev.confirmStep,
        benefits
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>What Happens Next Section</DialogTitle>
          <DialogDescription>
            Configure the step-by-step process that customers follow after booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What Happens Next"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Section Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Follow these simple steps..."
              />
            </div>
          </div>

          {/* Step 1: Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4" />
                Step 1: Email Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.emailStep.title}
                  onChange={(e) => updateStepData("emailStep", "title", e.target.value)}
                  placeholder="Check Your Email"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.emailStep.description}
                  onChange={(e) => updateStepData("emailStep", "description", e.target.value)}
                  placeholder="We've sent a confirmation email..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Note</Label>
                <Textarea
                  value={formData.emailStep.emailNote}
                  onChange={(e) => updateStepData("emailStep", "emailNote", e.target.value)}
                  placeholder="Check your spam/junk folder..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                Step 2: Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.paymentStep.title}
                  onChange={(e) => updateStepData("paymentStep", "title", e.target.value)}
                  placeholder="Make Payment"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.paymentStep.description}
                  onChange={(e) => updateStepData("paymentStep", "description", e.target.value)}
                  placeholder="Complete the bank transfer..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Deadline Note</Label>
                <Textarea
                  value={formData.paymentStep.deadlineNote}
                  onChange={(e) => updateStepData("paymentStep", "deadlineNote", e.target.value)}
                  placeholder="Payment must be completed within..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-4 w-4" />
                Step 3: Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.contactStep.title}
                  onChange={(e) => updateStepData("contactStep", "title", e.target.value)}
                  placeholder="Send Payment Confirmation"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.contactStep.description}
                  onChange={(e) => updateStepData("contactStep", "description", e.target.value)}
                  placeholder="After making the transfer..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={formData.contactStep.email}
                    onChange={(e) => updateStepData("contactStep", "email", e.target.value)}
                    placeholder="Info@oliotyaugandasafaris.com"
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.contactStep.whatsapp}
                    onChange={(e) => updateStepData("contactStep", "whatsapp", e.target.value)}
                    placeholder="+256 123 456 789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4" />
                Step 4: Final Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.confirmStep.title}
                  onChange={(e) => updateStepData("confirmStep", "title", e.target.value)}
                  placeholder="Booking Confirmed"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.confirmStep.description}
                  onChange={(e) => updateStepData("confirmStep", "description", e.target.value)}
                  placeholder="Once we verify your payment..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Benefits (one per line)</Label>
                <Textarea
                  value={formData.confirmStep.benefits.join('\n')}
                  onChange={(e) => updateBenefits(e.target.value.split('\n').filter(line => line.trim()))}
                  placeholder="Final booking confirmation email..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

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
