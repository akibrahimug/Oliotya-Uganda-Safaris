"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Value {
  id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}

interface AboutValuesModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialValues: Value[];
}

const availableIcons = [
  "Heart",
  "Shield",
  "Users",
  "Globe",
  "Target",
  "Award",
];

export function AboutValuesModal({
  open,
  onClose,
  onRefresh,
  initialValues,
}: AboutValuesModalProps) {
  const [values, setValues] = useState<Value[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Value>>({});

  useEffect(() => {
    if (initialValues) {
      setValues([...initialValues].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [initialValues]);

  const handleAdd = () => {
    setEditingId("new");
    setEditForm({
      title: "",
      description: "",
      icon: "Heart",
      active: true,
    });
  };

  const handleEdit = (value: Value) => {
    setEditingId(value.id);
    setEditForm(value);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveValue = async () => {
    if (!editForm.title || !editForm.description || !editForm.icon) {
      return;
    }

    setSaving(true);
    try {
      if (editingId === "new") {
        // Create new value
        const response = await fetch("/api/cms/about-values", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editForm.title,
            description: editForm.description,
            icon: editForm.icon,
            displayOrder: values.length,
            active: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create value");
        }
      } else {
        // Update existing value
        const response = await fetch("/api/cms/about-values", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            title: editForm.title,
            description: editForm.description,
            icon: editForm.icon,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update value");
        }
      }

      onRefresh();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error saving value:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this value?")) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/cms/about-values?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete value");
      }

      onRefresh();
    } catch (error) {
      console.error("Error deleting value:", error);
    } finally {
      setSaving(false);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;

    const newValues = [...values];
    [newValues[index - 1], newValues[index]] = [newValues[index], newValues[index - 1]];

    // Update display orders
    await updateOrders(newValues);
  };

  const moveDown = async (index: number) => {
    if (index === values.length - 1) return;

    const newValues = [...values];
    [newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]];

    // Update display orders
    await updateOrders(newValues);
  };

  const updateOrders = async (newValues: Value[]) => {
    setSaving(true);
    try {
      // Update each value's displayOrder
      for (let i = 0; i < newValues.length; i++) {
        await fetch("/api/cms/about-values", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: newValues[i].id,
            displayOrder: i,
          }),
        });
      }

      onRefresh();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Values</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {editingId && (
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editForm.title || ""}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Excellence"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="We strive for excellence in every safari experience..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={editForm.icon || "Heart"}
                      onValueChange={(value) => setEditForm({ ...editForm, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveValue} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Value"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {values.map((value, index) => (
              <Card key={value.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveUp(index)}
                        disabled={index === 0 || saving}
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveDown(index)}
                        disabled={index === values.length - 1 || saving}
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{value.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{value.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Icon: {value.icon}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(value)}
                            disabled={editingId !== null}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(value.id)}
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!editingId && (
            <Button variant="outline" className="w-full" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Value
            </Button>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
