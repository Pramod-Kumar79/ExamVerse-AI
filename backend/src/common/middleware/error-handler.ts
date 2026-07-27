import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

import { env } from "../../config/env";
import { logger } from "../../lib/logger";
import { AppError } from "../errors";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error(error);
    } else {
      logger.warn(error.message);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  logger.error(error);

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production" ? "Internal Server Error" : error.message,
    ...(env.NODE_ENV !== "production" && {
      stack: error.stack,
    }),
  });
};
