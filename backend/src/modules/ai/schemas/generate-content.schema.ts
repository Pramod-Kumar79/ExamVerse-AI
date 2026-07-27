import { z } from "zod";

export const generateContentSchema = z.object({
  prompt: z.string().min(1).max(10000),
});
