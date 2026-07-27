export class ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  constructor(
    statusCode: number,
    message: string,
    data?: T,
    meta?: Record<string, unknown>,
  ) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
  static success<T>(
    message: string,
    data?: T,
    statusCode = 200,
    meta?: Record<string, unknown>,
  ) {
    return new ApiResponse(statusCode, message, data, meta);
  }
  static created<T>(message: string, data?: T) {
    return new ApiResponse(201, message, data);
  }
  static noContent() {
    return new ApiResponse(204, "No Content");
  }
}
