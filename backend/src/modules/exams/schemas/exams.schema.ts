// import { z } from "zod";

// export const createExamSchema = z.object({
//   title: z.string().min(3).max(200),

//   description: z.string().optional(),

//   instructions: z.string().optional(),

//   courseId: z.string().cuid(),

//   startTime: z.coerce.date(),

//   endTime: z.coerce.date(),

//   durationMinutes: z.number().int().positive(),

//   totalMarks: z.number().positive(),

//   passingMarks: z.number().positive(),

//   negativeMarking: z.boolean().optional(),

//   shuffleQuestions: z.boolean().optional(),

//   shuffleOptions: z.boolean().optional(),

//   showResultImmediately: z.boolean().optional(),

//   maxAttempts: z.number().int().positive().optional(),
// });

// export const updateExamSchema = createExamSchema
//   .omit({
//     courseId: true,
//   })
//   .partial()
//   .extend({
//     status: z
//       .enum(["DRAFT", "SCHEDULED", "LIVE", "COMPLETED", "ARCHIVED"])
//       .optional(),
//     isPublished: z.boolean().optional(),
//   });

// export const createPracticeExamSchema = z.object({
//   title: z.string().min(3).max(200).optional(),

//   chapter: z.string().optional(),

//   topic: z.string().optional(),

//   difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),

//   type: z
//     .enum([
//       "MCQ",
//       "MULTIPLE_SELECT",
//       "TRUE_FALSE",
//       "NUMERICAL",
//       "SHORT_ANSWER",
//       "LONG_ANSWER",
//       "CODING",
//     ])
//     .optional(),

//   questionCount: z.number().int().positive().max(50),

//   durationMinutes: z.number().int().positive().max(300),

//   negativeMarking: z.boolean().optional(),
// });

import { z } from "zod";

export const createExamSchema = z.object({
  title: z.string().min(3).max(200),

  description: z.string().optional(),

  instructions: z.string().optional(),

  courseId: z.string().cuid(),

  startTime: z.coerce.date(),

  endTime: z.coerce.date(),

  durationMinutes: z.number().int().positive(),

  totalMarks: z.number().positive(),

  passingMarks: z.number().positive(),

  negativeMarking: z.boolean().optional(),

  shuffleQuestions: z.boolean().optional(),

  shuffleOptions: z.boolean().optional(),

  showResultImmediately: z.boolean().optional(),

  maxAttempts: z.number().int().positive().optional(),
});

export const updateExamSchema = createExamSchema
  .omit({
    courseId: true,
  })
  .partial()
  .extend({
    status: z
      .enum(["DRAFT", "SCHEDULED", "LIVE", "COMPLETED", "ARCHIVED"])
      .optional(),
    isPublished: z.boolean().optional(),
  });

export const createPracticeExamSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),

    questionIds: z.array(z.string().cuid()).min(1).max(50).optional(),

    chapter: z.string().optional(),

    topic: z.string().optional(),

    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),

    type: z
      .enum([
        "MCQ",
        "MULTIPLE_SELECT",
        "TRUE_FALSE",
        "NUMERICAL",
        "SHORT_ANSWER",
        "LONG_ANSWER",
        "CODING",
      ])
      .optional(),

    questionCount: z.number().int().positive().max(50).optional(),

    durationMinutes: z.number().int().positive().max(300),

    negativeMarking: z.boolean().optional(),
  })
  .refine((data) => data.questionIds?.length || data.questionCount, {
    message:
      "Either pick specific questions or set a question count for random selection.",
  });