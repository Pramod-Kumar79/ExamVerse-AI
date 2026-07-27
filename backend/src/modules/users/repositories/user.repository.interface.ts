import type { User } from "@prisma/client";

import type {
  ChangePasswordDto,
  QueryUsersDto,
  UpdateProfileDto,
} from "../dto";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;

  updateProfile(id: string, data: UpdateProfileDto): Promise<User>;

  updatePassword(id: string, passwordHash: string): Promise<User>;

  findMany(query: QueryUsersDto): Promise<User[]>;

  count(query: QueryUsersDto): Promise<number>;

  softDelete(id: string): Promise<User>;
}
