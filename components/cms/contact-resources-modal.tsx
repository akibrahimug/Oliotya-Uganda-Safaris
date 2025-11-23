"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  linkText: string;
  linkUrl: string;
  isExternal: boolean;
  displayOrder: number;
  active: boolean;
}

interface ContactResourcesModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialResources: Resource[];
}

const ICON_OPTIONS = [
  { value: "Plane", label: "Plane (Travel)" },
  { value: "Shield", label: "Shield (Security)" },
  { value: "CreditCard", label: "Credit Card (Payment)" },
  { value: "BookOpen", label: "Book (Guide)" },
];

export function ContactResourcesModal({
  open,
  onClose,
  onRefresh,
  initialResources,
}: ContactResourcesModalProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Resource>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (initialResources) {
      setResources([...initialResources].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [initialResources]);

  const handleAdd = () => {
    setEditingId("new");
    setEditForm({
      title: "",
      description: "",
      icon: "Plane",
      linkText: "",
      linkUrl: "",
      isExternal: false,
      active: true,
    });
  };

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setEditForm(resource);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveResource = async () => {
    if (!editForm.title || !editForm.description || !editForm.linkText || !editForm.linkUrl) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingId === "new") {
        const response = await fetch("/api/cms/contact-resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editForm.title,
            description: editForm.description,
            icon: editForm.icon,
            linkText: editForm.linkText,
            linkUrl: editForm.linkUrl,
            isExternal: editForm.isExternal,
            displayOrder: resources.length,
            active: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create resource");
        }

        toast({
          title: "Success",
          description: "Resource created successfully",
        });
      } else {
        const response = await fetch("/api/cms/contact-resources", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            title: editForm.title,
            description: editForm.description,
            icon: editForm.icon,
            linkText: editForm.linkText,
            linkUrl: editForm.linkUrl,
            isExternal: editForm.isExternal,
            displayOrder: editForm.displayOrder,
            active: editForm.active,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update resource");
        }

        toast({
          title: "Success",
          description: "Resource updated successfully",
        });
      }

      onRefresh();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error saving resource:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save resource",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/cms/contact-resources?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });

      onRefresh();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (resource: Resource) => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms/contact-resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...resource,
          active: !resource.active,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update resource");
      }

      onRefresh();
    } catch (error) {
      console.error("Error toggling resource:", error);
      toast({
        title: "Error",
        description: "Failed to update resource",
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
          <DialogTitle>Manage Resources</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {resources.length} Resource{resources.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={handleAdd} disabled={editingId !== null}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>

          {editingId && (
            <Card className="mb-4 border-primary">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">
                  {editingId === "new" ? "New Resource" : "Edit Resource"}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={editForm.title || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        placeholder="Uganda Travel Guide"
                      />
                    </div>

                    <div>
                      <Label htmlFor="icon">Icon *</Label>
                      <Select
                        value={editForm.icon || "Plane"}
                        onValueChange={(value) =>
                          setEditForm({ ...editForm, icon: value })
                        }
                      >
                        <SelectTrigger id="icon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      placeholder="Complete guide to visiting Uganda including transportation..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkText">Link Text *</Label>
                      <Input
                        id="linkText"
                        value={editForm.linkText || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, linkText: e.target.value })
                        }
                        placeholder="Read Guide"
                      />
                    </div>

                    <div>
                      <Label htmlFor="linkUrl">Link URL *</Label>
                      <Input
                        id="linkUrl"
                        value={editForm.linkUrl || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, linkUrl: e.target.value })
                        }
                        placeholder="/destinations or https://..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isExternal"
                      checked={editForm.isExternal || false}
                      onCheckedChange={(checked) =>
                        setEditForm({ ...editForm, isExternal: checked as boolean })
                      }
                    />
                    <Label
                      htmlFor="isExternal"
                      className="text-sm font-normal cursor-pointer"
                    >
                      External link (opens in new tab)
                    </Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveResource} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Resource"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {resources.map((resource) => (
              <Card key={resource.id} className={!resource.active ? "opacity-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Icon: {resource.icon}</span>
                        <span>Link: {resource.linkText}</span>
                        {resource.isExternal && <span>(External)</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(resource)}
                        disabled={editingId !== null}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(resource)}
                        disabled={saving}
                      >
                        {resource.active ? "Hide" : "Show"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(resource.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {resources.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No resources yet. Click "Add Resource" to create one.
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
