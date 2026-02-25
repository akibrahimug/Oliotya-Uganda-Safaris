import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { format } from 'date-fns';
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
    expect(screen.getByLabelText(/travel dates/i)).toBeInTheDocument();
  });

  it('should keep the date picker open after selecting a date', () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    fireEvent.click(screen.getByLabelText(/travel dates/i));

    expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument();

    const firstSelectableDay = document.querySelector(
      'button[data-day]:not([disabled])'
    ) as HTMLButtonElement | null;

    expect(firstSelectableDay).not.toBeNull();
    fireEvent.click(firstSelectableDay!);

    expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
  });

  it('should not submit the form when clicking a calendar day', () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    fireEvent.click(screen.getByLabelText(/travel dates/i));

    const firstSelectableDay = document.querySelector(
      'button[data-day]:not([disabled])'
    ) as HTMLButtonElement | null;

    expect(firstSelectableDay).not.toBeNull();
    fireEvent.click(firstSelectableDay!);

    expect(mockToast).not.toHaveBeenCalled();
  });

  it('should start a new range with one click after a completed range exists', () => {
    render(
      <BookingForm
        bookingType="PACKAGE"
        itemId={1}
        itemName="Test Package"
        pricePerPerson={100}
      />
    );

    fireEvent.click(screen.getByLabelText(/travel dates/i));

    const getSelectableDays = () =>
      Array.from(
        document.querySelectorAll('button[data-day]:not([disabled])')
      ) as HTMLButtonElement[];

    expect(getSelectableDays().length).toBeGreaterThan(4);

    fireEvent.click(getSelectableDays()[0]);
    fireEvent.click(getSelectableDays()[3]);

    const travelDatesInput = screen.getByLabelText(/travel dates/i) as HTMLInputElement;
    expect(travelDatesInput.value).not.toContain("Select end date");

    const newStartDayButton = getSelectableDays()[4];
    fireEvent.click(newStartDayButton);

    const newStartDate = new Date(newStartDayButton.dataset.day || "");
    expect(travelDatesInput.value).toContain("Select end date");
    expect(travelDatesInput.value.startsWith(format(newStartDate, "MMM d, yyyy"))).toBe(true);
  });
});
