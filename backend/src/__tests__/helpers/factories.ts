import { UserRole } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { Bcrypt } from "../../lib/bcrypt";

export async function createTeacher() {
  const password = "Password@123";
  const passwordHash = await Bcrypt.hash(password);

  const user = await prisma.user.create({
    data: {
      name: "Test Teacher",
      email: `teacher${Date.now()}@example.com`,
      passwordHash,
      role: UserRole.TEACHER,
    },
  });

  return {
    user,
    password,
  };
}

export async function createUploadedDocument(userId: string) {
  return prisma.uploadedDocument.create({
    data: {
      originalName: "sample.pdf",
      storedName: `sample-${Date.now()}.pdf`,
      mimeType: "application/pdf",
      extension: "pdf",
      fileSize: 1024,
      storagePath: "/uploads/sample.pdf",
      uploadedById: userId,
    },
  });
}

export async function createProcessingJob(documentId: string) {
  return prisma.processingJob.create({
    data: {
      documentId,
    },
  });
}

import { AIReviewStatus } from "@prisma/client";

export async function createPendingAIQuestion(
  processingJobId: string,
  documentId: string,
) {
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

      topic: "Newton's Laws",

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