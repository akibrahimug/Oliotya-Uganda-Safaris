/**
 * Unit tests for HeroCarousel component
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { HeroCarousel } from '../hero-carousel';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; quality?: number; blurDataURL?: string; placeholder?: string; fetchPriority?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { fill: _fill, priority: _priority, quality: _quality, blurDataURL: _blur, placeholder: _ph, fetchPriority: _fp, ...rest } = props;
    return <img {...rest} />;
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
    image: 'https://example.com/slide1.webp',
    displayOrder: 0,
  },
  {
    id: '2',
    title: 'Experience Wildlife',
    subtitle: 'Safari Adventures',
    description: 'Big Five across stunning national parks',
    image: 'https://example.com/slide2.webp',
    displayOrder: 1,
  },
  {
    id: '3',
    title: 'Explore the Mountains',
    subtitle: 'Rwenzori Peaks',
    description: 'Trekking adventures in the Mountains of the Moon',
    image: 'https://example.com/slide3.webp',
    displayOrder: 2,
  },
];

describe('HeroCarousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('with initialSlides prop (SSR path)', () => {
    it('renders the first slide immediately without loading state', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
      expect(screen.getByText('Uganda')).toBeInTheDocument();
    });

    it('displays all content for the active slide', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);
      expect(screen.getByText('Discover the Magic of')).toBeInTheDocument();
      expect(screen.getByText('Uganda')).toBeInTheDocument();
      expect(screen.getByText('Mountain gorillas and pristine rainforests')).toBeInTheDocument();
    });

    it('renders navigation dots equal to slide count', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);
      const dots = screen.getAllByRole('button', { name: /Go to slide/ });
      expect(dots).toHaveLength(mockSlides.length);
    });

    it('navigates to a different slide when a dot is clicked', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);
      const dots = screen.getAllByRole('button', { name: /Go to slide/ });
      fireEvent.click(dots[1]);
      expect(screen.getByText('Safari Adventures')).toBeInTheDocument();
      expect(screen.getByText('Experience Wildlife')).toBeInTheDocument();
    });

    it('shows slide counter (01/03) when multiple slides provided', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('/03')).toBeInTheDocument();
    });

    it('renders the hero image with the correct src', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);
      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('src', mockSlides[0].image);
    });

    it('auto-advances slides after 8 seconds', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);
      expect(screen.getByText('Uganda')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(8000);
      });

      expect(screen.getByText('Safari Adventures')).toBeInTheDocument();
    });

    it('stops auto-play when a dot is clicked', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);
      const dots = screen.getAllByRole('button', { name: /Go to slide/ });
      fireEvent.click(dots[1]);

      act(() => {
        jest.advanceTimersByTime(8000);
      });

      // Should still be on slide 2 — auto-play disabled after manual click
      expect(screen.getByText('Safari Adventures')).toBeInTheDocument();
    });

    it('wraps around to first slide after last slide', () => {
      render(<HeroCarousel initialSlides={mockSlides} />);

      act(() => {
        jest.advanceTimersByTime(8000); // slide 2
        jest.advanceTimersByTime(8000); // slide 3
        jest.advanceTimersByTime(8000); // back to slide 1
      });

      expect(screen.getByText('Uganda')).toBeInTheDocument();
    });

    it('renders empty state when initialSlides is an empty array', () => {
      render(<HeroCarousel initialSlides={[]} />);
      expect(screen.getByText('No hero slides available')).toBeInTheDocument();
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });

    it('does not render navigation dots for a single slide', () => {
      render(<HeroCarousel initialSlides={[mockSlides[0]]} />);
      const dots = screen.queryAllByRole('button', { name: /Go to slide/ });
      expect(dots).toHaveLength(1);
    });
  });

  describe('without initialSlides prop (client-side fetch path)', () => {
    it('shows loading skeleton while fetching', () => {
      // Don't resolve the fetch — component stays loading
      global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

      render(<HeroCarousel />);
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('shows slides after a successful fetch', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlides),
        })
      ) as jest.Mock;

      render(<HeroCarousel />);

      await act(async () => {
        await Promise.resolve(); // flush microtasks
      });

      expect(screen.getByText('Uganda')).toBeInTheDocument();
    });

    it('shows empty state when fetch returns no slides', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      ) as jest.Mock;

      render(<HeroCarousel />);

      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.getByText('No hero slides available')).toBeInTheDocument();
    });

    it('shows empty state and logs error when fetch fails', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<HeroCarousel />);

      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.getByText('No hero slides available')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('shows empty state when fetch response is not ok', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({ ok: false })
      ) as jest.Mock;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<HeroCarousel />);

      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.getByText('No hero slides available')).toBeInTheDocument();
      consoleSpy.mockRestore();
    });
  });
});
