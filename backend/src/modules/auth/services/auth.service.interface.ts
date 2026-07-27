import type { UserResponseDto } from "../../../common/dto";

import type { LoginDto } from "../dto/login.dto";
import type { RegisterDto } from "../dto/register.dto";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: UserResponseDto;
  tokens: AuthTokens;
}

export interface IAuthService {
  register(dto: RegisterDto): Promise<AuthResult>;

  login(dto: LoginDto): Promise<AuthResult>;

  refresh(refreshToken: string): Promise<AuthTokens>;

  logout(refreshToken: string): Promise<void>;

  logoutAll(userId: string): Promise<void>;
}
