import type { RefreshToken, User } from "@prisma/client";

export interface CreateRefreshTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface IRefreshTokenRepository {
  /**
   * Creates a new refresh token.
   */
  create(data: CreateRefreshTokenInput): Promise<RefreshToken>;

  /**
   * Finds a refresh token by its hash.
   */
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;

  /**
   * Deletes a specific refresh token.
   */
  deleteByTokenHash(tokenHash: string): Promise<void>;

  /**
   * Deletes all refresh tokens for a user.
   */
  deleteByUserId(userId: string): Promise<void>;

  /**
   * Deletes expired refresh tokens.
   */
  deleteExpired(): Promise<number>;

  findValidToken(tokenHash: string): Promise<
    | (RefreshToken & {
        user: User;
      })
    | null
  >;
}
