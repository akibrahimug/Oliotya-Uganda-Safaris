import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  describe('rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter your name" />);
      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
    });

    it('should render with default value', () => {
      render(<Input defaultValue="John Doe" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('John Doe');
    });

    it('should render with custom id', () => {
      render(<Input id="custom-input" />);
      const input = document.getElementById('custom-input');
      expect(input).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('input types', () => {
    it('should render text input by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      // Default type is implicitly 'text', but may not be set as attribute
      expect(input).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render tel input', () => {
      render(<Input type="tel" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should render search input', () => {
      render(<Input type="search" />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });
  });

  describe('size variants', () => {
    it('should render with default size', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-9', 'px-3', 'py-1');
    });

    it('should render with small size', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-8', 'px-2.5', 'py-1', 'text-sm');
    });

    it('should render with large size', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-12', 'px-4', 'py-2');
    });
  });

  describe('user interaction', () => {
    it('should allow typing', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.type(input, 'Hello World');
      expect(input.value).toBe('Hello World');
    });

    it('should call onChange handler', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onFocus handler', async () => {
      const handleFocus = jest.fn();
      const user = userEvent.setup();
      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('should call onBlur handler', async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('should allow clearing input', async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="Initial" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.clear(input);
      expect(input.value).toBe('');
    });
  });

  describe('disabled state', () => {
    it('should render disabled input', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should not allow typing when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled defaultValue="Test" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.type(input, 'New');
      expect(input.value).toBe('Test');
    });

    it('should have disabled styling', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:pointer-events-none', 'disabled:cursor-not-allowed', 'disabled:opacity-50');
    });
  });

  describe('readonly state', () => {
    it('should render readonly input', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('should not allow typing when readonly', async () => {
      const user = userEvent.setup();
      render(<Input readOnly defaultValue="Test" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.type(input, 'New');
      expect(input.value).toBe('Test');
    });
  });

  describe('required state', () => {
    it('should render required input', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should have required attribute', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
    });
  });

  describe('aria attributes', () => {
    it('should render with aria-label', () => {
      render(<Input aria-label="Username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('should render with aria-invalid', () => {
      render(<Input aria-invalid="true" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should apply invalid styling when aria-invalid', () => {
      render(<Input aria-invalid="true" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('aria-invalid:ring-destructive/20', 'aria-invalid:border-destructive');
    });

    it('should render with aria-describedby', () => {
      render(<Input aria-describedby="error-message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'error-message');
    });
  });

  describe('number input specific', () => {
    it('should accept min and max values', () => {
      render(<Input type="number" min={0} max={100} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('should accept step value', () => {
      render(<Input type="number" step={0.5} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '0.5');
    });
  });

  describe('text input specific', () => {
    it('should accept maxLength', () => {
      render(<Input maxLength={50} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('should accept pattern', () => {
      render(<Input pattern="[0-9]*" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('pattern', '[0-9]*');
    });

    it('should accept inputMode', () => {
      render(<Input inputMode="numeric" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('inputMode', 'numeric');
    });
  });

  describe('data attributes', () => {
    it('should have data-slot attribute', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('data-slot', 'input');
    });

    it('should accept custom data attributes', () => {
      render(<Input data-testid="custom-input" />);
      const input = screen.getByTestId('custom-input');
      expect(input).toBeInTheDocument();
    });
  });

  describe('controlled component', () => {
    it('should work as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };

      render(<TestComponent />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.type(input, 'Controlled');
      expect(input.value).toBe('Controlled');
    });

    it('should update value when prop changes', () => {
      const { rerender } = render(<Input value="Initial" onChange={() => {}} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Initial');

      rerender(<Input value="Updated" onChange={() => {}} />);
      expect(input.value).toBe('Updated');
    });
  });

  describe('focus management', () => {
    it('should be focusable', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(input).toHaveFocus();
    });

    it('should apply focus styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50');
    });
  });
});
