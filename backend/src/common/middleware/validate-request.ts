import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

import { BadRequestError } from "../errors";

type RequestPart = "body" | "query" | "params";

export const validateRequest =
  (schema: ZodTypeAny, target: RequestPart = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(
        new BadRequestError(
          result.error.issues.map((issue) => issue.message).join(", "),
        ),
      );
    }

    // req[target] = result.data;
    Object.assign(req[target], result.data);

    next();
  };