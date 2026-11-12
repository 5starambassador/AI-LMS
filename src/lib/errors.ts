/**
 * Typed HTTP error classes for consistent error handling across the platform.
 * Throw these from controllers/services; the global Fastify error handler
 * converts them to the correct HTTP status code and JSON response.
 */

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, code?: string) {
    super(400, message, code ?? 'BAD_REQUEST');
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required.') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden.') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found.`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string, hint?: string) {
    super(
      503,
      hint
        ? `${service} is unavailable. ${hint}`
        : `${service} is unavailable. Contact your system administrator.`,
      'SERVICE_UNAVAILABLE'
    );
    this.name = 'ServiceUnavailableError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}
