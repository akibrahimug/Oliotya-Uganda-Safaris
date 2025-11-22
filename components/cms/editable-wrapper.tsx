"use client";

import { ReactNode } from "react";
import { Edit } from "lucide-react";

interface EditableWrapperProps {
  children: ReactNode;
  onEdit: () => void;
  label: string;
  className?: string;
}

/**
 * Wrapper component that makes any content editable in CMS
 * Shows an edit overlay on hover
 */
export function EditableWrapper({
  children,
  onEdit,
  label,
  className = "",
}: EditableWrapperProps) {
  return (
    <div className={`relative group ${className}`}>
      {children}

      {/* Edit overlay - appears on hover */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-primary/50 rounded-sm z-40">
        <div className="absolute top-2 right-2 pointer-events-auto z-50">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Edit className="h-4 w-4" />
            Edit {label}
          </button>
        </div>
      </div>

      {/* Always visible edit button in top-right corner */}
      <div className="absolute top-2 right-2 z-50 opacity-50 group-hover:opacity-0 transition-opacity pointer-events-auto">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center gap-1 px-2 py-1 bg-primary/80 text-primary-foreground text-xs font-medium rounded-md shadow-lg hover:bg-primary hover:scale-105 transition-all backdrop-blur-sm"
        >
          <Edit className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
