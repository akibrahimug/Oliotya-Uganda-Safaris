import { sanitizeInput, sanitizeHTML, sanitizeObject } from '../sanitize';

describe('sanitizeInput', () => {
  it('should remove all HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello World');
  });

  it('should remove script tags and content', () => {
    const input = '<script>alert("XSS")</script>Hello';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello');
  });

  it('should remove event handlers', () => {
    const input = '<img src="x" onerror="alert(1)">Hello';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello');
  });

  it('should remove style tags', () => {
    const input = '<style>body{background:red}</style>Hello';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello');
  });

  it('should trim whitespace', () => {
    const input = '  Hello World  ';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello World');
  });

  it('should handle plain text without changes', () => {
    const input = 'Hello World';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello World');
  });

  it('should handle empty string', () => {
    const input = '';
    const result = sanitizeInput(input);
    expect(result).toBe('');
  });

  it('should handle string with only HTML tags', () => {
    const input = '<div><span></span></div>';
    const result = sanitizeInput(input);
    expect(result).toBe('');
  });

  it('should remove iframe tags', () => {
    const input = '<iframe src="evil.com"></iframe>Hello';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello');
  });

  it('should remove anchor tags but keep text', () => {
    const input = '<a href="http://evil.com">Click here</a>';
    const result = sanitizeInput(input);
    expect(result).toBe('Click here');
  });

  it('should handle nested HTML tags', () => {
    const input = '<div><p><span>Hello</span> <strong>World</strong></p></div>';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello World');
  });

  it('should handle malformed HTML', () => {
    const input = '<div>Hello<p>World';
    const result = sanitizeInput(input);
    expect(result).toBe('HelloWorld');
  });

  it('should remove javascript: protocol', () => {
    const input = '<a href="javascript:alert(1)">Click</a>';
    const result = sanitizeInput(input);
    expect(result).toBe('Click');
  });

  it('should handle special characters', () => {
    const input = 'Hello & goodbye < > " \'';
    const result = sanitizeInput(input);
    // DOMPurify may escape HTML entities
    expect(result).toContain('Hello');
    expect(result).toContain('goodbye');
  });

  it('should handle unicode characters', () => {
    const input = 'Hello 世界 🌍';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello 世界 🌍');
  });
});

describe('sanitizeHTML', () => {
  it('should allow safe HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('Hello');
    expect(result).toContain('World');
  });

  it('should allow bold tags', () => {
    const input = '<b>Bold text</b>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<b>');
    expect(result).toContain('Bold text');
  });

  it('should allow italic and emphasis tags', () => {
    const input = '<i>Italic</i> <em>Emphasis</em>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<i>');
    expect(result).toContain('<em>');
  });

  it('should allow list tags', () => {
    const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
  });

  it('should allow line breaks', () => {
    const input = 'Line 1<br>Line 2';
    const result = sanitizeHTML(input);
    expect(result).toContain('<br>');
  });

  it('should remove script tags', () => {
    const input = '<p>Hello</p><script>alert("XSS")</script>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should remove event handlers', () => {
    const input = '<p onclick="alert(1)">Hello</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('onclick');
  });

  it('should remove style attributes', () => {
    const input = '<p style="color: red">Hello</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('style');
  });

  it('should remove class attributes', () => {
    const input = '<p class="danger">Hello</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('class');
  });

  it('should remove dangerous tags but keep safe ones', () => {
    const input = '<p>Safe</p><script>Dangerous</script><strong>Also safe</strong>';
    const result = sanitizeHTML(input);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).not.toContain('<script>');
  });

  it('should trim whitespace', () => {
    const input = '  <p>Hello</p>  ';
    const result = sanitizeHTML(input);
    expect(result).toBe('<p>Hello</p>');
  });

  it('should handle empty string', () => {
    const input = '';
    const result = sanitizeHTML(input);
    expect(result).toBe('');
  });

  it('should remove iframe tags', () => {
    const input = '<p>Hello</p><iframe src="evil.com"></iframe>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<iframe>');
  });

  it('should remove object and embed tags', () => {
    const input = '<object><embed></embed></object><p>Hello</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<object>');
    expect(result).not.toContain('<embed>');
  });
});

describe('sanitizeObject', () => {
  it('should sanitize all string fields', () => {
    const input = {
      name: '<script>alert(1)</script>John',
      email: '<b>john@example.com</b>',
      message: '<p>Hello</p>',
    };
    const result = sanitizeObject(input);
    expect(result.name).toBe('John');
    expect(result.email).toBe('john@example.com');
    expect(result.message).toBe('Hello');
  });

  it('should preserve non-string fields', () => {
    const input = {
      name: 'John Smith',
      age: 30,
      isActive: true,
      count: null,
      data: undefined,
    };
    const result = sanitizeObject(input);
    expect(result.name).toBe('John Smith');
    expect(result.age).toBe(30);
    expect(result.isActive).toBe(true);
    expect(result.count).toBe(null);
    expect(result.data).toBe(undefined);
  });

  it('should handle empty object', () => {
    const input = {};
    const result = sanitizeObject(input);
    expect(result).toEqual({});
  });

  it('should handle object with mixed types', () => {
    const input = {
      text: '<b>Bold</b>',
      number: 42,
      boolean: false,
      array: [1, 2, 3],
      nested: { key: 'value' },
    };
    const result = sanitizeObject(input);
    expect(result.text).toBe('Bold');
    expect(result.number).toBe(42);
    expect(result.boolean).toBe(false);
    expect(result.array).toEqual([1, 2, 3]);
    expect(result.nested).toEqual({ key: 'value' });
  });

  it('should trim whitespace from strings', () => {
    const input = {
      name: '  John  ',
      email: '  john@example.com  ',
    };
    const result = sanitizeObject(input);
    expect(result.name).toBe('John');
    expect(result.email).toBe('john@example.com');
  });

  it('should handle object with empty strings', () => {
    const input = {
      field1: '',
      field2: '  ',
      field3: 'value',
    };
    const result = sanitizeObject(input);
    expect(result.field1).toBe('');
    expect(result.field2).toBe('');
    expect(result.field3).toBe('value');
  });

  it('should sanitize complex object', () => {
    const input = {
      firstName: '<script>alert(1)</script>John',
      lastName: 'Doe<img src=x onerror=alert(1)>',
      email: '<b>john@example.com</b>',
      age: 30,
      message: '<p>Hello</p><script>evil()</script>',
    };
    const result = sanitizeObject(input);
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.email).toBe('john@example.com');
    expect(result.age).toBe(30);
    expect(result.message).toBe('Hello');
  });

  it('should handle special characters in strings', () => {
    const input = {
      text: '& < > " \' Hello',
    };
    const result = sanitizeObject(input);
    // DOMPurify may escape HTML entities
    expect(result.text).toContain('Hello');
  });

  it('should preserve type safety', () => {
    interface TestData {
      name: string;
      age: number;
      active: boolean;
    }
    const input: TestData = {
      name: '<b>John</b>',
      age: 30,
      active: true,
    };
    const result = sanitizeObject(input);
    expect(typeof result.name).toBe('string');
    expect(typeof result.age).toBe('number');
    expect(typeof result.active).toBe('boolean');
  });
});
