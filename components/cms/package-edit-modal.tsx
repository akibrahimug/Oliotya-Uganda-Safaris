"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePicker } from "@/components/cms/image-picker";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { DifficultyLevel } from "@/prisma/app/generated/prisma-client";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface PackageData {
  id?: number;
  name: string;
  slug: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  shortDesc?: string;
  image: string;
  images: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  minTravelers: number;
  maxTravelers: number;
  difficulty: DifficultyLevel;
  featured: boolean;
  popular: boolean;
  active: boolean;
}

interface PackageEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PackageData) => Promise<void>;
  initialData?: PackageData | null;
  mode: "create" | "edit";
}

export function PackageEditModal({
  open,
  onClose,
  onSave,
  initialData,
  mode,
}: PackageEditModalProps) {
  const [formData, setFormData] = useState<PackageData>({
    name: "",
    slug: "",
    category: "Wildlife Safari",
    duration: "",
    price: 0,
    description: "",
    shortDesc: "",
    image: "",
    images: [],
    highlights: [],
    itinerary: [],
    included: [],
    excluded: [],
    minTravelers: 1,
    maxTravelers: 10,
    difficulty: "MODERATE",
    featured: false,
    popular: false,
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<"main" | "gallery">("main");
  const [newHighlight, setNewHighlight] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [newExcluded, setNewExcluded] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Ensure all required fields are present
        setFormData({
          name: initialData.name || "",
          slug: initialData.slug || "",
          category: initialData.category || "Wildlife Safari",
          duration: initialData.duration || "",
          price: initialData.price || 0,
          description: initialData.description || "",
          shortDesc: initialData.shortDesc || "",
          image: initialData.image || "",
          images: Array.isArray(initialData.images) ? initialData.images : [],
          highlights: Array.isArray(initialData.highlights) ? initialData.highlights : [],
          itinerary: Array.isArray(initialData.itinerary) ? initialData.itinerary : [],
          included: Array.isArray(initialData.included) ? initialData.included : [],
          excluded: Array.isArray(initialData.excluded) ? initialData.excluded : [],
          minTravelers: initialData.minTravelers || 1,
          maxTravelers: initialData.maxTravelers || 10,
          difficulty: initialData.difficulty || "MODERATE",
          featured: initialData.featured || false,
          popular: initialData.popular || false,
          active: initialData.active !== undefined ? initialData.active : true,
        });
      } else if (mode === "create") {
        // Reset to default values for create mode
        setFormData({
          name: "",
          slug: "",
          category: "Wildlife Safari",
          duration: "",
          price: 0,
          description: "",
          shortDesc: "",
          image: "",
          images: [],
          highlights: [],
          itinerary: [],
          included: [],
          excluded: [],
          minTravelers: 1,
          maxTravelers: 10,
          difficulty: "MODERATE",
          featured: false,
          popular: false,
          active: true,
        });
      }
    }
  }, [open, initialData, mode]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleSave = async () => {
    // Client-side validation
    if (!formData.name || !formData.slug || !formData.category || !formData.duration || !formData.description) {
      alert("Please fill in all required fields (marked with *)");
      return;
    }

    if (!formData.image) {
      alert("Please select a main image for the package");
      return;
    }

    if (formData.itinerary.length === 0) {
      alert("Please add at least one itinerary day. Click 'Add Day' in the Itinerary section.");
      return;
    }

    // Check if all itinerary days have title and description
    const incompleteDay = formData.itinerary.find(day => !day.title || !day.description);
    if (incompleteDay) {
      alert(`Please complete Day ${incompleteDay.day}: both title and description are required`);
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const addIncluded = () => {
    if (newIncluded.trim()) {
      setFormData(prev => ({
        ...prev,
        included: [...prev.included, newIncluded.trim()],
      }));
      setNewIncluded("");
    }
  };

  const removeIncluded = (index: number) => {
    setFormData(prev => ({
      ...prev,
      included: prev.included.filter((_, i) => i !== index),
    }));
  };

  const addExcluded = () => {
    if (newExcluded.trim()) {
      setFormData(prev => ({
        ...prev,
        excluded: [...prev.excluded, newExcluded.trim()],
      }));
      setNewExcluded("");
    }
  };

  const removeExcluded = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excluded: prev.excluded.filter((_, i) => i !== index),
    }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", description: "" },
      ],
    }));
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((item, i) => ({
        ...item,
        day: i + 1,
      })),
    }));
  };

  const addImage = (imageUrl: string) => {
    if (imagePickerTarget === "main") {
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create New Package" : "Edit Package"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="14-Days North, West & South Uganda"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (auto-generated)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="14-days-north-west-south-uganda"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category*</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wildlife Safari">Wildlife Safari</SelectItem>
                      <SelectItem value="Primate Safari">Primate Safari</SelectItem>
                      <SelectItem value="Adventure Safari">Adventure Safari</SelectItem>
                      <SelectItem value="Cultural Safari">Cultural Safari</SelectItem>
                      <SelectItem value="Luxury Safari">Luxury Safari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration*</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="14 Days"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (USD)*</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="2500"
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level*</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: DifficultyLevel) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MODERATE">Moderate</SelectItem>
                      <SelectItem value="CHALLENGING">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minTravelers">Min Travelers*</Label>
                  <Input
                    id="minTravelers"
                    type="number"
                    value={formData.minTravelers}
                    onChange={(e) => setFormData({ ...formData, minTravelers: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <Label htmlFor="maxTravelers">Max Travelers*</Label>
                  <Input
                    id="maxTravelers"
                    type="number"
                    value={formData.maxTravelers}
                    onChange={(e) => setFormData({ ...formData, maxTravelers: parseInt(e.target.value) || 10 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shortDesc">Short Description</Label>
                <Textarea
                  id="shortDesc"
                  value={formData.shortDesc || ""}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Brief description for cards (150 characters)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed package description"
                  rows={5}
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Package</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                  />
                  <Label htmlFor="popular">Popular Package</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>

              <div>
                <Label>Main Image*</Label>
                <div className="mt-2">
                  {formData.image ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.image}
                        alt="Main"
                        className="w-40 h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1"
                        onClick={() => setFormData({ ...formData, image: "" })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImagePickerTarget("main");
                        setImagePickerOpen(true);
                      }}
                    >
                      Select Main Image
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label>Gallery Images</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-24 h-20 object-cover rounded"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-0 right-0 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImagePickerTarget("gallery");
                      setImagePickerOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Gallery Image
                  </Button>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Highlights</h3>

              <div className="space-y-2">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={highlight} disabled className="flex-1" />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeHighlight(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <Input
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Add a highlight"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                  />
                  <Button size="sm" onClick={addHighlight}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Itinerary</h3>

              <div className="space-y-4">
                {formData.itinerary.map((day, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Day {day.day}</Label>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItineraryDay(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Input
                      value={day.title}
                      onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                      placeholder="Day title"
                    />

                    <Textarea
                      value={day.description}
                      onChange={(e) => updateItineraryDay(index, "description", e.target.value)}
                      placeholder="Day description"
                      rows={3}
                    />
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addItineraryDay}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Day
                </Button>
              </div>
            </div>

            {/* Included */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's Included</h3>

              <div className="space-y-2">
                {formData.included.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={item} disabled className="flex-1" />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeIncluded(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <Input
                    value={newIncluded}
                    onChange={(e) => setNewIncluded(e.target.value)}
                    placeholder="Add included item"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIncluded())}
                  />
                  <Button size="sm" onClick={addIncluded}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Excluded */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's Excluded</h3>

              <div className="space-y-2">
                {formData.excluded.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={item} disabled className="flex-1" />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeExcluded(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <Input
                    value={newExcluded}
                    onChange={(e) => setNewExcluded(e.target.value)}
                    placeholder="Add excluded item"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExcluded())}
                  />
                  <Button size="sm" onClick={addExcluded}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Package" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Picker Modal */}
      <ImagePicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={addImage}
      />
    </>
  );
}
