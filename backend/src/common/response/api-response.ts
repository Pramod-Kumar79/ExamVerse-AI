import type { Response } from "express";

export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200,
  ): Response<SuccessResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message = "Resource created successfully",
  ): Response<SuccessResponse<T>> {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
