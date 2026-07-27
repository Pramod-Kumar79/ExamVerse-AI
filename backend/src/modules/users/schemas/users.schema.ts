import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  avatar: z.string().url().nullable().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),

  newPassword: z.string().min(8).max(128),
});
