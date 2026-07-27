import { AIReviewStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function createPendingAIQuestion(processingJobId: string, documentId: string) {
  return prisma.aIExtractedQuestion.create({
    data: {
      documentId,

      processingJobId, 
      provider: "gemini",

      modelName: "gemini-2.5-flash",
      questionNumber: 1,

      questionType: "MCQ",

      subject: "Physics",

      chapter: "Mechanics",

      topic: "Newton Laws",

      difficulty: "MEDIUM",

      marks: 2,

      negativeMarks: 0,

      questionText: "What is Newton's First Law?",

      options: {
        create: [
          {
            optionText: "A",
            isCorrect: false,
            displayOrder: 1,
          },
          {
            optionText: "B",
            isCorrect: true,
            displayOrder: 2,
          },
          {
            optionText: "C",
            isCorrect: false,
            displayOrder: 3,
          },
          {
            optionText: "D",
            isCorrect: false,
            displayOrder: 4,
          },
        ],
      },

      answer: "A",

      explanation: "Sample explanation",

      confidence: 0.95,

      status: AIReviewStatus.PENDING,
    },
  });
}
