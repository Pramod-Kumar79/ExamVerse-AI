export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly errors?: unknown;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", errors?: unknown) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }

  static unprocessable(message = "Unprocessable Entity", errors?: unknown) {
    return new ApiError(422, message, errors);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(500, message);
  }
}

export default ApiError;
