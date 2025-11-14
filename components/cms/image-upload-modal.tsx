"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadFile {
  file: File;
  altText: string;
  category: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export function ImageUploadModal({
  open,
  onClose,
  onSuccess,
}: ImageUploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      altText: "",
      category: "other",
      status: "pending" as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/avif": [".avif"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
      "image/tiff": [".tiff", ".tif"],
      "image/svg+xml": [".svg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const updateFile = (index: number, updates: Partial<UploadFile>) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...updates } : f))
    );
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];
      if (fileData.status !== "pending") continue;

      try {
        updateFile(i, { status: "uploading", progress: 0 });

        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("altText", fileData.altText);
        formData.append("category", fileData.category);

        const response = await fetch("/api/cms/images", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        updateFile(i, { status: "success", progress: 100 });
      } catch (error) {
        console.error("Upload error:", error);
        updateFile(i, {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }

    setUploading(false);

    // Check if all uploads succeeded
    const allSuccess = files.every((f) => f.status === "success");
    if (allSuccess) {
      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully`,
      });
      onSuccess();
      handleClose();
    } else {
      toast({
        title: "Upload Complete",
        description: "Some uploads failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      onClose();
    }
  };

  const pendingFiles = files.filter((f) => f.status === "pending").length;
  const successFiles = files.filter((f) => f.status === "success").length;
  const errorFiles = files.filter((f) => f.status === "error").length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Upload images to your gallery. All formats will be automatically converted to WebP. Maximum file size: 10MB
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          {!uploading && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-sm">Drop the files here...</p>
              ) : (
                <>
                  <p className="text-sm mb-1">
                    Drag & drop images here, or click to select files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF, SVG (max 10MB)
                  </p>
                  <p className="text-xs text-primary mt-1">
                    ✨ All images will be automatically optimized and converted to WebP
                  </p>
                </>
              )}
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  Files ({files.length})
                </h3>
                {!uploading && pendingFiles > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {files.map((fileData, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {fileData.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(fileData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    {fileData.status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {fileData.status === "error" && (
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                    {fileData.status === "pending" && !uploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {fileData.status === "uploading" && (
                    <Progress value={fileData.progress} className="h-2" />
                  )}

                  {fileData.status === "error" && (
                    <p className="text-xs text-destructive">
                      {fileData.error}
                    </p>
                  )}

                  {fileData.status === "pending" && !uploading && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`alt-${index}`} className="text-xs">
                          Alt Text
                        </Label>
                        <Input
                          id={`alt-${index}`}
                          value={fileData.altText}
                          onChange={(e) =>
                            updateFile(index, { altText: e.target.value })
                          }
                          placeholder="Image description"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`category-${index}`} className="text-xs">
                          Category
                        </Label>
                        <Select
                          value={fileData.category}
                          onValueChange={(value) =>
                            updateFile(index, { category: value })
                          }
                        >
                          <SelectTrigger id={`category-${index}`} className="h-9">
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
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">
              {uploading && (
                <span>
                  Uploading {successFiles + errorFiles + 1} of {files.length}...
                </span>
              )}
              {!uploading && successFiles > 0 && (
                <span className="text-green-600">
                  {successFiles} uploaded successfully
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} disabled={uploading}>
                {uploading ? "Uploading..." : "Cancel"}
              </Button>
              {files.length > 0 && pendingFiles > 0 && (
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : `Upload ${pendingFiles} File(s)`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
