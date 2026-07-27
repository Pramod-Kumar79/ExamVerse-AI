import type { PrismaClient, RefreshToken } from "@prisma/client";

import type {
  CreateRefreshTokenInput,
  IRefreshTokenRepository,
} from "./refresh-token.repository.interface";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateRefreshTokenInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        tokenHash,
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Performance Optimized: Fetches token validation and relation user payload
   * in a single atomic database trip.
   */
  async findValidToken(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });
  }
}
