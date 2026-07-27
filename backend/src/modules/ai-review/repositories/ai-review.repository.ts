import {
  AIExtractedQuestion,
  AIReviewStatus,
  DifficultyLevel,
  Question,
  QuestionType,
} from "@prisma/client";

import type { UpdateAIQuestionDto } from "../dto";
import { prisma } from "../../../lib/prisma";
import type { QuestionResponse } from "../../ai/validator";

import { IAIReviewRepository } from "./ai-review.repository.interface";
import { mapQuestionType } from "../mappers/question-type.mapper";

export class AIReviewRepository implements IAIReviewRepository {
  async findByProcessingJob(
    processingJobId: string,
  ): Promise<AIExtractedQuestion[]> {
    return prisma.aIExtractedQuestion.findMany({
      where: {
        processingJobId,
      },
      include: {
        options: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        questionNumber: "asc",
      },
    });
  }

  async updateQuestion(
    id: string,
    dto: UpdateAIQuestionDto,
  ): Promise<AIExtractedQuestion> {
    return prisma.$transaction(async (tx) => {
      const updatedQuestion = await tx.aIExtractedQuestion.update({
        where: {
          id,
        },

        data: {
          questionText: dto.questionText,
          questionType: dto.questionType,
          subject: dto.subject,
          chapter: dto.chapter,
          topic: dto.topic,
          difficulty: dto.difficulty,
          marks: dto.marks,
          negativeMarks: dto.negativeMarks,
          answer: dto.answer,
          explanation: dto.explanation,
        },
      });

      if (dto.options) {
        await tx.aIExtractedQuestionOption.deleteMany({
          where: {
            extractedQuestionId: id,
          },
        });

        if (dto.options.length > 0) {
          await tx.aIExtractedQuestionOption.createMany({
            data: dto.options.map((option) => ({
              extractedQuestionId: id,
              optionText: option.optionText,
              isCorrect: option.isCorrect,
              displayOrder: option.displayOrder,
            })),
          });
        }
      }

      return tx.aIExtractedQuestion.findUniqueOrThrow({
        where: {
          id,
        },

        include: {
          options: {
            orderBy: {
              displayOrder: "asc",
            },
          },

          reviewedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  }

  async findById(id: string): Promise<AIExtractedQuestion | null> {
    return prisma.aIExtractedQuestion.findUnique({
      where: {
        id,
      },
    });
  }

  async updateStatus(
    id: string,
    status: AIReviewStatus,
    reviewedById: string,
  ): Promise<AIExtractedQuestion> {
    return prisma.aIExtractedQuestion.update({
      where: {
        id,
      },
      data: {
        status,
        reviewedById,
        reviewedAt: new Date(),
      },
    });
  }

  async createMany(
    processingJobId: string,
    documentId: string,
    questions: QuestionResponse["questions"],
  ): Promise<void> {
    await prisma.$transaction(
      questions.map((question) =>
        prisma.aIExtractedQuestion.create({
          data: {
            documentId,
            processingJobId,

            provider: "gemini",
            modelName: "gemini-2.5-flash",

            questionNumber: question.questionNumber,

            questionType: mapQuestionType(question.questionType),

            subject: question.subject,

            chapter: question.chapter,

            topic: question.topic,

            difficulty: question.difficulty,

            marks: question.marks,

            negativeMarks: question.negativeMarks,

            questionText: question.title,

            description: question.description,

            answer:
              question.correctAnswer == null
                ? undefined
                : question.correctAnswer,

            explanation: question.explanation,

            confidence: question.confidence,

            options: {
              create:
                question.options?.map((option, index) => ({
                  optionText: option.text,
                  isCorrect: option.isCorrect,
                  displayOrder: index + 1,
                })) ?? [],
            },
          },
        }),
      ),
    );
  }

  async publishQuestion(id: string, teacherId: string): Promise<Question> {
  const extracted = await prisma.aIExtractedQuestion.findUnique({
    where: {
      id,
    },

    include: {
      options: {
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
  });

    if (!extracted) {
      throw new Error("AI extracted question not found.");
    }

    if (extracted.status === AIReviewStatus.APPROVED) {
      throw new Error("Question has already been published.");
    }

    return prisma.$transaction(async (tx) => {
      const question = await tx.question.create({
        data: {
          title: extracted.questionText,

          description: null,

          type: mapQuestionType(extracted.questionType),

          difficulty: extracted.difficulty ?? DifficultyLevel.MEDIUM,

          chapter: extracted.chapter,

          topic: extracted.topic,

          explanation: extracted.explanation,

          // solution:
          //   extracted.answer == null ? null : JSON.stringify(extracted.answer),

          solution: extracted.answer == null ? null : String(extracted.answer),

          marks: extracted.marks,

          negativeMarks: extracted.negativeMarks,

          aiGenerated: true,

          createdBy: {
            connect: {
              id: teacherId,
            },
          },

          tags: [],
        },
      });

      await tx.questionOption.createMany({
        data: extracted.options.map((option) => ({
          questionId: question.id,

          optionText: option.optionText,

          imageUrl: null,

          isCorrect: option.isCorrect,

          displayOrder: option.displayOrder,
        })),
      });

    await tx.aIExtractedQuestion.update({
      where: {
        id,
      },
      data: {
        status: AIReviewStatus.APPROVED,

        approvedAt: new Date(),

        reviewedById: teacherId,

        reviewedAt: new Date(),

        publishedQuestionId: question.id,
      },
    });

      return question;
    });
  }
}

