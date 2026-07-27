import { z } from "zod";

export const createStudentSchema = z.object({
  userId: z.string().cuid(),

  batchId: z.string().cuid(),

  rollNumber: z.string().trim().max(50).optional(),

  semester: z.number().int().min(1).max(20).optional(),
});

export const updateStudentSchema = createStudentSchema
  .omit({
    userId: true,
  })
  .partial();
