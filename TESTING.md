# Image Upload Testing Guide

This document outlines comprehensive testing procedures for the client-side image compression and upload system.

## Overview

The system compresses images on the client before uploading to avoid Vercel's 4.5MB serverless limit while allowing users to upload original files up to 10MB.

##  Automated Tests

### Unit Tests
Run validation tests:
```bash
npm test -- lib/__tests__/image-client.test.ts
```

### Integration Tests
Run modal tests:
```bash
npm test -- components/cms/__tests__/image-upload-modal.test.tsx
```

## Manual Testing Checklist

### 1. Single File Upload

#### Test Case 1.1: Small JPEG (< 1MB)
- [ ] Upload a 500KB JPEG
- [ ] Verify compression completes quickly
- [ ] Check compressed size is displayed
- [ ] Verify upload succeeds
- [ ] Check image appears in gallery

#### Test Case 1.2: Medium JPEG (2-5MB)
- [ ] Upload a 3MB JPEG
- [ ] Verify "Compressing image..." status shows
- [ ] Check progress bar updates smoothly
- [ ] Verify compressed size < original size
- [ ] Check compression ratio is displayed (e.g., "60% smaller")
- [ ] Verify upload succeeds

#### Test Case 1.3: Large JPEG (5-10MB)
- [ ] Upload an 8MB JPEG
- [ ] Verify compression takes longer but completes
- [ ] Check final compressed size is < 4MB
- [ ] Verify no 413 errors occur
- [ ] Check image quality is acceptable

#### Test Case 1.4: Very Large JPEG (> 10MB)
- [ ] Try to upload a 15MB JPEG
- [ ] Verify file is rejected before upload
- [ ] Check error message: "exceeds maximum allowed size (10MB)"

### 2. File Format Testing

#### Test Case 2.1: PNG Files
- [ ] Upload a 4MB PNG
- [ ] Verify it converts to WebP
- [ ] Check filename changes to .webp
- [ ] Verify significant size reduction

#### Test Case 2.2: SVG Files
- [ ] Upload an SVG icon (100KB)
- [ ] Verify SVG is NOT converted
- [ ] Check file type remains "image/svg+xml"
- [ ] Verify upload succeeds without compression

#### Test Case 2.3: Animated GIF
- [ ] Upload an animated GIF (2MB)
- [ ] Verify animation is detected
- [ ] Check GIF is NOT converted to WebP
- [ ] Verify animation still works after upload

#### Test Case 2.4: Static GIF
- [ ] Upload a non-animated GIF
- [ ] Verify it converts to WebP
- [ ] Check file size reduction

#### Test Case 2.5: WebP Files
- [ ] Upload a pre-compressed WebP file
- [ ] Verify it's used as-is if already optimized
- [ ] Check server logs show "Pre-compressed WebP uploaded as-is"

#### Test Case 2.6: Other Formats
- [ ] Test BMP → WebP conversion
- [ ] Test TIFF → WebP conversion
- [ ] Test AVIF handling

### 3. Bulk Upload Testing

#### Test Case 3.1: Upload 5 Files Simultaneously
- [ ] Select 5 different images (mix of sizes: 1MB, 3MB, 5MB, 2MB, 4MB)
- [ ] Click "Upload"
- [ ] Verify all files show in the list
- [ ] Check each file shows individual progress
- [ ] Verify compression happens for each file sequentially
- [ ] Check all files complete successfully
- [ ] Verify success count matches (5/5)

#### Test Case 3.2: Upload 10 Files
- [ ] Select 10 images
- [ ] Verify UI remains responsive
- [ ] Check memory usage doesn't spike excessively
- [ ] Verify all uploads complete

#### Test Case 3.3: Upload 20+ Files
- [ ] Select 25 images
- [ ] Monitor browser performance
- [ ] Verify no memory leaks
- [ ] Check all files process correctly
- [ ] Confirm database has all 25 images

#### Test Case 3.4: Mixed File Types in Bulk
- [ ] Upload mix: 3 JPEGs, 2 PNGs, 1 SVG, 1 GIF
- [ ] Verify each type is handled correctly
- [ ] Check SVG is not compressed
- [ ] Verify all other formats convert to WebP

### 4. Edge Cases

#### Test Case 4.1: Upload Same File Twice
- [ ] Upload "photo.jpg"
- [ ] Upload "photo.jpg" again
- [ ] Verify both are stored with unique names (timestamp)
- [ ] Check no conflicts occur

#### Test Case 4.2: Special Characters in Filename
- [ ] Upload "My Photo (2024) #1.jpg"
- [ ] Verify filename is sanitized
- [ ] Check file uploads successfully

#### Test Case 4.3: Very Long Filename
- [ ] Upload file with 200+ character name
- [ ] Verify it's handled gracefully
- [ ] Check database stores it correctly

#### Test Case 4.4: File with No Extension
- [ ] Try uploading "imagefile" (no extension)
- [ ] Verify it converts to .webp
- [ ] Check upload succeeds

#### Test Case 4.5: Extremely High Resolution
- [ ] Upload 8000x6000px image (10MB)
- [ ] Verify it resizes to max 3840px
- [ ] Check final file size < 4MB
- [ ] Verify dimensions are reduced

#### Test Case 4.6: Cancel During Upload
- [ ] Start uploading 5 files
- [ ] Click "Cancel" during compression
- [ ] Verify no partial uploads occur
- [ ] Check modal closes cleanly

### 5. Error Handling

#### Test Case 5.1: Network Failure
- [ ] Start upload
- [ ] Disable network mid-upload
- [ ] Verify error is displayed
- [ ] Check file status shows "error"
- [ ] Re-enable network and retry
- [ ] Verify retry succeeds

#### Test Case 5.2: Server Error (500)
- [ ] Simulate server error (if possible)
- [ ] Verify error message is user-friendly
- [ ] Check retry button works

#### Test Case 5.3: Unsupported File Type
- [ ] Try uploading .pdf, .doc, .zip
- [ ] Verify files are rejected
- [ ] Check error message lists supported formats

#### Test Case 5.4: Corrupted Image File
- [ ] Try uploading corrupted image
- [ ] Verify error is caught
- [ ] Check error message is descriptive

### 6. Performance Testing

#### Test Case 6.1: Compression Speed
- [ ] Upload 5MB JPEG
- [ ] Measure time to compress (should be < 3 seconds on modern device)
- [ ] Check UI remains responsive during compression

#### Test Case 6.2: Memory Usage
- [ ] Upload 10 large files (8-10MB each)
- [ ] Monitor browser memory in DevTools
- [ ] Verify memory is released after each upload
- [ ] Check no memory leaks occur

#### Test Case 6.3: Concurrent Uploads
- [ ] Open 2 browser tabs
- [ ] Upload files in both tabs simultaneously
- [ ] Verify no conflicts
- [ ] Check all uploads succeed

### 7. Mobile Testing

#### Test Case 7.1: Mobile Upload (iOS Safari)
- [ ] Open CMS on iPhone
- [ ] Select image from Photos
- [ ] Verify compression works on mobile
- [ ] Check upload completes

#### Test Case 7.2: Mobile Upload (Android Chrome)
- [ ] Open CMS on Android device
- [ ] Select multiple images
- [ ] Verify bulk upload works
- [ ] Check progress is visible

#### Test Case 7.3: Mobile Camera Upload
- [ ] Take photo with camera
- [ ] Upload directly from camera
- [ ] Verify compression works
- [ ] Check EXIF data handling

### 8. UI/UX Testing

#### Test Case 8.1: Progress Indicators
- [ ] Verify progress bar shows 0-100%
- [ ] Check status text updates ("Compressing..." → "Uploading...")
- [ ] Verify percentage matches actual progress

#### Test Case 8.2: File Size Display
- [ ] Check original size is shown
- [ ] Verify compressed size appears after compression
- [ ] Check percentage saved is calculated correctly
- [ ] Verify format: "2.5MB → 1.2MB (52% smaller)"

#### Test Case 8.3: Success/Error Icons
- [ ] Verify green checkmark appears on success
- [ ] Check red X appears on error
- [ ] Verify icons are visible and clear

#### Test Case 8.4: Drag and Drop
- [ ] Drag single file into dropzone
- [ ] Drag multiple files
- [ ] Verify files are added to list
- [ ] Check dropzone highlights on drag

### 9. Integration Testing

#### Test Case 9.1: End-to-End Flow
1. [ ] Navigate to CMS → Images
2. [ ] Click "Upload Images" button
3. [ ] Select 3 files (2MB, 5MB, 8MB)
4. [ ] Add alt text for each
5. [ ] Select categories
6. [ ] Click "Upload"
7. [ ] Wait for all to complete
8. [ ] Close modal
9. [ ] Verify images appear in gallery
10. [ ] Check images load correctly
11. [ ] Verify metadata is saved (alt text, category)

#### Test Case 9.2: Upload and Use in Package
1. [ ] Upload destination image (5MB)
2. [ ] Navigate to Packages
3. [ ] Create new package
4. [ ] Select uploaded image
5. [ ] Verify image displays correctly
6. [ ] Save package
7. [ ] View public package page
8. [ ] Check image loads properly

### 10. Vercel Limit Testing

#### Test Case 10.1: Confirm 4MB Limit Not Hit
- [ ] Upload multiple 8-10MB files
- [ ] Verify all compress to < 4MB
- [ ] Check no 413 errors occur
- [ ] Verify all uploads succeed

#### Test Case 10.2: Check Server Logs
- [ ] Upload various files
- [ ] Check server logs show compression info
- [ ] Verify no "Payload Too Large" errors
- [ ] Check R2 upload succeeds

## Browser Compatibility

Test in the following browsers:

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile
- [ ] iOS Safari (iOS 15+)
- [ ] Chrome Android (latest)
- [ ] Samsung Internet

## Performance Benchmarks

Expected performance metrics:

| File Size | Compression Time | Upload Time | Total Time |
|-----------|------------------|-------------|------------|
| 1MB       | < 1s             | < 2s        | < 3s       |
| 3MB       | < 2s             | < 3s        | < 5s       |
| 5MB       | < 3s             | < 4s        | < 7s       |
| 10MB      | < 5s             | < 5s        | < 10s      |

## Regression Testing

After any changes to the upload system, rerun:
1. Single file upload (Test Case 1.2)
2. Bulk upload (Test Case 3.1)
3. Large file handling (Test Case 1.3)
4. Error handling (Test Case 5.1)

## Automated E2E Tests

For Playwright/Cypress tests:

```typescript
test('should upload and compress image', async () => {
  // Navigate to images page
  await page.goto('/cms/images');

  // Open upload modal
  await page.click('text=Upload Images');

  // Upload file
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('input[type="file"]')
  ]);
  await fileChooser.setFiles('./test-assets/large-image.jpg');

  // Wait for compression
  await page.waitForSelector('text=Compressing image...');

  // Wait for upload
  await page.waitForSelector('text=Uploading...');

  // Verify success
  await page.waitForSelector('[data-testid="upload-success"]');

  // Check image appears in gallery
  await page.waitForSelector('img[alt="large-image"]');
});
```

## Sign-off

After completing all tests:

- [ ] All single upload tests pass
- [ ] All bulk upload tests pass
- [ ] All edge cases handled
- [ ] All error scenarios covered
- [ ] Performance meets benchmarks
- [ ] Mobile testing complete
- [ ] Browser compatibility confirmed
- [ ] No 413 errors observed
- [ ] No memory leaks detected
- [ ] Ready for production

**Tested by:** ___________________
**Date:** ___________________
**Environment:** Production / Staging
**Notes:** ___________________
