import type { AuthProvider, PrismaClient, User } from "@prisma/client";

import type {
  CreateUserInput,
  IUserRepository,
  UpdatePasswordInput,
} from "./user.repository.interface";

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        authProvider: (data.authProvider as AuthProvider) ?? "EMAIL",
        googleId: data.googleId ?? null,
        avatar: data.avatar ?? null,
      },
    });
  }

  async updatePasswordHash(data: UpdatePasswordInput): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: data.userId,
      },
      data: {
        passwordHash: data.passwordHash,
      },
    });
  }

  async verifyEmail(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: true,
      },
    });
  }

  async setActive(userId: string, isActive: boolean): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive,
      },
    });
  }
}
