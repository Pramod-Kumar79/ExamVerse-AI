import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().trim().min(2).max(150),

  code: z.string().trim().min(2).max(50).optional(),

  description: z.string().trim().max(500).optional(),
});

export const updateSubjectSchema = createSubjectSchema
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial();
