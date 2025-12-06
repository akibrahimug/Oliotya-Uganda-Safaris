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

  it('should disable submit button when form is empty', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Check that submit button is disabled when form is empty
    const submitButton = screen.getByRole('button', { name: /complete all required fields/i });
    expect(submitButton).toBeDisabled();
  });

  it('should keep submit button disabled when required fields are missing', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Fill in only some fields (not all required)
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'john@example.com' } });

    // Submit button should still be disabled because phone, country, and dates are missing
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /complete all required fields/i });
      expect(submitButton).toBeDisabled();
    });
  });

  it('should render all required form fields', () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Check that all required fields are present
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1 234 567 8900')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Country select
    expect(screen.getByLabelText(/travel date from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/travel date to/i)).toBeInTheDocument();
  });
});
