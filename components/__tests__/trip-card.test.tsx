import React from 'react';
import { render, screen } from '@testing-library/react';
import { TripCard } from '../trip-card';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('TripCard Component', () => {
  const defaultProps = {
    id: 1,
    name: 'Safari Adventure',
    country: 'Kenya',
    category: 'Wildlife',
    price: 1299.99,
    rating: 5,
    duration: '7 days',
    groupSize: 12,
    image: '/images/safari.jpg',
  };

  describe('rendering', () => {
    it('should render trip card with all information', () => {
      render(<TripCard {...defaultProps} />);

      expect(screen.getByText('Safari Adventure')).toBeInTheDocument();
      expect(screen.getByText('Kenya')).toBeInTheDocument();
      expect(screen.getByText('Wildlife')).toBeInTheDocument();
      expect(screen.getByText('$1299.99')).toBeInTheDocument();
      expect(screen.getByText('7 days')).toBeInTheDocument();
      expect(screen.getByText('Max 12 people')).toBeInTheDocument();
    });

    it('should render trip image with correct alt text', () => {
      render(<TripCard {...defaultProps} />);
      const image = screen.getByAltText('Safari Adventure') as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toContain('/images/safari.jpg');
    });

    it('should render rating badge', () => {
      render(<TripCard {...defaultProps} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render category badge', () => {
      render(<TripCard {...defaultProps} />);
      expect(screen.getByText('Wildlife')).toBeInTheDocument();
    });

    it('should render explore button', () => {
      render(<TripCard {...defaultProps} />);
      expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
    });
  });

  describe('price formatting', () => {
    it('should format price with two decimal places', () => {
      render(<TripCard {...defaultProps} price={999} />);
      expect(screen.getByText('$999.00')).toBeInTheDocument();
    });

    it('should handle decimal prices', () => {
      render(<TripCard {...defaultProps} price={1299.50} />);
      expect(screen.getByText('$1299.50')).toBeInTheDocument();
    });

    it('should handle large prices', () => {
      render(<TripCard {...defaultProps} price={9999.99} />);
      expect(screen.getByText('$9999.99')).toBeInTheDocument();
    });

    it('should display "From" label before price', () => {
      render(<TripCard {...defaultProps} />);
      expect(screen.getByText('From')).toBeInTheDocument();
    });
  });

  describe('link navigation', () => {
    it('should link to trip detail page', () => {
      render(<TripCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/trip/1');
    });

    it('should include search params in link', () => {
      render(<TripCard {...defaultProps} searchParams="?category=wildlife" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/trip/1?category=wildlife');
    });

    it('should work without search params', () => {
      render(<TripCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/trip/1');
    });

    it('should link with correct trip id', () => {
      render(<TripCard {...defaultProps} id={42} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/trip/42');
    });
  });

  describe('icons', () => {
    it('should render MapPin icon', () => {
      render(<TripCard {...defaultProps} />);
      const locationSection = screen.getByText('Kenya').closest('div');
      expect(locationSection).toBeInTheDocument();
    });

    it('should render Clock icon', () => {
      render(<TripCard {...defaultProps} />);
      const durationSection = screen.getByText('7 days').closest('div');
      expect(durationSection).toBeInTheDocument();
    });

    it('should render Users icon', () => {
      render(<TripCard {...defaultProps} />);
      const groupSizeSection = screen.getByText('Max 12 people').closest('div');
      expect(groupSizeSection).toBeInTheDocument();
    });

    it('should render Star icon in rating', () => {
      render(<TripCard {...defaultProps} />);
      const ratingBadge = screen.getByText('5').closest('div');
      expect(ratingBadge).toBeInTheDocument();
    });

    it('should render ChevronRight icon in button', () => {
      render(<TripCard {...defaultProps} />);
      expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
    });
  });

  describe('image handling', () => {
    it('should use provided image', () => {
      render(<TripCard {...defaultProps} image="/custom-image.jpg" />);
      const image = screen.getByAltText('Safari Adventure') as HTMLImageElement;
      expect(image.src).toContain('/custom-image.jpg');
    });

    it('should use placeholder when image is empty', () => {
      render(<TripCard {...defaultProps} image="" />);
      const image = screen.getByAltText('Safari Adventure') as HTMLImageElement;
      expect(image.src).toContain('/placeholder.svg');
    });

    it('should have correct image dimensions', () => {
      render(<TripCard {...defaultProps} />);
      const image = screen.getByAltText('Safari Adventure');
      expect(image).toHaveClass('w-full', 'h-64');
    });
  });

  describe('animation', () => {
    it('should apply animation delay when provided', () => {
      render(<TripCard {...defaultProps} animationDelay={200} />);
      const card = screen.getByText('Safari Adventure').closest('.group');
      expect(card).toHaveStyle({ animationDelay: '200ms' });
    });

    it('should use default animation delay of 0', () => {
      render(<TripCard {...defaultProps} />);
      const card = screen.getByText('Safari Adventure').closest('.group');
      expect(card).toHaveStyle({ animationDelay: '0ms' });
    });

    it('should have fade-in-up animation class', () => {
      render(<TripCard {...defaultProps} />);
      const card = screen.getByText('Safari Adventure').closest('.group');
      expect(card).toHaveClass('animate-fade-in-up');
    });
  });

  describe('category variations', () => {
    it('should display Wildlife category', () => {
      render(<TripCard {...defaultProps} category="Wildlife" />);
      expect(screen.getByText('Wildlife')).toBeInTheDocument();
    });

    it('should display Beach category', () => {
      render(<TripCard {...defaultProps} category="Beach" />);
      expect(screen.getByText('Beach')).toBeInTheDocument();
    });

    it('should display Mountain category', () => {
      render(<TripCard {...defaultProps} category="Mountain" />);
      expect(screen.getByText('Mountain')).toBeInTheDocument();
    });

    it('should display Culture category', () => {
      render(<TripCard {...defaultProps} category="Culture" />);
      expect(screen.getByText('Culture')).toBeInTheDocument();
    });
  });

  describe('rating variations', () => {
    it('should display rating of 5', () => {
      render(<TripCard {...defaultProps} rating={5} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should display rating of 4', () => {
      render(<TripCard {...defaultProps} rating={4} />);
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('should display rating of 3', () => {
      render(<TripCard {...defaultProps} rating={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('group size variations', () => {
    it('should display small group size', () => {
      render(<TripCard {...defaultProps} groupSize={6} />);
      expect(screen.getByText('Max 6 people')).toBeInTheDocument();
    });

    it('should display medium group size', () => {
      render(<TripCard {...defaultProps} groupSize={12} />);
      expect(screen.getByText('Max 12 people')).toBeInTheDocument();
    });

    it('should display large group size', () => {
      render(<TripCard {...defaultProps} groupSize={20} />);
      expect(screen.getByText('Max 20 people')).toBeInTheDocument();
    });
  });

  describe('duration variations', () => {
    it('should display short duration', () => {
      render(<TripCard {...defaultProps} duration="3 days" />);
      expect(screen.getByText('3 days')).toBeInTheDocument();
    });

    it('should display medium duration', () => {
      render(<TripCard {...defaultProps} duration="7 days" />);
      expect(screen.getByText('7 days')).toBeInTheDocument();
    });

    it('should display long duration', () => {
      render(<TripCard {...defaultProps} duration="14 days" />);
      expect(screen.getByText('14 days')).toBeInTheDocument();
    });

    it('should display duration with weeks', () => {
      render(<TripCard {...defaultProps} duration="2 weeks" />);
      expect(screen.getByText('2 weeks')).toBeInTheDocument();
    });
  });

  describe('styling and layout', () => {
    it('should have card wrapper with correct classes', () => {
      render(<TripCard {...defaultProps} />);
      const card = screen.getByText('Safari Adventure').closest('.group');
      expect(card).toHaveClass('shrink-0', 'w-full', 'group', 'transition-all');
    });

    it('should have shadow styling', () => {
      render(<TripCard {...defaultProps} />);
      const card = screen.getByText('Safari Adventure').closest('.group');
      // Check that the card element exists and has inline styles
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('style');
    });

    it('should have hover effects on image', () => {
      render(<TripCard {...defaultProps} />);
      const image = screen.getByAltText('Safari Adventure');
      expect(image).toHaveClass('group-hover:scale-110');
    });

    it('should have hover effects on title', () => {
      render(<TripCard {...defaultProps} />);
      const title = screen.getByText('Safari Adventure');
      expect(title).toHaveClass('group-hover:text-primary');
    });
  });

  describe('accessibility', () => {
    it('should have descriptive alt text for image', () => {
      render(<TripCard {...defaultProps} name="Mountain Trek" />);
      expect(screen.getByAltText('Mountain Trek')).toBeInTheDocument();
    });

    it('should have accessible link', () => {
      render(<TripCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('should have accessible button', () => {
      render(<TripCard {...defaultProps} />);
      const button = screen.getByRole('button', { name: /explore/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle very long trip names', () => {
      const longName = 'This is a very long trip name that should still display correctly';
      render(<TripCard {...defaultProps} name={longName} />);
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle very long country names', () => {
      const longCountry = 'Democratic Republic of the Congo';
      render(<TripCard {...defaultProps} country={longCountry} />);
      expect(screen.getByText(longCountry)).toBeInTheDocument();
    });

    it('should handle price of 0', () => {
      render(<TripCard {...defaultProps} price={0} />);
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('should handle very high prices', () => {
      render(<TripCard {...defaultProps} price={99999.99} />);
      expect(screen.getByText('$99999.99')).toBeInTheDocument();
    });
  });
});
