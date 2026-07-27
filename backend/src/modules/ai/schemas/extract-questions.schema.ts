import { z } from "zod";

export const extractQuestionsSchema = z.object({
  documentId: z.string().min(1),

  text: z.string().min(1),
});
