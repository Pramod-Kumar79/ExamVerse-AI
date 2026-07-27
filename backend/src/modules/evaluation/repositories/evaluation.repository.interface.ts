// import type { ExamAttempt } from "@prisma/client";

import type { Prisma } from "@prisma/client";

export type EvaluationAttempt = Prisma.ExamAttemptGetPayload<{
  include: {
    answers: {
      include: {
        question: true;
      };
    };
  };
}>;

export interface IEvaluationRepository {
  findAttemptForEvaluation(
    attemptId: string,
  ): Promise<EvaluationAttempt | null>;

  updateStudentAnswer(answerId: string, obtainedMarks: number): Promise<void>;

  updateAttemptScore(attemptId: string, score: number): Promise<void>;
}
