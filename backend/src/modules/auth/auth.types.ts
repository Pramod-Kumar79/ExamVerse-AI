// /**
//  * Authentication Module Types
//  * --------------------------------
//  * Shared TypeScript interfaces and type aliases used throughout
//  * the authentication module.
//  */

// /**
//  * JWT Payload stored inside access and refresh tokens.
//  */

// import type {User, UserRole } from "@prisma/client";

// export interface JwtPayload {
//   /**
//    * User ID
//    */
//   sub: string;

//   /**
//    * User email
//    */
//   email: string;

//   /**
//    * User role
//    */
//   role: UserRole;
// }

// /**
//  * Registration Request
//  */
// export interface RegisterRequest {
//   name: string;
//   email: string;
//   password: string;
// }

// /**
//  * Login Request
//  */
// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// /**
//  * Authentication Response
//  */
// export interface AuthResponse {
//   accessToken: string;
//   refreshToken: string;

//   user: AuthUser;
// }

// /**
//  * Public user information returned after authentication.
//  */
// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: string;

//   createdAt: Date;
//   updatedAt: Date;
// }

// /**
//  * Refresh Token Payload
//  */
// export interface RefreshTokenPayload {
//   sub: string;
//   tokenId: string;
// }

// /**
//  * Token Pair
//  */
// export interface TokenPair {
//   accessToken: string;
//   refreshToken: string;
// }

// /**
//  * Password Hash Result
//  */
// export interface PasswordHashResult {
//   hash: string;
// }

// /**
//  * Password Comparison Result
//  */
// export interface PasswordComparisonResult {
//   isValid: boolean;
// }

// /**
//  * Generic Authentication Result
//  */
// export interface AuthResult<T = unknown> {
//   success: boolean;

//   message: string;

//   data?: T;
// }

// /**
//  * JWT Token Type
//  */
// export type TokenType = "access" | "refresh";

// /**
//  * Supported User Roles
//  *
//  * Update this union whenever new application roles
//  * are introduced.
//  */
// // export type UserRole = "ADMIN" | "STUDENT" | "TEACHER";

import type { UserRole } from "@prisma/client";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}