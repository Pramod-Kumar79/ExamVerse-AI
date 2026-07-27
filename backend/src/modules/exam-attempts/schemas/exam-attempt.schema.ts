import { z } from "zod";

export const saveAnswerSchema = z.object({
  questionId: z.string().cuid(),

  answer: z.any(),
});
