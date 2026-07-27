import type { NextFunction, Request, Response } from "express";

import { Jwt } from "../../../lib/jwt";

import { UnauthorizedError } from "../../../common/errors";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new UnauthorizedError("Authorization header is missing."));
  }

  if (!authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Invalid authorization header."));
  }

  const token = authorization.substring(7);

  try {
    const payload = Jwt.verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    return next(new UnauthorizedError("Invalid or expired access token."));
  }
}
