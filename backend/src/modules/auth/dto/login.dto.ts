import type { z } from "zod";

import type { loginSchema } from "../schemas/auth.schema"
/**
 * Login DTO
 *
 * Inferred directly from the Zod schema to ensure
 * runtime validation and compile-time types stay synchronized.
 */
export type LoginDto = z.infer<typeof loginSchema>;
