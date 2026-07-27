import { z } from "zod";

export const createBatchSchema = z.object({
  name: z.string().trim().min(2).max(150),

  code: z.string().trim().min(2).max(50).optional(),

  description: z.string().trim().max(500).optional(),

  academicYear: z.string().optional(),

  semester: z.number().int().min(1).max(20).optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  instituteId: z.string().cuid(),
});

export const updateBatchSchema = createBatchSchema
  .omit({
    instituteId: true,
  })
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial();
