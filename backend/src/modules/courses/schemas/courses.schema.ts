import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().trim().min(2).max(150),

  code: z.string().trim().min(2).max(50),

  description: z.string().trim().max(500).optional(),

  instituteId: z.string().cuid(),

  subjectId: z.string().cuid(),

  teacherId: z.string().cuid(),

  batchId: z.string().cuid(),

  academicYear: z.string().optional(),

  semester: z.number().int().min(1).max(20).optional(),

  credits: z.number().int().min(1).max(20).optional(),
});

export const updateCourseSchema = createCourseSchema
  .omit({
    instituteId: true,
  })
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial();
