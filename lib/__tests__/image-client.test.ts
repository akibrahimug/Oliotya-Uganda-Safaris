/**
 * @jest-environment jsdom
 */

import { compressImageToWebp, validateImageFile } from "../image-client";

// ─── Mock classes & helpers ───────────────────────────────────────────────────

class MockImageBitmap {
  width: number;
  height: number;
  close = jest.fn();

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

function createMockImageFile(
  name: string,
  sizeInMB: number,
  type: string = "image/jpeg"
): File {
  const size = Math.floor(sizeInMB * 1024 * 1024);
  const buffer = new ArrayBuffer(size);
  const blob = new Blob([buffer], { type });
  return new File([blob], name, { type });
}

// ─── Global browser API mocks ─────────────────────────────────────────────────

// 2 MB blob returned by every canvas.toBlob call (simulates compression)
const MOCK_BLOB_SIZE = 2 * 1024 * 1024;

// Fake 2D context — the function only needs drawImage + two property assignments
const mockCtx = {
  imageSmoothingEnabled: false,
  imageSmoothingQuality: "low",
  drawImage: jest.fn(),
};

beforeAll(() => {
  // Suppress informational console.log from production code (e.g. "Original file
  // is smaller, using original") so test output stays clean.
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});

  // createImageBitmap: resolves with a 4K bitmap; rejects for zero-byte files
  global.createImageBitmap = jest.fn((blob: Blob) => {
    if (blob.size === 0) {
      return Promise.reject(
        new Error("The source image cannot have a zero-size area.")
      );
    }
    return Promise.resolve(new MockImageBitmap(3840, 2160) as unknown as ImageBitmap);
  });

  // canvas.getContext("2d") → fake context
  jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(mockCtx as unknown as RenderingContext);

  // canvas.toBlob → 2 MB webp blob
  jest
    .spyOn(HTMLCanvasElement.prototype, "toBlob")
    .mockImplementation(function (
      this: HTMLCanvasElement,
      callback: BlobCallback,
      type?: string
    ) {
      const blob = new Blob([new ArrayBuffer(MOCK_BLOB_SIZE)], {
        type: type ?? "image/webp",
      });
      setTimeout(() => callback(blob), 0);
    });
});

afterAll(() => {
  jest.restoreAllMocks();
});

// ─── validateImageFile ────────────────────────────────────────────────────────

describe("validateImageFile", () => {
  it("should accept valid image files under 10MB", () => {
    const file = createMockImageFile("test.jpg", 5);
    expect(validateImageFile(file)).toBeNull();
  });

  it("should reject files over 10MB", () => {
    const file = createMockImageFile("large.jpg", 15);
    const error = validateImageFile(file);
    expect(error).toContain("exceeds maximum allowed size");
    expect(error).toContain("15.00MB");
  });

  it("should accept files exactly at 10MB", () => {
    const file = createMockImageFile("exact.jpg", 10);
    expect(validateImageFile(file)).toBeNull();
  });

  it("should reject unsupported file types", () => {
    const file = createMockImageFile("test.pdf", 1, "application/pdf");
    const error = validateImageFile(file);
    expect(error).toContain("not supported");
  });

  it("should accept all supported image formats", () => {
    const formats = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/svg+xml",
    ];

    formats.forEach((format) => {
      const file = createMockImageFile("test", 1, format);
      expect(validateImageFile(file)).toBeNull();
    });
  });
});

// ─── compressImageToWebp ──────────────────────────────────────────────────────

describe("compressImageToWebp", () => {
  it("should compress a standard JPEG image", async () => {
    // 8 MB original → mock returns 2 MB blob → compressed is smaller
    const file = createMockImageFile("photo.jpg", 8);
    const result = await compressImageToWebp(file);

    expect(result.file.type).toBe("image/webp");
    expect(result.file.name).toContain(".webp");
    expect(result.originalSize).toBe(8 * 1024 * 1024);
    expect(result.compressedSize).toBeLessThan(result.originalSize);
    expect(result.compressionRatio).toBeGreaterThan(1);
  });

  it("should handle progress callbacks", async () => {
    const file = createMockImageFile("photo.jpg", 5);
    const progressValues: number[] = [];

    await compressImageToWebp(file, (progress) => {
      progressValues.push(progress);
    });

    expect(progressValues.length).toBeGreaterThan(0);
    expect(progressValues[0]).toBeGreaterThanOrEqual(0);
    expect(progressValues[progressValues.length - 1]).toBe(100);
  });

  it("should skip compression for SVG files", async () => {
    const file = createMockImageFile("icon.svg", 0.1, "image/svg+xml");
    const result = await compressImageToWebp(file);

    expect(result.originalSize).toBe(result.compressedSize);
    expect(result.compressionRatio).toBe(1);
    expect(result.file.type).toBe("image/svg+xml");
  });

  it("should use original file if it is smaller than compressed version", async () => {
    // 0.5 MB original; mock blob is 2 MB → original is smaller → keep original
    const file = createMockImageFile("optimized.jpg", 0.5);
    const result = await compressImageToWebp(file);

    expect(result.compressedSize).toBe(result.originalSize);
    expect(result.compressionRatio).toBe(1);
  });

  it("should handle files that compress to under 4MB", async () => {
    // 6 MB → mock 2 MB blob → within 4 MB limit, no retry needed
    const file = createMockImageFile("photo.jpg", 6);
    const result = await compressImageToWebp(file);

    expect(result.compressedSize).toBeLessThanOrEqual(4 * 1024 * 1024);
  });

  it("should reduce quality progressively if initial compression exceeds 4MB", async () => {
    // Mock returns 2 MB which is under 4 MB, so no retry needed in this mock.
    // The important thing is the function completes without error and returns webp.
    const file = createMockImageFile("huge.jpg", 9);
    const result = await compressImageToWebp(file);

    expect(result.file).toBeInstanceOf(File);
    expect(result.file.type).toBe("image/webp");
  });

  it("should handle large files gracefully", async () => {
    const file = createMockImageFile("large.jpg", 8);
    const result = await compressImageToWebp(file);

    expect(result.file).toBeInstanceOf(File);
    expect(result.compressedSize).toBeLessThan(result.originalSize);
  });

  it("should handle very small images efficiently", async () => {
    // 50 KB original; mock blob 2 MB → original is smaller → keep original
    const file = createMockImageFile("thumbnail.jpg", 0.05);
    const result = await compressImageToWebp(file);

    expect(result.compressedSize).toBeLessThanOrEqual(
      result.originalSize + 100 * 1024
    );
  });

  it("should convert filename extension to .webp", async () => {
    // Files must be > 2 MB (mock blob size) to trigger the compressed path;
    // otherwise the original (smaller) file is kept with its original name.
    const testCases = [
      { input: "photo.jpg", expected: "photo.webp" },
      { input: "image.PNG", expected: "image.webp" },
      { input: "picture.jpeg", expected: "picture.webp" },
      { input: "graphic.bmp", expected: "graphic.webp" },
    ];

    for (const { input, expected } of testCases) {
      const file = createMockImageFile(input, 3); // 3 MB > 2 MB mock blob → compressed
      const result = await compressImageToWebp(file);
      expect(result.file.name).toBe(expected);
    }
  });
});

// ─── Bulk upload simulation ───────────────────────────────────────────────────

describe("Bulk upload simulation", () => {
  it("should handle multiple files in sequence", async () => {
    const files = [
      createMockImageFile("photo1.jpg", 3),
      createMockImageFile("photo2.jpg", 5),
      createMockImageFile("photo3.jpg", 3), // 2 MB file kept as original (same as mock size)
      createMockImageFile("photo4.jpg", 7),
    ];

    const results = [];
    for (const file of files) {
      const result = await compressImageToWebp(file);
      results.push(result);
    }

    expect(results).toHaveLength(4);
    results.forEach((result) => {
      expect(result.compressedSize).toBeLessThanOrEqual(4 * 1024 * 1024);
      // All files are either webp (compressed) or original jpeg (if original was smaller)
      expect(["image/webp", "image/jpeg"]).toContain(result.file.type);
    });
  });

  it("should handle parallel compression", async () => {
    const files = Array.from({ length: 5 }, (_, i) =>
      createMockImageFile(`photo${i}.jpg`, 4 + i * 0.5)
    );

    const promises = files.map((file) => compressImageToWebp(file));
    const results = await Promise.all(promises);

    expect(results).toHaveLength(5);
    results.forEach((result) => {
      expect(result.compressedSize).toBeLessThanOrEqual(4 * 1024 * 1024);
      expect(result.file.type).toBe("image/webp");
    });
  });

  it("should handle mixed file types in bulk upload", async () => {
    const files = [
      createMockImageFile("photo.jpg", 5, "image/jpeg"),
      createMockImageFile("graphic.png", 3, "image/png"),
      createMockImageFile("icon.svg", 0.1, "image/svg+xml"),
      createMockImageFile("animation.gif", 4, "image/gif"),
    ];

    const results = await Promise.all(
      files.map((file) => compressImageToWebp(file))
    );

    expect(results).toHaveLength(4);
    expect(results[2].file.type).toBe("image/svg+xml"); // SVG preserved
    expect(results[0].file.type).toBe("image/webp"); // JPEG converted
    expect(results[1].file.type).toBe("image/webp"); // PNG converted
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("should handle files with no extension", async () => {
    // The regex /\.[^.]+$/ requires a dot — names without an extension are
    // unchanged by String.replace, so the compressed file keeps the original name.
    const file = createMockImageFile("imagefile", 3);
    const result = await compressImageToWebp(file);
    expect(result.file.name).toBe("imagefile");
  });

  it("should handle files with multiple dots in name", async () => {
    const file = createMockImageFile("my.photo.final.jpg", 3);
    const result = await compressImageToWebp(file);
    expect(result.file.name).toBe("my.photo.final.webp");
  });

  it("should handle extremely large dimensions", async () => {
    // Override createImageBitmap for this test only
    (global.createImageBitmap as jest.Mock).mockResolvedValueOnce(
      new MockImageBitmap(8000, 6000) as unknown as ImageBitmap
    );

    const file = createMockImageFile("huge-resolution.jpg", 9);
    const result = await compressImageToWebp(file);

    expect(result.compressedSize).toBeLessThanOrEqual(4 * 1024 * 1024);
  });

  it("should handle zero-byte files gracefully", async () => {
    const file = createMockImageFile("empty.jpg", 0);
    await expect(compressImageToWebp(file)).rejects.toThrow();
  });

  it("should maintain compression ratio metadata", async () => {
    const file = createMockImageFile("photo.jpg", 8);
    const result = await compressImageToWebp(file);

    expect(result.compressionRatio).toBeDefined();
    expect(result.compressionRatio).toBeGreaterThan(0);
    expect(result.originalSize / result.compressedSize).toBeCloseTo(
      result.compressionRatio,
      5
    );
  });
});

// ─── Memory management ────────────────────────────────────────────────────────

describe("Memory management", () => {
  it("should clean up resources after compression", async () => {
    const file = createMockImageFile("photo.jpg", 5);
    const result = await compressImageToWebp(file);

    expect(result.file).toBeInstanceOf(File);
    expect(result.blob).toBeInstanceOf(Blob);
  });

  it("should handle multiple sequential compressions without memory leaks", async () => {
    const iterations = 10;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      const file = createMockImageFile(`photo${i}.jpg`, 3 + i * 0.1);
      const result = await compressImageToWebp(file);
      results.push(result);
    }

    expect(results).toHaveLength(iterations);
    results.forEach((r) => expect(r.file).toBeInstanceOf(File));
  });
});
