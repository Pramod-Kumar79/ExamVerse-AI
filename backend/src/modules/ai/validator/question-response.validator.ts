import { z } from "zod";

export const QuestionResponseSchema = z.object({
  questions: z.array(
    z.object({
      questionNumber: z.number().int().positive(),

      questionType: z.enum([
        "MCQ",
        "MULTIPLE_SELECT",
        "TRUE_FALSE",
        "NUMERICAL",
        "SHORT_ANSWER",
        "LONG_ANSWER",
      ]),

      subject: z.string().optional().nullable(),

      chapter: z.string().optional().nullable(),

      topic: z.string().optional().nullable(),

      difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),

      title: z.string(),

      description: z.string().optional().nullable(),

      options: z.array(
        z.object({
          label: z.string(),

          text: z.string(),

          isCorrect: z.boolean(),
        }),
      ),

      correctAnswer: z.string().optional().nullable(),

      explanation: z.string().optional().nullable(),

      marks: z.number().optional().nullable(),

      negativeMarks: z.number().optional().nullable(),

      confidence: z.number().min(0).max(1),

      tags: z.array(z.string()),

      language: z.string(),
    }),
  ),
});

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;

export class QuestionResponseValidator {
  static validate(data: unknown): QuestionResponse {
    return QuestionResponseSchema.parse(data);
  }
}
