import type { UserResponseDto, PaginationDto } from "../../../common/dto";

import type {
  ChangePasswordDto,
  QueryUsersDto,
  UpdateProfileDto,
} from "../dto";

export interface PaginatedUsers {
  users: UserResponseDto[];
  pagination: PaginationDto;
}

export interface IUserService {
  getMe(userId: string): Promise<UserResponseDto>;

  getUserById(userId: string): Promise<UserResponseDto>;

  updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserResponseDto>;

  changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;

  listUsers(query: QueryUsersDto): Promise<PaginatedUsers>;

  deleteAccount(userId: string): Promise<void>;
}
