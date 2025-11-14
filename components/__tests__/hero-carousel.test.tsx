/**
 * Unit tests for HeroCarousel component
 */

import { render, screen, waitFor } from '@testing-library/react';
import { HeroCarousel } from '../hero-carousel';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock image utils
jest.mock('@/lib/image-utils', () => ({
  getImageSrc: (path: string) => path,
  getBlurDataURL: () => 'data:image/svg+xml...',
}));

const mockSlides = [
  {
    id: '1',
    title: 'Discover the Magic of',
    subtitle: 'Uganda',
    description: 'Mountain gorillas and pristine rainforests',
    image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/uganda-mountain-gorillas.webp',
    displayOrder: 0,
  },
  {
    id: '2',
    title: 'Experience Wildlife',
    subtitle: 'Safari Adventures',
    description: 'Big Five across stunning national parks',
    image: 'https://pub-831b020047ea41fca8b3ec274b97d789.r2.dev/nambi-uganda-safaris/images/uganda-safari.webp',
    displayOrder: 1,
  },
];

describe('HeroCarousel', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSlides),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render loading state initially', () => {
    render(<HeroCarousel />);
    const loadingDiv = document.querySelector('.animate-pulse');
    expect(loadingDiv).toBeInTheDocument();
  });

  it('should fetch and display hero slides', async () => {
    render(<HeroCarousel />);

    await waitFor(() => {
      expect(screen.getByText('Uganda')).toBeInTheDocument();
    });

    expect(screen.getByText('Discover the Magic of')).toBeInTheDocument();
    expect(screen.getByText('Mountain gorillas and pristine rainforests')).toBeInTheDocument();
  });

  it('should display images with R2 URLs', async () => {
    render(<HeroCarousel />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('src', mockSlides[0].image);
    });
  });

  it('should show navigation dots when multiple slides exist', async () => {
    render(<HeroCarousel />);

    await waitFor(() => {
      const dots = screen.getAllByRole('button', { name: /Go to slide/ });
      expect(dots).toHaveLength(mockSlides.length);
    });
  });

  it('should show empty state when no slides available', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;

    render(<HeroCarousel />);

    await waitFor(() => {
      expect(screen.getByText('No hero slides available')).toBeInTheDocument();
    });
  });

  it('should handle fetch errors gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as jest.Mock;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<HeroCarousel />);

    await waitFor(() => {
      expect(screen.getByText('No hero slides available')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
