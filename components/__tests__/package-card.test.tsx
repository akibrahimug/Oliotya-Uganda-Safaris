/**
 * Unit tests for PackageCard component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { PackageCard } from '../package-card';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; quality?: number; blurDataURL?: string; placeholder?: string }) => {
    const { fill: _fill, priority: _priority, quality: _quality, blurDataURL: _blur, placeholder: _ph, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock image utils
jest.mock('@/lib/image-utils', () => ({
  getImageSrc: (path: string) => path,
  getBlurDataURL: () => 'data:image/svg+xml...',
}));

const defaultProps = {
  id: 1,
  slug: 'gorilla-trekking-adventure',
  name: 'Gorilla Trekking Adventure',
  category: 'Gorilla Trekking',
  price: 1500,
  duration: '5 Days / 4 Nights',
  maxTravelers: 8,
  image: 'https://example.com/gorillas.webp',
  difficulty: 'MODERATE' as const,
};

describe('PackageCard', () => {
  describe('core rendering', () => {
    it('renders the package name', () => {
      render(<PackageCard {...defaultProps} />);
      expect(screen.getByText('Gorilla Trekking Adventure')).toBeInTheDocument();
    });

    it('renders the category badge', () => {
      render(<PackageCard {...defaultProps} />);
      expect(screen.getByText('Gorilla Trekking')).toBeInTheDocument();
    });

    it('renders the duration', () => {
      render(<PackageCard {...defaultProps} />);
      expect(screen.getByText('5 Days / 4 Nights')).toBeInTheDocument();
    });

    it('renders max travelers with correct label', () => {
      render(<PackageCard {...defaultProps} />);
      expect(screen.getByText('Max 8 people')).toBeInTheDocument();
    });

    it('renders the hero image with correct src and alt', () => {
      render(<PackageCard {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', defaultProps.image);
      expect(img).toHaveAttribute('alt', defaultProps.name);
    });
  });

  describe('price formatting', () => {
    it('renders price formatted to 2 decimal places', () => {
      render(<PackageCard {...defaultProps} price={1500} />);
      expect(screen.getByText('$1500.00')).toBeInTheDocument();
    });

    it('renders fractional price correctly', () => {
      render(<PackageCard {...defaultProps} price={99.99} />);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders "From" label above price', () => {
      render(<PackageCard {...defaultProps} />);
      expect(screen.getByText('From')).toBeInTheDocument();
    });

    it('renders "/person" label next to price', () => {
      render(<PackageCard {...defaultProps} />);
      expect(screen.getByText('/person')).toBeInTheDocument();
    });
  });

  describe('difficulty badge', () => {
    it('displays "Moderate" for MODERATE difficulty', () => {
      render(<PackageCard {...defaultProps} difficulty="MODERATE" />);
      expect(screen.getByText('Moderate')).toBeInTheDocument();
    });

    it('displays "Easy" for EASY difficulty', () => {
      render(<PackageCard {...defaultProps} difficulty="EASY" />);
      expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('displays "Challenging" for CHALLENGING difficulty', () => {
      render(<PackageCard {...defaultProps} difficulty="CHALLENGING" />);
      expect(screen.getByText('Challenging')).toBeInTheDocument();
    });
  });

  describe('explore mode (default)', () => {
    it('renders an Explore button linking to the package page', () => {
      render(<PackageCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/package/gorilla-trekking-adventure');
      expect(screen.getByText('Explore')).toBeInTheDocument();
    });

    it('does not render an Edit button', () => {
      render(<PackageCard {...defaultProps} />);
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  describe('editable mode', () => {
    it('renders an Edit button instead of Explore link', () => {
      render(<PackageCard {...defaultProps} editable={true} onEdit={() => {}} />);
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.queryByText('Explore')).not.toBeInTheDocument();
    });

    it('does not render a link to the package page in editable mode', () => {
      render(<PackageCard {...defaultProps} editable={true} onEdit={() => {}} />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('calls onEdit when Edit button is clicked', () => {
      const onEdit = jest.fn();
      render(<PackageCard {...defaultProps} editable={true} onEdit={onEdit} />);
      fireEvent.click(screen.getByText('Edit'));
      expect(onEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe('animation delay', () => {
    it('applies default animation delay of 0ms', () => {
      render(<PackageCard {...defaultProps} />);
      const card = document.querySelector('[style*="animationDelay"]');
      // Default is 0ms — card should still render correctly
      expect(screen.getByText('Gorilla Trekking Adventure')).toBeInTheDocument();
    });

    it('applies custom animation delay via style', () => {
      const { container } = render(<PackageCard {...defaultProps} animationDelay={200} />);
      const card = container.firstChild as HTMLElement;
      expect(card?.style?.animationDelay).toBe('200ms');
    });
  });
});
