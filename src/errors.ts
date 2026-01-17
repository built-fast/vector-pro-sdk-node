export interface ApiErrorResponse {
  data: Record<string, unknown>;
  errors?: Record<string, string[]>;
  message: string;
  http_status: number;
}

export class VectorProError extends Error {
  readonly statusCode: number;
  readonly responseBody: ApiErrorResponse;

  constructor(statusCode: number, responseBody: ApiErrorResponse) {
    super(responseBody.message || `HTTP ${statusCode}`);
    this.name = 'VectorProError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VectorProError);
    }
  }

  /**
   * Returns true if this is a 401 Unauthenticated error
   */
  isAuthenticationError(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Returns true if this is a 403 Unauthorized/Forbidden error
   */
  isAuthorizationError(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Returns true if this is a 404 Not Found error
   */
  isNotFoundError(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Returns true if this is a 422 Validation error
   */
  isValidationError(): boolean {
    return this.statusCode === 422;
  }

  /**
   * Returns true if this is a 5xx Server error
   */
  isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * Returns the validation errors object, or empty object if none
   */
  getValidationErrors(): Record<string, string[]> {
    return this.responseBody.errors ?? {};
  }

  /**
   * Returns the first validation error message, or null if none
   */
  firstError(): string | null {
    const errors = this.getValidationErrors();
    const fields = Object.keys(errors);
    const firstField = fields[0];
    if (firstField === undefined) return null;
    const fieldErrors = errors[firstField];
    if (!fieldErrors || fieldErrors.length === 0) return null;
    return fieldErrors[0] ?? null;
  }

  /**
   * Returns all error messages for a specific field
   */
  errorsFor(field: string): string[] {
    return this.getValidationErrors()[field] ?? [];
  }

  /**
   * Returns true if there are validation errors for a specific field
   */
  hasErrorFor(field: string): boolean {
    return this.errorsFor(field).length > 0;
  }
}
