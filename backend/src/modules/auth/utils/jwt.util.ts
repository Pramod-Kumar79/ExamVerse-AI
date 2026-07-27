import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "../../../config/env";
import type { JwtPayload } from "../auth.types";

export class JwtUtil {
  /**
   * Generate Access Token
   */
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    });
  }

  /**
   * Generate Refresh Token
   */
  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    });
  }

  /**
   * Verify Access Token
   */
  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as JwtPayload;
  }

  /**
   * Verify Refresh Token
   */
  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
  }
}
