import { prisma } from "../../../lib/prisma";

// import type { ExamAttempt } from "@prisma/client";

import type { EvaluationAttempt } from "./evaluation.repository.interface";

import type { IEvaluationRepository } from "./evaluation.repository.interface";

export class EvaluationRepository implements IEvaluationRepository {
  async findAttemptForEvaluation(
    attemptId: string,
  ): Promise<EvaluationAttempt | null> {
    return prisma.examAttempt.findUnique({
      where: {
        id: attemptId,
      },

      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });
  }

  async updateStudentAnswer(
    answerId: string,
    obtainedMarks: number,
  ): Promise<void> {
    await prisma.studentAnswer.update({
      where: {
        id: answerId,
      },

      data: {
        obtainedMarks,
        evaluated: true,
      },
    });
  }

  async updateAttemptScore(attemptId: string, score: number): Promise<void> {
    await prisma.examAttempt.update({
      where: {
        id: attemptId,
      },

      data: {
        score,
      },
    });
  }
}
