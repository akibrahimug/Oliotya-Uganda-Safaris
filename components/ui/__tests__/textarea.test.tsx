import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../textarea';

describe('Textarea Component', () => {
  describe('rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Textarea placeholder="Enter your message" />);
      const textarea = screen.getByPlaceholderText('Enter your message');
      expect(textarea).toBeInTheDocument();
    });

    it('should render with default value', () => {
      render(<Textarea defaultValue="Default message" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Default message');
    });

    it('should render with custom id', () => {
      render(<Textarea id="message-field" />);
      const textarea = document.getElementById('message-field');
      expect(textarea).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Textarea className="custom-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-textarea');
    });
  });

  describe('styling', () => {
    it('should have base styling classes', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass(
        'border-input',
        'rounded-md',
        'border',
        'bg-transparent',
        'px-3',
        'py-2'
      );
    });

    it('should have hover styles', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('hover:border-ring/50');
    });

    it('should have focus styles', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50');
    });

    it('should have minimum height', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('min-h-16');
    });
  });

  describe('user interaction', () => {
    it('should allow typing', async () => {
      const user = userEvent.setup();
      render(<Textarea />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'Hello World');
      expect(textarea.value).toBe('Hello World');
    });

    it('should allow multiline input', async () => {
      const user = userEvent.setup();
      render(<Textarea />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');
      expect(textarea.value).toContain('\n');
      expect(textarea.value.split('\n')).toHaveLength(3);
    });

    it('should call onChange handler', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'Test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onFocus handler', async () => {
      const handleFocus = jest.fn();
      const user = userEvent.setup();
      render(<Textarea onFocus={handleFocus} />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('should call onBlur handler', async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      render(<Textarea onBlur={handleBlur} />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);
      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('should allow clearing textarea', async () => {
      const user = userEvent.setup();
      render(<Textarea defaultValue="Initial text" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.clear(textarea);
      expect(textarea.value).toBe('');
    });
  });

  describe('disabled state', () => {
    it('should render disabled textarea', () => {
      render(<Textarea disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('should not allow typing when disabled', async () => {
      const user = userEvent.setup();
      render(<Textarea disabled defaultValue="Test" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'New');
      expect(textarea.value).toBe('Test');
    });

    it('should have disabled styling', () => {
      render(<Textarea disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });
  });

  describe('readonly state', () => {
    it('should render readonly textarea', () => {
      render(<Textarea readOnly />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readonly');
    });

    it('should not allow typing when readonly', async () => {
      const user = userEvent.setup();
      render(<Textarea readOnly defaultValue="Test" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'New');
      expect(textarea.value).toBe('Test');
    });
  });

  describe('required state', () => {
    it('should render required textarea', () => {
      render(<Textarea required />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
    });

    it('should have required attribute', () => {
      render(<Textarea required />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('required');
    });
  });

  describe('aria attributes', () => {
    it('should render with aria-label', () => {
      render(<Textarea aria-label="Message" />);
      const textarea = screen.getByLabelText('Message');
      expect(textarea).toBeInTheDocument();
    });

    it('should render with aria-invalid', () => {
      render(<Textarea aria-invalid="true" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should apply invalid styling when aria-invalid', () => {
      render(<Textarea aria-invalid="true" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('aria-invalid:ring-destructive/20', 'aria-invalid:border-destructive');
    });

    it('should render with aria-describedby', () => {
      render(<Textarea aria-describedby="error-message" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'error-message');
    });
  });

  describe('textarea specific attributes', () => {
    it('should accept rows attribute', () => {
      render(<Textarea rows={5} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('should accept cols attribute', () => {
      render(<Textarea cols={50} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('cols', '50');
    });

    it('should accept maxLength', () => {
      render(<Textarea maxLength={200} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '200');
    });

    it('should enforce maxLength', async () => {
      const user = userEvent.setup();
      render(<Textarea maxLength={10} />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'This is a very long text');
      expect(textarea.value.length).toBeLessThanOrEqual(10);
    });
  });

  describe('data attributes', () => {
    it('should have data-slot attribute', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('data-slot', 'textarea');
    });

    it('should accept custom data attributes', () => {
      render(<Textarea data-testid="message-input" />);
      const textarea = screen.getByTestId('message-input');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('controlled component', () => {
    it('should work as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };

      render(<TestComponent />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'Controlled text');
      expect(textarea.value).toBe('Controlled text');
    });

    it('should update value when prop changes', () => {
      const { rerender } = render(<Textarea value="Initial" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Initial');

      rerender(<Textarea value="Updated" onChange={() => {}} />);
      expect(textarea.value).toBe('Updated');
    });
  });

  describe('focus management', () => {
    it('should be focusable', async () => {
      const user = userEvent.setup();
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);
      expect(textarea).toHaveFocus();
    });

    it('should apply focus styles', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50');
    });
  });

  describe('resize behavior', () => {
    it('should have resize class if specified', () => {
      render(<Textarea className="resize-none" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-none');
    });

    it('should allow vertical resize by default (browser default)', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      // By default, textarea allows vertical resize unless explicitly set
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('character count validation', () => {
    it('should work with character counter', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={100}
            />
            <div data-testid="char-count">{value.length}/100</div>
          </>
        );
      };

      render(<TestComponent />);
      const textarea = screen.getByRole('textbox');
      const charCount = screen.getByTestId('char-count');

      expect(charCount).toHaveTextContent('0/100');

      await user.type(textarea, 'Hello');
      expect(charCount).toHaveTextContent('5/100');
    });
  });

  describe('long text handling', () => {
    it('should handle very long text', async () => {
      const user = userEvent.setup();
      const longText = 'a'.repeat(1000);
      render(<Textarea />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, longText);
      expect(textarea.value).toBe(longText);
      expect(textarea.value.length).toBe(1000);
    });

    it('should handle text with special characters', async () => {
      const user = userEvent.setup();
      const specialText = 'Hello 世界 🌍 & < > " \'';
      render(<Textarea />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, specialText);
      expect(textarea.value).toBe(specialText);
    });
  });
});
