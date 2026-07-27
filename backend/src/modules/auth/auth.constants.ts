/**
 * Authentication Module Constants
 * --------------------------------
 * Centralized constants used across the authentication module.
 */

export const AUTH_MODULE_NAME = "auth";

export const ACCESS_TOKEN_NAME = "accessToken";

export const REFRESH_TOKEN_NAME = "refreshToken";

/**
 * Password Requirements
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Name Validation
 */
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;

/**
 * Email Validation
 */
export const EMAIL_MAX_LENGTH = 254;

/**
 * JWT
 */
export const ACCESS_TOKEN_EXPIRES_IN = "15m";

export const REFRESH_TOKEN_EXPIRES_IN = "7d";

/**
 * Bcrypt
 * Recommended cost factor for production.
 */
export const BCRYPT_SALT_ROUNDS = 12;

/**
 * Refresh Token Cookie
 */
export const REFRESH_COOKIE_NAME = "examverse_refresh_token";

/**
 * Authentication Messages
 */
export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "User registered successfully.",

  LOGIN_SUCCESS: "Login successful.",

  LOGOUT_SUCCESS: "Logout successful.",

  INVALID_CREDENTIALS: "Invalid email or password.",

  EMAIL_ALREADY_EXISTS: "Email is already registered.",

  ACCOUNT_NOT_FOUND: "Account not found.",

  PASSWORD_MISMATCH: "Incorrect password.",

  UNAUTHORIZED: "Unauthorized.",

  TOKEN_EXPIRED: "Token has expired.",

  INVALID_TOKEN: "Invalid token.",

  ACCESS_DENIED: "Access denied.",

  PASSWORD_UPDATED: "Password updated successfully.",
} as const;

/**
 * Authentication Error Codes
 */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",

  EMAIL_EXISTS: "AUTH_EMAIL_EXISTS",

  USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",

  INVALID_TOKEN: "AUTH_INVALID_TOKEN",

  TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",

  ACCESS_DENIED: "AUTH_ACCESS_DENIED",

  UNAUTHORIZED: "AUTH_UNAUTHORIZED",
} as const;
