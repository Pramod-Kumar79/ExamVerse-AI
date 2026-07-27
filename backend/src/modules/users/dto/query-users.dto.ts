import type { UserRole } from "@prisma/client";

export interface QueryUsersDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}
