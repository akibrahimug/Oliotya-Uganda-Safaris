/**
 * Secure error handler - never expose system details to clients
 */

type ErrorResponse = {
  error: string;
  code?: string;
};

/**
 * Handle errors securely without exposing system details
 * Logs full error server-side, returns generic message to client
 */
export function handleError(error: unknown, context?: string): ErrorResponse {
  // Log full error details server-side for debugging
  console.error(`[ERROR]${context ? ` ${context}:` : ''}`, error);

  // Return generic error message to client
  return {
    error: 'An unexpected error occurred. Please try again later.',
    code: 'INTERNAL_ERROR',
  };
}

/**
 * Handle database errors specifically
 */
export function handleDatabaseError(error: unknown): ErrorResponse {
  console.error('[DATABASE ERROR]', error);

  return {
    error: 'A database error occurred. Please try again later.',
    code: 'DATABASE_ERROR',
  };
}

/**
 * Handle validation errors (safe to expose)
 */
export function handleValidationError(errors: Record<string, string[]>): ErrorResponse {
  const firstError = Object.values(errors)[0]?.[0];

  return {
    error: firstError || 'Validation failed',
    code: 'VALIDATION_ERROR',
  };
}

/**
 * Handle rate limit errors
 */
export function handleRateLimitError(remaining?: number): ErrorResponse {
  return {
    error: `Too many requests. Please try again later.${
      remaining !== undefined ? ` (${remaining} attempts remaining)` : ''
    }`,
    code: 'RATE_LIMIT_EXCEEDED',
  };
}

/**
 * Log security events
 */
export function logSecurityEvent(event: {
  type: 'rate_limit' | 'validation_error' | 'bot_detected' | 'suspicious_activity';
  ip: string;
  details: any;
}) {
  console.log('[SECURITY]', {
    timestamp: new Date().toISOString(),
    ...event,
  });

  // In production, send to logging service (Sentry, LogRocket, etc.)
  // await sendToSentry(event);
}
