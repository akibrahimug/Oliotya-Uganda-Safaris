"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Check } from "lucide-react";
import Image from "next/image";

interface CMSImage {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
  category: string | null;
}

interface ImagePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

export function ImagePicker({ open, onClose, onSelect }: ImagePickerProps) {
  const [images, setImages] = useState<CMSImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const response = await fetch(`/api/cms/images?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open, searchQuery, categoryFilter]);

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      setSelectedImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl w-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
          <DialogDescription>
            Choose an image from your gallery or upload a new one
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex gap-4 pb-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hero">Hero</SelectItem>
              <SelectItem value="destination">Destination</SelectItem>
              <SelectItem value="package">Package</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="gallery">Gallery</SelectItem>
              <SelectItem value="about">About</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === image.url
                      ? "border-primary scale-95"
                      : "border-transparent hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || image.filename}
                    fill
                    className="object-cover"
                  />
                  {selectedImage === image.url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              // TODO: Open upload modal
              alert("Upload functionality coming soon!");
            }}
          >
            Upload New Image
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedImage}>
              Select Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
