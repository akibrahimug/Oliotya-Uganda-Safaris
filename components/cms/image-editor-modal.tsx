"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ImageEditorModalProps {
  open: boolean;
  onClose: () => void;
  image: {
    id: string;
    filename: string;
    url: string;
    altText: string | null;
    category: string | null;
    width: number;
    height: number;
    fileSize: number;
    format: string;
  };
  onSuccess: () => void;
}

export function ImageEditorModal({
  open,
  onClose,
  image,
  onSuccess,
}: ImageEditorModalProps) {
  const [altText, setAltText] = useState(image.altText || "");
  const [category, setCategory] = useState(image.category || "other");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when image changes
  useEffect(() => {
    setAltText(image.altText || "");
    setCategory(image.category || "other");
  }, [image]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch(`/api/cms/images/${image.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          altText: altText || undefined,
          category,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update image");
      }

      toast({
        title: "Success",
        description: "Image updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating image:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update image",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogDescription>
            Update image metadata and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <Image
              src={image.url}
              alt={image.altText || image.filename}
              fill
              className="object-contain"
            />
          </div>

          {/* Image Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Filename</p>
              <p className="font-medium truncate" title={image.filename}>
                {image.filename}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Dimensions</p>
              <p className="font-medium">
                {image.width} × {image.height}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">File Size</p>
              <p className="font-medium">{formatFileSize(image.fileSize)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Format</p>
              <p className="font-medium uppercase">{image.format}</p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe this image for accessibility"
              />
              <p className="text-xs text-muted-foreground">
                Describe the image for screen readers and SEO
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="destination">Destination</SelectItem>
                  <SelectItem value="package">Package</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Categorize this image for better organization
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
