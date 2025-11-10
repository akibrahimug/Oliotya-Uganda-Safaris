"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, GripVertical } from "lucide-react";
import { HeroSlideCard } from "@/components/cms/hero-slide-card";
import { HeroSlideModal } from "@/components/cms/hero-slide-modal";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  displayOrder: number;
  active: boolean;
}

export default function HomePageEditor() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const { toast } = useToast();

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch slides
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cms/hero-slides");
      if (!response.ok) throw new Error("Failed to fetch slides");

      const data = await response.json();
      setSlides(data.slides);
    } catch (error) {
      console.error("Error fetching slides:", error);
      toast({
        title: "Error",
        description: "Failed to load hero slides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);

      const newSlides = arrayMove(slides, oldIndex, newIndex);
      setSlides(newSlides);

      // Update display orders
      const updates = newSlides.map((slide, index) => ({
        id: slide.id,
        displayOrder: index,
      }));

      try {
        const response = await fetch("/api/cms/hero-slides/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slides: updates }),
        });

        if (!response.ok) throw new Error("Failed to reorder slides");

        toast({
          title: "Success",
          description: "Slides reordered successfully",
        });
      } catch (error) {
        console.error("Error reordering slides:", error);
        toast({
          title: "Error",
          description: "Failed to reorder slides",
          variant: "destructive",
        });
        // Revert on error
        fetchSlides();
      }
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const response = await fetch(`/api/cms/hero-slides/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete slide");

      toast({
        title: "Success",
        description: "Slide deleted successfully",
      });

      fetchSlides();
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast({
        title: "Error",
        description: "Failed to delete slide",
        variant: "destructive",
      });
    }
  };

  // Handle edit
  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setEditingSlide(null);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    fetchSlides();
    handleModalClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Home Page - Hero Carousel</h1>
          <p className="text-muted-foreground">
            Manage the hero slides on your homepage
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Slide
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Tip:</strong> Drag and drop slides to reorder them. The first
          slide will be shown first on your homepage.
        </p>
      </Card>

      {/* Slides List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : slides.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <GripVertical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No hero slides yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first hero slide to get started
            </p>
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Slide
            </Button>
          </div>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {slides.map((slide) => (
                <HeroSlideCard
                  key={slide.id}
                  slide={slide}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal */}
      <HeroSlideModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        slide={editingSlide}
      />
    </div>
  );
}
