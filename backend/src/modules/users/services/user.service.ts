import { NotFoundError, UnauthorizedError } from "../../../common/errors";

import { Bcrypt } from "../../../lib/bcrypt";

import { UserMapper } from "../../../common/mappers";

import type { IUserRepository } from "../repositories";
import type {
  ChangePasswordDto,
  QueryUsersDto,
  UpdateProfileDto,
} from "../dto";

import type { IUserService, PaginatedUsers } from "./user.service.interface";
import { buildPagination } from "../../../common/utils";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getMe(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return UserMapper.toDto(user);
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return UserMapper.toDto(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.updateProfile(userId, dto);

    return UserMapper.toDto(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError(
        "Password login is not available for this account.",
      );
    }

    const isValid = await Bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isValid) {
      throw new UnauthorizedError("Current password is incorrect.");
    }

    const passwordHash = await Bcrypt.hash(dto.newPassword);

    await this.userRepository.updatePassword(userId, passwordHash);
  }

  async listUsers(query: QueryUsersDto): Promise<PaginatedUsers> {
    const users = await this.userRepository.findMany(query);

    const total = await this.userRepository.count(query);

    return {
      users: users.map(UserMapper.toDto),
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.userRepository.softDelete(userId);
  }
}
