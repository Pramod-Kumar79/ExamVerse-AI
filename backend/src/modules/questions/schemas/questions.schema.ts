// import { z } from "zod";
// import { BloomLevel, DifficultyLevel, QuestionType } from "@prisma/client";

// export const createQuestionSchema = z.object({
//   title: z.string().trim().min(3).max(500),

//   description: z.string().trim().optional(),

//   type: z.nativeEnum(QuestionType),

//   difficulty: z.nativeEnum(DifficultyLevel).optional(),

//   bloomLevel: z.nativeEnum(BloomLevel).optional(),

//   chapter: z.string().trim().max(100).optional(),

//   topic: z.string().trim().max(100).optional(),

//   explanation: z.string().trim().optional(),

//   solution: z.string().trim().optional(),

//   tags: z.array(z.string().trim()).optional(),

//   aiGenerated: z.boolean().optional(),

//   imageUrl: z.string().url().optional(),

//   latexContent: z.string().optional(),

//   codeSnippet: z.string().optional(),
// });

// export const updateQuestionSchema = createQuestionSchema
//   .extend({
//     marks: z.number().int().positive().optional(),

//     negativeMarks: z.number().min(0).optional(),

//     estimatedTime: z.number().int().positive().optional(),

//     source: z.string().trim().optional(),

//     year: z.number().int().optional(),

//     language: z.string().trim().optional(),

//     isActive: z.boolean().optional(),

//     options: z
//       .array(
//         z.object({
//           optionText: z.string().trim().min(1),

//           imageUrl: z.string().url().optional(),

//           isCorrect: z.boolean(),

//           displayOrder: z.number().int().positive(),
//         }),
//       )
//       .optional(),
//   })
//   .partial();

// export const bulkDeleteQuestionsSchema = z.object({
//   questionIds: z.array(z.string().cuid()).min(1),
// });

import { z } from "zod";
import { BloomLevel, DifficultyLevel, QuestionType } from "@prisma/client";

export const createQuestionSchema = z.object({
  title: z.string().trim().min(3).max(500),

  description: z.string().trim().optional(),

  type: z.nativeEnum(QuestionType),

  difficulty: z.nativeEnum(DifficultyLevel).optional(),

  bloomLevel: z.nativeEnum(BloomLevel).optional(),

  chapter: z.string().trim().max(100).optional(),

  topic: z.string().trim().max(100).optional(),

  explanation: z.string().trim().optional(),

  solution: z.string().trim().optional(),

  tags: z.array(z.string().trim()).optional(),

  aiGenerated: z.boolean().optional(),

  imageUrl: z.string().min(1).optional(),

  latexContent: z.string().optional(),

  codeSnippet: z.string().optional(),
});

export const updateQuestionSchema = createQuestionSchema
  .extend({
    marks: z.number().int().positive().optional(),

    negativeMarks: z.number().min(0).optional(),

    estimatedTime: z.number().int().positive().optional(),

    source: z.string().trim().optional(),

    year: z.number().int().optional(),

    language: z.string().trim().optional(),

    isActive: z.boolean().optional(),

    options: z
      .array(
        z.object({
          optionText: z.string().trim().min(1),

          imageUrl: z.string().min(1).optional(),

          isCorrect: z.boolean(),

          displayOrder: z.number().int().positive(),
        }),
      )
      .optional(),
  })
  .partial();

export const bulkDeleteQuestionsSchema = z.object({
  questionIds: z.array(z.string().cuid()).min(1),
});