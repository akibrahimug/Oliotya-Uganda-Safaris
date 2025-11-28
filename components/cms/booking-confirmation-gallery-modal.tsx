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
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ImagePicker } from "@/components/cms/image-picker";

interface Gallery {
  id: string;
  title: string;
  description?: string | null;
  images: string[];
  displayOrder: number;
  active: boolean;
}

interface BookingConfirmationGalleryModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialGalleries: Gallery[];
}

export function BookingConfirmationGalleryModal({
  open,
  onClose,
  onRefresh,
  initialGalleries,
}: BookingConfirmationGalleryModalProps) {
  const { toast } = useToast();
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      images: [],
    });
    setEditingGallery(null);
    setShowForm(false);
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description || "",
      images: gallery.images || [],
    });
    setShowForm(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData({
      ...formData,
      images: [...formData.images, imageUrl],
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!formData.title || formData.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a title and at least one image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const url = editingGallery
        ? `/api/cms/booking-confirmation-gallery/${editingGallery.id}`
        : "/api/cms/booking-confirmation-gallery";
      const method = editingGallery ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save gallery");

      toast({
        title: "Success",
        description: editingGallery ? "Gallery updated" : "Gallery created",
      });

      await onRefresh();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save gallery",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/cms/booking-confirmation-gallery/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete gallery");

      toast({
        title: "Success",
        description: "Gallery deleted",
      });

      await onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (gallery: Gallery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/cms/booking-confirmation-gallery/${gallery.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...gallery, active: !gallery.active }),
        }
      );

      if (!response.ok) throw new Error("Failed to update gallery");

      toast({
        title: "Success",
        description: gallery.active ? "Gallery deactivated" : "Gallery activated",
      });

      await onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update gallery",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Image Galleries</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add New Gallery
              </Button>
            )}

            {showForm && (
              <Card className="p-4 space-y-4 border-2 border-primary">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {editingGallery ? "Edit Gallery" : "New Gallery"}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Gallery title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                    placeholder="Gallery description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Images *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowImageSelector(true)}
                    className="w-full"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Add Images from R2 CDN
                  </Button>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={handleSave} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Gallery"
                  )}
                </Button>
              </Card>
            )}

            <div className="space-y-4">
              {galleries.map((gallery) => (
                <Card
                  key={gallery.id}
                  className={`p-4 ${!gallery.active ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{gallery.title}</h4>
                      {gallery.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {gallery.description}
                        </p>
                      )}
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {gallery.images.slice(0, 6).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${gallery.title} ${idx + 1}`}
                            className="w-full h-16 object-cover rounded border"
                          />
                        ))}
                        {gallery.images.length > 6 && (
                          <div className="w-full h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                            +{gallery.images.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(gallery)}
                        disabled={loading}
                      >
                        {gallery.active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(gallery)}
                        disabled={loading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(gallery.id)}
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

      <ImagePicker
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
}
