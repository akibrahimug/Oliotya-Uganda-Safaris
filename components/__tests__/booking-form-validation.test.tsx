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
    const submitButton = screen.getByRole('button', { name: /please complete all required fields/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    // Fill in all required fields
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('+256-123-456-789'), { target: { value: '+1-555-555-5555' } });

    const countrySelect = screen.getByRole('combobox');
    fireEvent.click(countrySelect);
    await waitFor(() => {
      const option = screen.getByText('United States');
      fireEvent.click(option);
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);

    fireEvent.change(screen.getByLabelText(/travel date from/i), {
      target: { value: tomorrow.toISOString().split('T')[0] }
    });
    fireEvent.change(screen.getByLabelText(/travel date to/i), {
      target: { value: nextWeek.toISOString().split('T')[0] }
    });

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit booking request/i });
      expect(submitButton).not.toBeDisabled();
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
    expect(screen.getByPlaceholderText('+256-123-456-789')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Country select
    expect(screen.getByLabelText(/travel date from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/travel date to/i)).toBeInTheDocument();
  });
});
