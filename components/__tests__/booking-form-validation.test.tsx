import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingForm } from '../booking-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('BookingForm Validation', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockToast = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('should display validation errors when submitting empty form', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Try to submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /submit booking request/i });
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('Country is required')).toBeInTheDocument();
      expect(screen.getByText('Travel start date is required')).toBeInTheDocument();
      expect(screen.getByText('Travel end date is required')).toBeInTheDocument();
    });

    // Check that toast was called with validation error
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Validation Error',
      description: 'Please correct the errors in the form',
      variant: 'destructive',
    });
  });

  it('should display error with AlertCircle icon', async () => {
    const { container } = render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit booking request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check for the AlertCircle SVG icon
      const errorDiv = screen.getByText('First name is required').closest('div');
      expect(errorDiv).toHaveClass('text-destructive', 'font-medium');

      // Check that the parent div contains the AlertCircle class
      const svg = errorDiv?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('should show red border on invalid input', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit booking request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const firstNameInput = screen.getByPlaceholderText('John');
      expect(firstNameInput).toHaveClass('border-destructive', 'focus-visible:ring-destructive');
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should clear error when user starts typing', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Submit to trigger validation errors
    const submitButton = screen.getByRole('button', { name: /submit booking request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });

    // Start typing in first name field
    const firstNameInput = screen.getByPlaceholderText('John');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Fill in required fields except email (with invalid email)
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('+1 234 567 8900'), { target: { value: '+1234567890' } });

    const submitButton = screen.getByRole('button', { name: /submit booking request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('should validate phone number format', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Fill in required fields except phone (with invalid phone)
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('+1 234 567 8900'), { target: { value: 'abc' } });

    const submitButton = screen.getByRole('button', { name: /submit booking request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid phone number format')).toBeInTheDocument();
    });
  });

  it('should validate travel dates', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('+1 234 567 8900'), { target: { value: '+1234567890' } });

    // Fill in past date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];

    const dateFromInput = screen.getByLabelText(/travel date from/i);
    fireEvent.change(dateFromInput, { target: { value: pastDate } });

    const submitButton = screen.getByRole('button', { name: /submit booking request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Start date cannot be in the past')).toBeInTheDocument();
    });
  });
});
