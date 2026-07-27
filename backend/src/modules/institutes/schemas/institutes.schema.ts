import { z } from "zod";

export const createInstituteSchema = z.object({
  name: z.string().trim().min(2).max(150),

  code: z.string().trim().min(2).max(50).toUpperCase(),

  email: z.string().email().optional(),

  phone: z.string().optional(),

  website: z.string().url().optional(),

  logo: z.string().url().optional(),

  address: z.string().max(500).optional(),
});

export const updateInstituteSchema = createInstituteSchema.partial();
