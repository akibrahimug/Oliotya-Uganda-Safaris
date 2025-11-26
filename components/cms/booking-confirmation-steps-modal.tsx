"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  extraInfo?: string | null;
  displayOrder: number;
  active: boolean;
}

interface BookingConfirmationStepsModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialSteps: Step[];
}

export function BookingConfirmationStepsModal({
  open,
  onClose,
  onRefresh,
  initialSteps,
}: BookingConfirmationStepsModalProps) {
  const { toast } = useToast();
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    stepNumber: 1,
    title: "",
    description: "",
    icon: "",
    extraInfo: "",
  });

  const resetForm = () => {
    setFormData({
      stepNumber: 1,
      title: "",
      description: "",
      icon: "",
      extraInfo: "",
    });
    setEditingStep(null);
    setShowForm(false);
  };

  const handleEdit = (step: Step) => {
    setEditingStep(step);
    setFormData({
      stepNumber: step.stepNumber,
      title: step.title,
      description: step.description,
      icon: step.icon,
      extraInfo: step.extraInfo || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.icon) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const url = editingStep
        ? `/api/cms/booking-confirmation-steps/${editingStep.id}`
        : "/api/cms/booking-confirmation-steps";
      const method = editingStep ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save step");

      toast({
        title: "Success",
        description: editingStep ? "Step updated" : "Step created",
      });

      await onRefresh();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save step",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this step?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/cms/booking-confirmation-steps/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete step");

      toast({
        title: "Success",
        description: "Step deleted",
      });

      await onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete step",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (step: Step) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/cms/booking-confirmation-steps/${step.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...step, active: !step.active }),
        }
      );

      if (!response.ok) throw new Error("Failed to update step");

      toast({
        title: "Success",
        description: step.active ? "Step deactivated" : "Step activated",
      });

      await onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update step",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Steps</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Step
            </Button>
          )}

          {showForm && (
            <Card className="p-4 space-y-4 border-2 border-primary">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {editingStep ? "Edit Step" : "New Step"}
                </h3>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stepNumber">Step Number *</Label>
                  <Input
                    id="stepNumber"
                    type="number"
                    min="1"
                    value={formData.stepNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stepNumber: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Lucide icon name) *</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="e.g., CreditCard, Mail, CheckCircle"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Step title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Step description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extraInfo">Extra Info (Optional)</Label>
                <Textarea
                  id="extraInfo"
                  value={formData.extraInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, extraInfo: e.target.value })
                  }
                  rows={2}
                  placeholder="Additional information"
                />
              </div>

              <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Step"
                )}
              </Button>
            </Card>
          )}

          <div className="space-y-2">
            {steps.map((step) => (
              <Card
                key={step.id}
                className={`p-4 ${!step.active ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {step.stepNumber}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{step.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        ({step.icon})
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {step.extraInfo && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.extraInfo}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(step)}
                      disabled={loading}
                    >
                      {step.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(step)}
                      disabled={loading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(step.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
