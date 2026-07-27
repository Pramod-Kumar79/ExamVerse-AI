import type { User } from "@prisma/client";
import { UserMapper } from "../../../common/mappers";

import { Jwt } from "../../../lib/jwt";
import { Crypto } from "../../../lib/crypto";
import { Bcrypt } from "../../../lib/bcrypt";

import { ConflictError, UnauthorizedError } from "../../../common/errors";
import type { IUserRepository } from "../repositories/user.repository.interface";
import type { IRefreshTokenRepository } from "../repositories/refresh-token.repository.interface";

import type {
  AuthResult,
  AuthTokens,
  IAuthService,
} from "./auth.service.interface";

import type { LoginDto } from "../dto/login.dto";
import type { RegisterDto } from "../dto/register.dto";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  /**
   * Shared token generation pipeline.
   */
  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = Jwt.signAccessToken(payload);

    const refreshToken = Crypto.randomToken();

    const refreshTokenHash = Crypto.sha256(refreshToken);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictError("Email is already registered.");
    }

    const passwordHash = await Bcrypt.hash(dto.password);

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    const tokens = await this.generateTokens(user);

    return {
      user: UserMapper.toDto(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Your account has been deactivated.");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError(
        "Please login using your authentication provider.",
      );
    }

    const isPasswordValid = await Bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const tokens = await this.generateTokens(user);

    return {
      user: UserMapper.toDto(user),
      tokens,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const tokenHash = Crypto.sha256(refreshToken);

    const storedToken =
      await this.refreshTokenRepository.findValidToken(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError("Invalid or expired refresh token.");
    }

    await this.refreshTokenRepository.deleteByTokenHash(tokenHash);

    return this.generateTokens(storedToken.user);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = Crypto.sha256(refreshToken);

    await this.refreshTokenRepository.deleteByTokenHash(tokenHash);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }
}
