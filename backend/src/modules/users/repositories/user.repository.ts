import type { PrismaClient, Prisma, User } from "@prisma/client";

import type { QueryUsersDto, UpdateProfileDto } from "../dto";
import { resolvePagination } from "../../../common/utils";

import type { IUserRepository } from "./user.repository.interface";

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        passwordHash,
      },
    });
  }

  async findMany(query: QueryUsersDto): Promise<User[]> {
    const { search, role, isActive } = query;

    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.UserWhereInput = {
      role,
      isActive,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(query: QueryUsersDto): Promise<number> {
    const { search, role, isActive } = query;

    const where: Prisma.UserWhereInput = {
      role,
      isActive,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.user.count({
      where,
    });
  }

  async softDelete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}
