import { z } from "zod";

export const createTeacherSchema = z.object({
  userId: z.string().cuid(),

  designation: z.string().trim().max(100).optional(),

  qualification: z.string().trim().max(200).optional(),

  experience: z.number().int().min(0).max(60).optional(),
});

export const updateTeacherSchema = createTeacherSchema
  .omit({
    userId: true,
  })
  .partial();
