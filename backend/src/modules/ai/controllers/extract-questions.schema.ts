import { z } from "zod";

export const extractQuestionsSchema = z.object({
  text: z.string().min(1),
});
