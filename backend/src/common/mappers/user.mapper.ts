import type { User } from "@prisma/client";

import type { UserResponseDto } from "../dto";

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
