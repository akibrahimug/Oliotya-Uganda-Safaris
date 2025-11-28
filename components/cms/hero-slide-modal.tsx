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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ImagePicker } from "@/components/cms/image-picker";
import Image from "next/image";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  displayOrder: number;
  active: boolean;
}

interface HeroSlideModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  slide?: HeroSlide | null;
}

export function HeroSlideModal({
  open,
  onClose,
  onSuccess,
  slide,
}: HeroSlideModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const { toast } = useToast();

  const isEdit = !!slide;

  // Reset form when slide changes
  useEffect(() => {
    if (slide) {
      setTitle(slide.title);
      setSubtitle(slide.subtitle);
      setDescription(slide.description);
      setImage(slide.image);
      setActive(slide.active);
    } else {
      setTitle("");
      setSubtitle("");
      setDescription("");
      setImage("");
      setActive(true);
    }
  }, [slide, open]);

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!subtitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Subtitle is required",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }

    if (!image) {
      toast({
        title: "Validation Error",
        description: "Image is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const url = isEdit
        ? `/api/cms/hero-slides/${slide.id}`
        : "/api/cms/hero-slides";

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          subtitle,
          description,
          image,
          active,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save slide");
      }

      toast({
        title: "Success",
        description: `Slide ${isEdit ? "updated" : "created"} successfully`,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving slide:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save slide",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setImage(imageUrl);
    setImagePickerOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Hero Slide" : "Add Hero Slide"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the hero slide details"
                : "Create a new hero slide for your homepage"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image */}
            <div className="space-y-2">
              <Label>
                Image <span className="text-destructive">*</span>
              </Label>
              {image ? (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => setImagePickerOpen(true)}
                    >
                      Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-32"
                  onClick={() => setImagePickerOpen(true)}
                >
                  Select Image
                </Button>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Discover the Magic of"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Small text above the main heading
              </p>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">
                Subtitle (Main Heading) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g., Uganda"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Large, prominent heading text
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this destination or feature"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="active" className="cursor-pointer">
                  Active
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show this slide on the homepage
                </p>
              </div>
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update Slide" : "Create Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Picker Modal */}
      <ImagePicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
}
