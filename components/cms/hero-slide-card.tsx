"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  displayOrder: number;
  active: boolean;
}

interface HeroSlideCardProps {
  slide: HeroSlide;
  onEdit: (slide: HeroSlide) => void;
  onDelete: (id: string) => void;
}

export function HeroSlideCard({
  slide,
  onEdit,
  onDelete,
}: HeroSlideCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing self-start sm:self-center"
          >
            <GripVertical className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-foreground transition-colors" />
          </div>

          {/* Image Preview */}
          <div className="relative w-full sm:w-32 h-24 sm:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={slide.image}
              alt={slide.subtitle}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-base sm:text-lg truncate">
                    {slide.subtitle}
                  </h3>
                  {slide.active ? (
                    <Badge variant="default" className="gap-1 flex-shrink-0 text-xs">
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">Active</span>
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 flex-shrink-0 text-xs">
                      <EyeOff className="h-3 w-3" />
                      <span className="hidden sm:inline">Hidden</span>
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1">
                  {slide.title}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(slide)}
              className="gap-2 flex-1 sm:flex-initial"
            >
              <Edit className="h-4 w-4" />
              <span className="sm:inline">Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(slide.id)}
              className="flex-1 sm:flex-initial"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sm:hidden">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
