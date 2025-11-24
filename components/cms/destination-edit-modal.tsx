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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DestinationData {
  id?: number;
  name: string;
  category: string;
  country: string;
  region?: string;
  price: number;
  rating: number;
  duration: string;
  groupSize: number;
  minTravelers: number;
  maxTravelers: number;
  description: string;
  image: string;
  images: string[];
  // History
  historyTitle?: string;
  historyContent: string[];
  // Geography
  geographyDescription?: string;
  geographyClimate?: string;
  // Wildlife
  wildlifeDescription?: string;
  wildlifeMammals: string[];
  wildlifeBirds: string[];
  wildlifeFlora: string[];
  // Culture
  cultureDescription?: string;
  cultureExperiences: string[];
  // Best time to visit
  bestTimeDescription?: string;
  drySeasonTitle?: string;
  drySeasonDescription?: string;
  wetSeasonTitle?: string;
  wetSeasonDescription?: string;
}

interface DestinationEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DestinationData) => Promise<void>;
  initialData?: DestinationData | null;
  mode: "create" | "edit";
}

export function DestinationEditModal({
  open,
  onClose,
  onSave,
  initialData,
  mode,
}: DestinationEditModalProps) {
  const [formData, setFormData] = useState<DestinationData>({
    name: "",
    category: "National Park",
    country: "Uganda",
    region: "",
    price: 0,
    rating: 5,
    duration: "3 Days",
    groupSize: 10,
    minTravelers: 1,
    maxTravelers: 10,
    description: "",
    image: "",
    images: [],
    historyTitle: "",
    historyContent: [],
    geographyDescription: "",
    geographyClimate: "",
    wildlifeDescription: "",
    wildlifeMammals: [],
    wildlifeBirds: [],
    wildlifeFlora: [],
    cultureDescription: "",
    cultureExperiences: [],
    bestTimeDescription: "",
    drySeasonTitle: "",
    drySeasonDescription: "",
    wetSeasonTitle: "",
    wetSeasonDescription: "",
  });
  const [saving, setSaving] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<"main" | "gallery">("main");

  // Input states for dynamic arrays
  const [newHistoryContent, setNewHistoryContent] = useState("");
  const [newMammal, setNewMammal] = useState("");
  const [newBird, setNewBird] = useState("");
  const [newFlora, setNewFlora] = useState("");
  const [newExperience, setNewExperience] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
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

  // Helper functions for array management
  const addToArray = (field: keyof DestinationData, value: string, clearFn: () => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
      clearFn();
    }
  };

  const removeFromArray = (field: keyof DestinationData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create New Destination" : "Edit Destination"}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="visit">Best Time</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Destination Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Bwindi Impenetrable National Park"
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
                      <SelectItem value="National Park">National Park</SelectItem>
                      <SelectItem value="Wildlife Reserve">Wildlife Reserve</SelectItem>
                      <SelectItem value="Cultural Site">Cultural Site</SelectItem>
                      <SelectItem value="Adventure Site">Adventure Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="country">Country*</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Uganda"
                  />
                </div>

                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region || ""}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Southwestern Uganda"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration*</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="3 Days"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (USD)*</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="500"
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating (1-5)*</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  />
                </div>

                <div>
                  <Label htmlFor="groupSize">Group Size*</Label>
                  <Input
                    id="groupSize"
                    type="number"
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) || 10 })}
                  />
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
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed destination description"
                  rows={5}
                />
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
            </TabsContent>

            {/* Content Tab - History & Geography */}
            <TabsContent value="content" className="space-y-6">
              {/* History Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">History</h3>

                <div>
                  <Label htmlFor="historyTitle">History Title</Label>
                  <Input
                    id="historyTitle"
                    value={formData.historyTitle || ""}
                    onChange={(e) => setFormData({ ...formData, historyTitle: e.target.value })}
                    placeholder="The Story of..."
                  />
                </div>

                <div>
                  <Label>History Content (Paragraphs)</Label>
                  <div className="space-y-2">
                    {formData.historyContent.map((paragraph, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Textarea
                          value={paragraph}
                          disabled
                          className="flex-1"
                          rows={2}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromArray("historyContent", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="flex items-start gap-2">
                      <Textarea
                        value={newHistoryContent}
                        onChange={(e) => setNewHistoryContent(e.target.value)}
                        placeholder="Add a history paragraph"
                        rows={2}
                      />
                      <Button
                        size="sm"
                        onClick={() => addToArray("historyContent", newHistoryContent, () => setNewHistoryContent(""))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geography Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Geography</h3>

                <div>
                  <Label htmlFor="geographyDescription">Geography Description</Label>
                  <Textarea
                    id="geographyDescription"
                    value={formData.geographyDescription || ""}
                    onChange={(e) => setFormData({ ...formData, geographyDescription: e.target.value })}
                    placeholder="Describe the geography..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="geographyClimate">Climate</Label>
                  <Textarea
                    id="geographyClimate"
                    value={formData.geographyClimate || ""}
                    onChange={(e) => setFormData({ ...formData, geographyClimate: e.target.value })}
                    placeholder="Describe the climate..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Wildlife Tab */}
            <TabsContent value="wildlife" className="space-y-6">
              <div>
                <Label htmlFor="wildlifeDescription">Wildlife Overview</Label>
                <Textarea
                  id="wildlifeDescription"
                  value={formData.wildlifeDescription || ""}
                  onChange={(e) => setFormData({ ...formData, wildlifeDescription: e.target.value })}
                  placeholder="General wildlife description..."
                  rows={4}
                />
              </div>

              {/* Mammals */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mammals</h3>
                <div className="space-y-2">
                  {formData.wildlifeMammals.map((mammal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={mammal} disabled className="flex-1" />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromArray("wildlifeMammals", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <Input
                      value={newMammal}
                      onChange={(e) => setNewMammal(e.target.value)}
                      placeholder="Add a mammal species"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("wildlifeMammals", newMammal, () => setNewMammal("")))}
                    />
                    <Button
                      size="sm"
                      onClick={() => addToArray("wildlifeMammals", newMammal, () => setNewMammal(""))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Birds */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Birds</h3>
                <div className="space-y-2">
                  {formData.wildlifeBirds.map((bird, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={bird} disabled className="flex-1" />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromArray("wildlifeBirds", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <Input
                      value={newBird}
                      onChange={(e) => setNewBird(e.target.value)}
                      placeholder="Add a bird species"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("wildlifeBirds", newBird, () => setNewBird("")))}
                    />
                    <Button
                      size="sm"
                      onClick={() => addToArray("wildlifeBirds", newBird, () => setNewBird(""))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Flora */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Flora</h3>
                <div className="space-y-2">
                  {formData.wildlifeFlora.map((flora, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={flora} disabled className="flex-1" />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromArray("wildlifeFlora", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <Input
                      value={newFlora}
                      onChange={(e) => setNewFlora(e.target.value)}
                      placeholder="Add a plant species"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("wildlifeFlora", newFlora, () => setNewFlora("")))}
                    />
                    <Button
                      size="sm"
                      onClick={() => addToArray("wildlifeFlora", newFlora, () => setNewFlora(""))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Culture Tab */}
            <TabsContent value="culture" className="space-y-6">
              <div>
                <Label htmlFor="cultureDescription">Culture Overview</Label>
                <Textarea
                  id="cultureDescription"
                  value={formData.cultureDescription || ""}
                  onChange={(e) => setFormData({ ...formData, cultureDescription: e.target.value })}
                  placeholder="Describe the cultural aspects..."
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cultural Experiences</h3>
                <div className="space-y-2">
                  {formData.cultureExperiences.map((experience, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={experience} disabled className="flex-1" />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromArray("cultureExperiences", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <Input
                      value={newExperience}
                      onChange={(e) => setNewExperience(e.target.value)}
                      placeholder="Add a cultural experience"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("cultureExperiences", newExperience, () => setNewExperience("")))}
                    />
                    <Button
                      size="sm"
                      onClick={() => addToArray("cultureExperiences", newExperience, () => setNewExperience(""))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Best Time to Visit Tab */}
            <TabsContent value="visit" className="space-y-6">
              <div>
                <Label htmlFor="bestTimeDescription">Best Time Overview</Label>
                <Textarea
                  id="bestTimeDescription"
                  value={formData.bestTimeDescription || ""}
                  onChange={(e) => setFormData({ ...formData, bestTimeDescription: e.target.value })}
                  placeholder="General information about best times to visit..."
                  rows={3}
                />
              </div>

              {/* Dry Season */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dry Season</h3>

                <div>
                  <Label htmlFor="drySeasonTitle">Dry Season Title</Label>
                  <Input
                    id="drySeasonTitle"
                    value={formData.drySeasonTitle || ""}
                    onChange={(e) => setFormData({ ...formData, drySeasonTitle: e.target.value })}
                    placeholder="e.g., June to September"
                  />
                </div>

                <div>
                  <Label htmlFor="drySeasonDescription">Dry Season Description</Label>
                  <Textarea
                    id="drySeasonDescription"
                    value={formData.drySeasonDescription || ""}
                    onChange={(e) => setFormData({ ...formData, drySeasonDescription: e.target.value })}
                    placeholder="Describe the dry season..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Wet Season */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Wet Season</h3>

                <div>
                  <Label htmlFor="wetSeasonTitle">Wet Season Title</Label>
                  <Input
                    id="wetSeasonTitle"
                    value={formData.wetSeasonTitle || ""}
                    onChange={(e) => setFormData({ ...formData, wetSeasonTitle: e.target.value })}
                    placeholder="e.g., March to May"
                  />
                </div>

                <div>
                  <Label htmlFor="wetSeasonDescription">Wet Season Description</Label>
                  <Textarea
                    id="wetSeasonDescription"
                    value={formData.wetSeasonDescription || ""}
                    onChange={(e) => setFormData({ ...formData, wetSeasonDescription: e.target.value })}
                    placeholder="Describe the wet season..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Destination" : "Save Changes"}
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
