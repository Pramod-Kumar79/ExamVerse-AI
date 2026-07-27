import bcrypt from "bcrypt";

import { BCRYPT_SALT_ROUNDS } from "../auth.constants";

export class BcryptUtil {
  /**
   * Hash a plain-text password.
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  /**
   * Compare a plain-text password with a stored hash.
   */
  static async compare(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
