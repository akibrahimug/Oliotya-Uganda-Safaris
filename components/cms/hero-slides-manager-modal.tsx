"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import { HeroSlideCard } from "@/components/cms/hero-slide-card";
import { HeroSlideModal } from "@/components/cms/hero-slide-modal";
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

interface HeroSlidesManagerModalProps {
  open: boolean;
  onClose: () => void;
}

export function HeroSlidesManagerModal({
  open,
  onClose,
}: HeroSlidesManagerModalProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cms/hero-slides");
      if (!response.ok) throw new Error("Failed to fetch slides");
      const data = await response.json();
      setSlides(data.slides || []);
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
    if (open) {
      fetchSlides();
    }
  }, [open]);

  const handleAddSlide = () => {
    setEditingSlide(null);
    setSlideModalOpen(true);
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideModalOpen(true);
  };

  const handleDeleteSlide = async (id: string) => {
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);

    const newSlides = arrayMove(slides, oldIndex, newIndex);
    setSlides(newSlides);

    // Update order on server
    try {
      const response = await fetch("/api/cms/hero-slides/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideIds: newSlides.map((s) => s.id),
        }),
      });

      if (!response.ok) throw new Error("Failed to reorder slides");

      toast({
        title: "Success",
        description: "Slide order updated",
      });
    } catch (error) {
      console.error("Error reordering slides:", error);
      toast({
        title: "Error",
        description: "Failed to update slide order",
        variant: "destructive",
      });
      fetchSlides(); // Revert to server state
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-7xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Manage Hero Slides</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Drag slides to reorder. Active slides will appear on the homepage.
              </p>
              <Button onClick={handleAddSlide} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add Slide
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : slides.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No hero slides yet</p>
                <Button onClick={handleAddSlide} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Slide
                </Button>
              </div>
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
                  <div className="space-y-3">
                    {slides.map((slide) => (
                      <HeroSlideCard
                        key={slide.id}
                        slide={slide}
                        onEdit={handleEditSlide}
                        onDelete={handleDeleteSlide}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <HeroSlideModal
        open={slideModalOpen}
        onClose={() => setSlideModalOpen(false)}
        onSuccess={() => {
          setSlideModalOpen(false);
          fetchSlides();
        }}
        slide={editingSlide}
      />
    </>
  );
}
