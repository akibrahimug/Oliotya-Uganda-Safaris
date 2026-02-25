"use client";

import { AlertCircle } from "lucide-react";

interface FormErrorMessageProps {
  message?: string;
  id?: string;
  className?: string;
}

export function FormErrorMessage({ message, id, className }: FormErrorMessageProps) {
  if (!message) return null;
  return (
    <div
      id={id}
      className={`flex items-center gap-1 text-sm text-destructive font-medium${className ? ` ${className}` : ""}`}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
