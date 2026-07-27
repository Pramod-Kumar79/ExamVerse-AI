import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export class Bcrypt {
  /**
   * Hash a plain-text password.
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
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
