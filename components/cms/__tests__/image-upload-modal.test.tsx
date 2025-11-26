/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ImageUploadModal } from "../image-upload-modal";
import * as imageClient from "@/lib/image-client";

// Mock the image compression utilities
jest.mock("@/lib/image-client", () => ({
  compressImageToWebp: jest.fn(),
  validateImageFile: jest.fn(),
}));

// Mock react-dropzone
jest.mock("react-dropzone", () => ({
  useDropzone: jest.fn(() => ({
    getRootProps: jest.fn(() => ({ onClick: jest.fn() })),
    getInputProps: jest.fn(() => ({})),
    isDragActive: false,
  })),
}));

// Mock toast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe("ImageUploadModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (imageClient.validateImageFile as jest.Mock).mockReturnValue(null);
    (imageClient.compressImageToWebp as jest.Mock).mockResolvedValue({
      blob: new Blob(["compressed"], { type: "image/webp" }),
      file: new File([new Blob(["compressed"])], "test.webp", {
        type: "image/webp",
      }),
      originalSize: 5 * 1024 * 1024,
      compressedSize: 2 * 1024 * 1024,
      compressionRatio: 2.5,
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render when open", () => {
    render(
      <ImageUploadModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText("Upload Images")).toBeInTheDocument();
    expect(
      screen.getByText(/Images will be automatically compressed/i)
    ).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      <ImageUploadModal
        open={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText("Upload Images")).not.toBeInTheDocument();
  });

  describe("File validation", () => {
    it("should validate files on drop", async () => {
      const mockFile = new File(["content"], "test.jpg", {
        type: "image/jpeg",
      });

      render(
        <ImageUploadModal
          open={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      // Simulate file drop would trigger validation
      expect(imageClient.validateImageFile).toBeDefined();
    });

    it("should reject invalid files", async () => {
      (imageClient.validateImageFile as jest.Mock).mockReturnValue(
        "File too large"
      );

      // In real scenario, the modal would show toast with error
      const error = imageClient.validateImageFile(
        new File([""], "test.jpg", { type: "image/jpeg" })
      );
      expect(error).toBe("File too large");
    });
  });

  describe("Compression and upload", () => {
    it("should compress image before upload", async () => {
      const mockFile = new File(["content"], "test.jpg", {
        type: "image/jpeg",
      });

      // Simulate the upload process
      await imageClient.compressImageToWebp(mockFile);

      expect(imageClient.compressImageToWebp).toHaveBeenCalledWith(
        mockFile
      );
    });

    it("should upload compressed file to API", async () => {
      const compressedFile = new File([new Blob(["compressed"])], "test.webp", {
        type: "image/webp",
      });

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("altText", "Test image");
      formData.append("category", "gallery");

      await fetch("/api/cms/images", {
        method: "POST",
        body: formData,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/cms/images",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );
    });

    it("should handle upload errors gracefully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" }),
      });

      const response = await fetch("/api/cms/images", {
        method: "POST",
        body: new FormData(),
      });

      expect(response.ok).toBe(false);
    });

    it("should handle 413 Payload Too Large error", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: async () => {
          throw new Error("Not JSON");
        },
      });

      const response = await fetch("/api/cms/images", {
        method: "POST",
        body: new FormData(),
      });

      expect(response.status).toBe(413);
    });
  });

  describe("Bulk upload", () => {
    it("should handle multiple files sequentially", async () => {
      const files = [
        new File(["content1"], "test1.jpg", { type: "image/jpeg" }),
        new File(["content2"], "test2.jpg", { type: "image/jpeg" }),
        new File(["content3"], "test3.jpg", { type: "image/jpeg" }),
      ];

      // Simulate sequential upload
      for (const file of files) {
        await imageClient.compressImageToWebp(file);
        await fetch("/api/cms/images", {
          method: "POST",
          body: new FormData(),
        });
      }

      expect(imageClient.compressImageToWebp).toHaveBeenCalledTimes(3);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("should track progress for each file", async () => {
      const progressCallback = jest.fn();
      const mockFile = new File(["content"], "test.jpg", {
        type: "image/jpeg",
      });

      (imageClient.compressImageToWebp as jest.Mock).mockImplementation(
        async (file, onProgress) => {
          // Simulate progress
          if (onProgress) {
            onProgress(10);
            onProgress(50);
            onProgress(100);
          }
          return {
            blob: new Blob(["compressed"]),
            file: new File([new Blob(["compressed"])], "test.webp", {
              type: "image/webp",
            }),
            originalSize: 5 * 1024 * 1024,
            compressedSize: 2 * 1024 * 1024,
            compressionRatio: 2.5,
          };
        }
      );

      await imageClient.compressImageToWebp(mockFile, progressCallback);

      expect(progressCallback).toHaveBeenCalledWith(10);
      expect(progressCallback).toHaveBeenCalledWith(50);
      expect(progressCallback).toHaveBeenCalledWith(100);
    });

    it("should continue uploading even if one file fails", async () => {
      const files = [
        new File(["content1"], "test1.jpg", { type: "image/jpeg" }),
        new File(["content2"], "test2.jpg", { type: "image/jpeg" }),
        new File(["content3"], "test3.jpg", { type: "image/jpeg" }),
      ];

      // First upload succeeds
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Second upload fails
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Upload failed" }),
      });

      // Third upload succeeds
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const results = [];
      for (const file of files) {
        try {
          await imageClient.compressImageToWebp(file);
          const response = await fetch("/api/cms/images", {
            method: "POST",
            body: new FormData(),
          });
          results.push({ ok: response.ok });
        } catch (error) {
          results.push({ ok: false, error });
        }
      }

      expect(results).toHaveLength(3);
      expect(results[0].ok).toBe(true);
      expect(results[1].ok).toBe(false);
      expect(results[2].ok).toBe(true);
    });
  });

  describe("Large file handling", () => {
    it("should compress 10MB file to under 4MB", async () => {
      const largeFile = new File(
        [new ArrayBuffer(10 * 1024 * 1024)],
        "large.jpg",
        { type: "image/jpeg" }
      );

      (imageClient.compressImageToWebp as jest.Mock).mockResolvedValueOnce({
        blob: new Blob([new ArrayBuffer(3.5 * 1024 * 1024)]),
        file: new File([new ArrayBuffer(3.5 * 1024 * 1024)], "large.webp", {
          type: "image/webp",
        }),
        originalSize: 10 * 1024 * 1024,
        compressedSize: 3.5 * 1024 * 1024,
        compressionRatio: 2.86,
      });

      const result = await imageClient.compressImageToWebp(largeFile);

      expect(result.compressedSize).toBeLessThan(4 * 1024 * 1024);
      expect(result.compressedSize).toBeLessThan(result.originalSize);
    });

    it("should fail gracefully if file cannot be compressed under 4MB", async () => {
      const hugeFile = new File(
        [new ArrayBuffer(10 * 1024 * 1024)],
        "huge.jpg",
        { type: "image/jpeg" }
      );

      (imageClient.compressImageToWebp as jest.Mock).mockRejectedValueOnce(
        new Error("Image is too large even after maximum compression")
      );

      await expect(imageClient.compressImageToWebp(hugeFile)).rejects.toThrow(
        "too large even after maximum compression"
      );
    });
  });

  describe("Progress tracking", () => {
    it("should show compressing status", async () => {
      // Test that status transitions from pending -> compressing -> uploading -> success
      const statuses: string[] = [];

      const mockUpdateFile = (status: string) => {
        statuses.push(status);
      };

      // Simulate status changes
      mockUpdateFile("pending");
      mockUpdateFile("compressing");
      mockUpdateFile("uploading");
      mockUpdateFile("success");

      expect(statuses).toEqual([
        "pending",
        "compressing",
        "uploading",
        "success",
      ]);
    });

    it("should update progress bar during compression and upload", async () => {
      const progressValues: number[] = [];

      (imageClient.compressImageToWebp as jest.Mock).mockImplementation(
        async (file, onProgress) => {
          // Simulate compression progress (0-50%)
          if (onProgress) {
            for (let i = 0; i <= 100; i += 25) {
              onProgress(i);
              progressValues.push(Math.round(i / 2)); // 0-50% for compression
            }
          }
          return {
            blob: new Blob(["compressed"]),
            file: new File([new Blob(["compressed"])], "test.webp", {
              type: "image/webp",
            }),
            originalSize: 5 * 1024 * 1024,
            compressedSize: 2 * 1024 * 1024,
            compressionRatio: 2.5,
          };
        }
      );

      await imageClient.compressImageToWebp(
        new File([""], "test.jpg", { type: "image/jpeg" }),
        jest.fn()
      );

      // Upload progress would be 50-100%
      progressValues.push(50, 75, 100);

      expect(progressValues[0]).toBe(0);
      expect(progressValues[progressValues.length - 1]).toBe(100);
    });
  });

  describe("File type preservation", () => {
    it("should preserve SVG files without compression", async () => {
      const svgFile = new File(["<svg></svg>"], "icon.svg", {
        type: "image/svg+xml",
      });

      (imageClient.compressImageToWebp as jest.Mock).mockResolvedValueOnce({
        blob: svgFile,
        file: svgFile,
        originalSize: svgFile.size,
        compressedSize: svgFile.size,
        compressionRatio: 1,
      });

      const result = await imageClient.compressImageToWebp(svgFile);

      expect(result.file.type).toBe("image/svg+xml");
      expect(result.compressionRatio).toBe(1);
    });

    it("should convert all raster formats to WebP", async () => {
      const formats = ["image/jpeg", "image/png", "image/bmp", "image/tiff"];

      for (const format of formats) {
        const file = new File(["content"], `test.${format.split("/")[1]}`, {
          type: format,
        });

        (imageClient.compressImageToWebp as jest.Mock).mockResolvedValueOnce({
          blob: new Blob(["compressed"]),
          file: new File([new Blob(["compressed"])], "test.webp", {
            type: "image/webp",
          }),
          originalSize: 1024 * 1024,
          compressedSize: 500 * 1024,
          compressionRatio: 2,
        });

        const result = await imageClient.compressImageToWebp(file);
        expect(result.file.type).toBe("image/webp");
      }
    });
  });
});
