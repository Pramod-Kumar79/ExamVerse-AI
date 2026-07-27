import type { z } from "zod";

import type { registerSchema } from "../schemas/auth.schema";

/**
 * Register DTO
 *
 * The DTO type is inferred directly from the Zod schema.
 * This ensures runtime validation and compile-time types
 * always remain in sync.
 */
export type RegisterDto = z.infer<typeof registerSchema>;
