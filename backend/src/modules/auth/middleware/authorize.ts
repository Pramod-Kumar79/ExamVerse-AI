import type { NextFunction, Request, Response } from "express";

import type { UserRole } from "@prisma/client";

import { ForbiddenError } from "../../../common/errors";

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          "You do not have permission to perform this action.",
        ),
      );
    }

    next();
  };
}
