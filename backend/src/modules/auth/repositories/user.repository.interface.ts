import type { User } from "@prisma/client";

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  authProvider?: "EMAIL" | "GOOGLE";
  googleId?: string | null;
  avatar?: string | null;
}

export interface UpdatePasswordInput {
  userId: string;
  passwordHash: string;
}

export interface IUserRepository {
  /**
   * Find user by primary key.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user.
   */
  create(data: CreateUserInput): Promise<User>;

  /**
   * Update the user's password hash.
   */
  updatePasswordHash(data: UpdatePasswordInput): Promise<User>;

  /**
   * Mark the user's email as verified.
   */
  verifyEmail(userId: string): Promise<User>;

  /**
   * Activate or deactivate a user.
   */
  setActive(userId: string, isActive: boolean): Promise<User>;
}
