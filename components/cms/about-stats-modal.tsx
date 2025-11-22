"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface StatsData {
  id: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  stat3Number: string;
  stat3Label: string;
  stat4Number: string;
  stat4Label: string;
  status: string;
}

interface AboutStatsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: StatsData, publish: boolean) => Promise<void>;
  initialData: StatsData | null;
}

export function AboutStatsModal({
  open,
  onClose,
  onSave,
  initialData,
}: AboutStatsModalProps) {
  const [formData, setFormData] = useState<StatsData | null>(null);
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
      <DialogContent className="max-w-[95vw] lg:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Statistics Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stat1Number">Statistic 1 - Number</Label>
              <Input
                id="stat1Number"
                value={formData.stat1Number}
                onChange={(e) => setFormData({ ...formData, stat1Number: e.target.value })}
                placeholder="8+"
              />
            </div>
            <div>
              <Label htmlFor="stat1Label">Statistic 1 - Label</Label>
              <Input
                id="stat1Label"
                value={formData.stat1Label}
                onChange={(e) => setFormData({ ...formData, stat1Label: e.target.value })}
                placeholder="Years Experience"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stat2Number">Statistic 2 - Number</Label>
              <Input
                id="stat2Number"
                value={formData.stat2Number}
                onChange={(e) => setFormData({ ...formData, stat2Number: e.target.value })}
                placeholder="10+"
              />
            </div>
            <div>
              <Label htmlFor="stat2Label">Statistic 2 - Label</Label>
              <Input
                id="stat2Label"
                value={formData.stat2Label}
                onChange={(e) => setFormData({ ...formData, stat2Label: e.target.value })}
                placeholder="Destinations"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stat3Number">Statistic 3 - Number</Label>
              <Input
                id="stat3Number"
                value={formData.stat3Number}
                onChange={(e) => setFormData({ ...formData, stat3Number: e.target.value })}
                placeholder="1200+"
              />
            </div>
            <div>
              <Label htmlFor="stat3Label">Statistic 3 - Label</Label>
              <Input
                id="stat3Label"
                value={formData.stat3Label}
                onChange={(e) => setFormData({ ...formData, stat3Label: e.target.value })}
                placeholder="Happy Travelers"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stat4Number">Statistic 4 - Number</Label>
              <Input
                id="stat4Number"
                value={formData.stat4Number}
                onChange={(e) => setFormData({ ...formData, stat4Number: e.target.value })}
                placeholder="98%"
              />
            </div>
            <div>
              <Label htmlFor="stat4Label">Statistic 4 - Label</Label>
              <Input
                id="stat4Label"
                value={formData.stat4Label}
                onChange={(e) => setFormData({ ...formData, stat4Label: e.target.value })}
                placeholder="Satisfaction Rate"
              />
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
