/**
 * Unit tests for image utility functions
 */

import { getImageSrc, getBlurDataURL, getImageDimensions } from '../image-utils';

// Mock environment variable
const MOCK_R2_URL = 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev';
const IMAGE_PREFIX = 'nambi-uganda-safaris/images';

describe('Image Utils', () => {
  const originalEnv = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  beforeEach(() => {
    // Set R2 URL for tests
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL = MOCK_R2_URL;
  });

  afterEach(() => {
    // Restore original env
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL = originalEnv;
  });

  describe('getImageSrc', () => {
    it('should return full R2 URL as-is', () => {
      const fullUrl = `${MOCK_R2_URL}/${IMAGE_PREFIX}/uganda-safari.webp`;
      expect(getImageSrc(fullUrl)).toBe(fullUrl);
    });

    it('should convert local jpg path to R2 webp URL', () => {
      const localPath = '/uganda-safari.jpg';
      const expected = `${MOCK_R2_URL}/${IMAGE_PREFIX}/uganda-safari.webp`;
      expect(getImageSrc(localPath)).toBe(expected);
    });

    it('should convert local png path to R2 webp URL', () => {
      const localPath = '/team-photo.png';
      const expected = `${MOCK_R2_URL}/${IMAGE_PREFIX}/team-photo.webp`;
      expect(getImageSrc(localPath)).toBe(expected);
    });

    it('should convert local jpeg path to R2 webp URL', () => {
      const localPath = '/destination.jpeg';
      const expected = `${MOCK_R2_URL}/${IMAGE_PREFIX}/destination.webp`;
      expect(getImageSrc(localPath)).toBe(expected);
    });

    it('should handle paths with multiple dots', () => {
      const localPath = '/uganda.national.park.jpg';
      const expected = `${MOCK_R2_URL}/${IMAGE_PREFIX}/uganda.national.park.webp`;
      expect(getImageSrc(localPath)).toBe(expected);
    });

    it('should handle already webp images', () => {
      const localPath = '/image.webp';
      const expected = `${MOCK_R2_URL}/${IMAGE_PREFIX}/image.webp`;
      expect(getImageSrc(localPath)).toBe(expected);
    });

    it('should handle SVG images without conversion', () => {
      const localPath = '/logo.svg';
      const expected = `${MOCK_R2_URL}/${IMAGE_PREFIX}/logo.svg`;
      expect(getImageSrc(localPath)).toBe(expected);
    });

    it('should return filename as-is if already processed', () => {
      const filename = 'uganda-safari.webp';
      expect(getImageSrc(filename)).toBe(filename);
    });

    it('should handle http URLs', () => {
      const httpUrl = 'http://example.com/image.jpg';
      expect(getImageSrc(httpUrl)).toBe(httpUrl);
    });

    it('should fallback to local path when R2 not configured', () => {
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL = '';
      const localPath = '/local-image.jpg';
      expect(getImageSrc(localPath)).toBe(localPath);
    });
  });

  describe('getBlurDataURL', () => {
    it('should generate valid SVG data URL', () => {
      const result = getBlurDataURL();
      expect(result).toMatch(/^data:image\/svg\+xml/);
      expect(result).toContain('feGaussianBlur');
    });

    it('should use custom color when provided', () => {
      const customColor = '#ff0000';
      const result = getBlurDataURL(customColor);
      expect(result).toContain(customColor);
    });

    it('should use default color when not provided', () => {
      const result = getBlurDataURL();
      expect(result).toContain('#1a1a1a');
    });
  });

  describe('getImageDimensions', () => {
    it('should return correct dimensions for 16:9', () => {
      const dims = getImageDimensions('16:9');
      expect(dims).toEqual({ width: 1600, height: 900 });
    });

    it('should return correct dimensions for 4:3', () => {
      const dims = getImageDimensions('4:3');
      expect(dims).toEqual({ width: 1200, height: 900 });
    });

    it('should return correct dimensions for 1:1', () => {
      const dims = getImageDimensions('1:1');
      expect(dims).toEqual({ width: 1000, height: 1000 });
    });

    it('should return correct dimensions for 21:9', () => {
      const dims = getImageDimensions('21:9');
      expect(dims).toEqual({ width: 2100, height: 900 });
    });
  });
});
