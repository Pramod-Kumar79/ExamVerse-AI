import { z } from "zod";

import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../auth.constants";

/**
 * Email validation
 */
const emailSchema = z
  .string({
    error: "Email is required.",
  })
  .trim()
  .toLowerCase()
  .max(
    EMAIL_MAX_LENGTH,
    `Email must not exceed ${EMAIL_MAX_LENGTH} characters.`,
  )
  .email("Please provide a valid email address.");

/**
 * Name validation
 */
const nameSchema = z
  .string({
    error: "Name is required.",
  })
  .trim()
  .min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters.`)
  .max(NAME_MAX_LENGTH, `Name must not exceed ${NAME_MAX_LENGTH} characters.`)
  .regex(/^[A-Za-z\s'-]+$/, "Name contains invalid characters.");

/**
 * Password validation
 *
 * Requirements:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
const passwordSchema = z
  .string({
    error: "Password is required.",
  })
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `Password must not exceed ${PASSWORD_MAX_LENGTH} characters.`,
  )
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/\d/, "Password must contain at least one number.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character.",
  );

/**
 * Register Schema
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

/**
 * Login Schema
 */
export const loginSchema = z
  .object({
    email: emailSchema,
    password: z
      .string({
        error: "Password is required.",
      })
      .min(1, "Password is required."),
  })
  .strict();

/**
 * Reusable field schemas
 */
export { emailSchema, nameSchema, passwordSchema };

/**
 * Inferred Types
 */
export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;