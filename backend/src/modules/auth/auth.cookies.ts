import type { CookieOptions } from "express";

import { env } from "../../config/env";

export const REFRESH_COOKIE_NAME = "refreshToken";

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
