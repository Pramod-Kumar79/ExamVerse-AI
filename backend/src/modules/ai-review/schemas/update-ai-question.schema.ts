import { z } from "zod";

export const UpdateAIQuestionSchema = z.object({
  questionText: z.string().optional(),

  questionType: z
    .enum([
      "MCQ",
      "MULTIPLE_SELECT",
      "TRUE_FALSE",
      "NUMERICAL",
      "SHORT_ANSWER",
      "LONG_ANSWER",
    ])
    .optional(),

  subject: z.string().optional(),

  chapter: z.string().optional(),

  topic: z.string().optional(),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),

  marks: z.number().optional(),

  negativeMarks: z.number().optional(),

  answer: z.any().optional(),

  explanation: z.string().optional(),

  options: z
    .array(
      z.object({
        id: z.string().optional(),

        optionText: z.string(),

        isCorrect: z.boolean(),

        displayOrder: z.number(),
      }),
    )
    .optional(),
});

export type UpdateAIQuestionRequest = z.infer<typeof UpdateAIQuestionSchema>;
