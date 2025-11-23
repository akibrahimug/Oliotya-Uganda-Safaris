"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  active: boolean;
}

interface ContactFAQModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialFAQs: FAQ[];
}

export function ContactFAQModal({
  open,
  onClose,
  onRefresh,
  initialFAQs,
}: ContactFAQModalProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FAQ>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (initialFAQs) {
      setFaqs([...initialFAQs].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [initialFAQs]);

  const handleAdd = () => {
    setEditingId("new");
    setEditForm({
      question: "",
      answer: "",
      category: "general",
      active: true,
    });
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditForm(faq);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveFAQ = async () => {
    if (!editForm.question || !editForm.answer) {
      toast({
        title: "Error",
        description: "Question and answer are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingId === "new") {
        const response = await fetch("/api/cms/contact-faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: editForm.question,
            answer: editForm.answer,
            category: editForm.category || "general",
            displayOrder: faqs.length,
            active: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create FAQ");
        }

        toast({
          title: "Success",
          description: "FAQ created successfully",
        });
      } else {
        const response = await fetch("/api/cms/contact-faqs", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            question: editForm.question,
            answer: editForm.answer,
            category: editForm.category,
            displayOrder: editForm.displayOrder,
            active: editForm.active,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update FAQ");
        }

        toast({
          title: "Success",
          description: "FAQ updated successfully",
        });
      }

      onRefresh();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save FAQ",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/cms/contact-faqs?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete FAQ");
      }

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });

      onRefresh();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (faq: FAQ) => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms/contact-faqs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          displayOrder: faq.displayOrder,
          active: !faq.active,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update FAQ");
      }

      onRefresh();
    } catch (error) {
      console.error("Error toggling FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage FAQs</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={handleAdd} disabled={editingId !== null}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>

          {editingId && (
            <Card className="mb-4 border-primary">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">
                  {editingId === "new" ? "New FAQ" : "Edit FAQ"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question *</Label>
                    <Input
                      id="question"
                      value={editForm.question || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, question: e.target.value })
                      }
                      placeholder="Do I need a visa to visit Uganda?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="answer">Answer *</Label>
                    <Textarea
                      id="answer"
                      rows={6}
                      value={editForm.answer || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, answer: e.target.value })
                      }
                      placeholder="Most visitors can obtain a visa on arrival..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category (optional)</Label>
                    <Input
                      id="category"
                      value={editForm.category || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      placeholder="visa, booking, travel, etc."
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveFAQ} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save FAQ"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {faqs.map((faq) => (
              <Card key={faq.id} className={!faq.active ? "opacity-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {faq.answer}
                      </p>
                      {faq.category && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Category: {faq.category}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(faq)}
                        disabled={editingId !== null}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(faq)}
                        disabled={saving}
                      >
                        {faq.active ? "Hide" : "Show"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(faq.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {faqs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No FAQs yet. Click "Add FAQ" to create one.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
