import type { UserRole } from "@prisma/client";

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}
