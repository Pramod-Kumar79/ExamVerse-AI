import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";
import { UnauthorizedError } from "../../../common/errors";

import { REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS } from "../auth.cookies";

import type { IAuthService } from "../services/auth.service.interface";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);

    res.cookie(
      REFRESH_COOKIE_NAME,
      result.tokens.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );

    return ApiResponse.created(
      res,
      {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
      "User registered successfully.",
    );
  });

  registerInstitute = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.registerInstitute(req.body);

    return ApiResponse.created(
      res,
      result,
      result.message,
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    res.cookie(
      REFRESH_COOKIE_NAME,
      result.tokens.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );

    return ApiResponse.success(
      res,
      {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
      "Login successful.",
    );
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedError("No refresh token provided.");
    }

    const tokens = await this.authService.refresh(refreshToken);

    res.cookie(
      REFRESH_COOKIE_NAME,
      tokens.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );

    return ApiResponse.success(
      res,
      {
        accessToken: tokens.accessToken,
      },
      "Token refreshed successfully.",
    );
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);

    return ApiResponse.success(res, null, "Logout successful.");
  });

  logoutAll = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.logoutAll(req.user.id);

    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);

    return ApiResponse.success(res, null, "Logged out from all devices.");
  });
}
