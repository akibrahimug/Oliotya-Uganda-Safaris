import {
  handleError,
  handleDatabaseError,
  handleValidationError,
  handleRateLimitError,
  logSecurityEvent,
} from '../error-handler';

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

describe('handleError', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should return generic error message', () => {
    const result = handleError(new Error('Database connection failed'));
    expect(result).toEqual({
      error: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
    });
  });

  it('should log error to console', () => {
    const error = new Error('Test error');
    handleError(error);
    expect(console.error).toHaveBeenCalledWith('[ERROR]', error);
  });

  it('should log error with context', () => {
    const error = new Error('Test error');
    const context = 'User registration';
    handleError(error, context);
    expect(console.error).toHaveBeenCalledWith('[ERROR] User registration:', error);
  });

  it('should handle string errors', () => {
    const result = handleError('Something went wrong');
    expect(result).toEqual({
      error: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
    });
  });

  it('should handle unknown error types', () => {
    const result = handleError({ custom: 'error' });
    expect(result).toEqual({
      error: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
    });
  });

  it('should handle null error', () => {
    const result = handleError(null);
    expect(result).toEqual({
      error: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
    });
  });

  it('should handle undefined error', () => {
    const result = handleError(undefined);
    expect(result).toEqual({
      error: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
    });
  });

  it('should not expose error details in response', () => {
    const error = new Error('Sensitive database credentials exposed');
    const result = handleError(error);
    expect(result.error).not.toContain('credentials');
    expect(result.error).not.toContain('database');
  });
});

describe('handleDatabaseError', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should return database error message', () => {
    const result = handleDatabaseError(new Error('Connection timeout'));
    expect(result).toEqual({
      error: 'A database error occurred. Please try again later.',
      code: 'DATABASE_ERROR',
    });
  });

  it('should log error to console', () => {
    const error = new Error('Database error');
    handleDatabaseError(error);
    expect(console.error).toHaveBeenCalledWith('[DATABASE ERROR]', error);
  });

  it('should not expose database details', () => {
    const error = new Error('Table "users" does not exist');
    const result = handleDatabaseError(error);
    expect(result.error).not.toContain('Table');
    expect(result.error).not.toContain('users');
  });
});

describe('handleValidationError', () => {
  it('should return first validation error', () => {
    const errors = {
      email: ['Invalid email address', 'Email is required'],
      name: ['Name is too short'],
    };
    const result = handleValidationError(errors);
    expect(result).toEqual({
      error: 'Invalid email address',
      code: 'VALIDATION_ERROR',
    });
  });

  it('should handle single field error', () => {
    const errors = {
      password: ['Password must be at least 8 characters'],
    };
    const result = handleValidationError(errors);
    expect(result).toEqual({
      error: 'Password must be at least 8 characters',
      code: 'VALIDATION_ERROR',
    });
  });

  it('should handle empty errors object', () => {
    const errors = {};
    const result = handleValidationError(errors);
    expect(result).toEqual({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
    });
  });

  it('should handle errors with empty arrays', () => {
    const errors = {
      email: [],
      name: [],
    };
    const result = handleValidationError(errors);
    expect(result).toEqual({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
    });
  });

  it('should return default message when no error messages', () => {
    const errors = {
      field: [undefined as any],
    };
    const result = handleValidationError(errors);
    expect(result.error).toBe('Validation failed');
  });
});

describe('handleRateLimitError', () => {
  it('should return rate limit error without remaining count', () => {
    const result = handleRateLimitError();
    expect(result).toEqual({
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  });

  it('should return rate limit error with remaining count', () => {
    const result = handleRateLimitError(5);
    expect(result).toEqual({
      error: 'Too many requests. Please try again later. (5 attempts remaining)',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  });

  it('should handle zero remaining attempts', () => {
    const result = handleRateLimitError(0);
    expect(result).toEqual({
      error: 'Too many requests. Please try again later. (0 attempts remaining)',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  });

  it('should handle large remaining count', () => {
    const result = handleRateLimitError(999);
    expect(result.error).toContain('999 attempts remaining');
  });
});

describe('logSecurityEvent', () => {
  beforeEach(() => {
    console.log = jest.fn();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T12:00:00Z'));
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    jest.useRealTimers();
  });

  it('should log rate limit event', () => {
    logSecurityEvent({
      type: 'rate_limit',
      ip: '192.168.1.1',
      details: { form: 'contact', remaining: 0 },
    });

    expect(console.log).toHaveBeenCalledWith('[SECURITY]', {
      timestamp: '2025-01-01T12:00:00.000Z',
      type: 'rate_limit',
      ip: '192.168.1.1',
      details: { form: 'contact', remaining: 0 },
    });
  });

  it('should log validation error event', () => {
    logSecurityEvent({
      type: 'validation_error',
      ip: '10.0.0.1',
      details: { form: 'booking', errors: { email: 'Invalid' } },
    });

    expect(console.log).toHaveBeenCalledWith('[SECURITY]', {
      timestamp: '2025-01-01T12:00:00.000Z',
      type: 'validation_error',
      ip: '10.0.0.1',
      details: { form: 'booking', errors: { email: 'Invalid' } },
    });
  });

  it('should log bot detected event', () => {
    logSecurityEvent({
      type: 'bot_detected',
      ip: '123.45.67.89',
      details: { form: 'newsletter', honeypot: 'http://spam.com' },
    });

    expect(console.log).toHaveBeenCalledWith('[SECURITY]', expect.objectContaining({
      type: 'bot_detected',
      ip: '123.45.67.89',
      details: { form: 'newsletter', honeypot: 'http://spam.com' },
    }));
  });

  it('should log suspicious activity event', () => {
    logSecurityEvent({
      type: 'suspicious_activity',
      ip: '192.168.1.100',
      details: { reason: 'Multiple failed login attempts' },
    });

    expect(console.log).toHaveBeenCalledWith('[SECURITY]', expect.objectContaining({
      type: 'suspicious_activity',
      ip: '192.168.1.100',
    }));
  });

  it('should include timestamp in log', () => {
    logSecurityEvent({
      type: 'rate_limit',
      ip: '1.2.3.4',
      details: {},
    });

    expect(console.log).toHaveBeenCalledWith('[SECURITY]', expect.objectContaining({
      timestamp: expect.any(String),
    }));
  });

  it('should handle events with complex details', () => {
    logSecurityEvent({
      type: 'validation_error',
      ip: '192.168.1.1',
      details: {
        form: 'contact',
        errors: {
          email: ['Invalid', 'Required'],
          name: ['Too short'],
        },
        timestamp: Date.now(),
      },
    });

    expect(console.log).toHaveBeenCalled();
  });

  it('should handle events with empty details', () => {
    logSecurityEvent({
      type: 'bot_detected',
      ip: '127.0.0.1',
      details: {},
    });

    expect(console.log).toHaveBeenCalledWith('[SECURITY]', expect.objectContaining({
      type: 'bot_detected',
      ip: '127.0.0.1',
      details: {},
    }));
  });
});
