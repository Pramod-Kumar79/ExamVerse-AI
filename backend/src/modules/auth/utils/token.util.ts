import crypto from "crypto";

export class TokenUtil {
  /**
   * Generate a cryptographically secure random token.
   */
  static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  /**
   * Hash a refresh token before storing it in the database.
   */
  static hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Compare a raw token with a stored hash.
   */
  static verifyToken(token: string, tokenHash: string): boolean {
    return this.hashToken(token) === tokenHash;
  }
}
