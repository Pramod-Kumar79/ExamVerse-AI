// import { QuestionType } from "@prisma/client";

// import { NotFoundError } from "../../../common/errors";

// import type { IEvaluationRepository } from "../repositories";
// import type { IEvaluationService } from "./evaluation.service.interface";

// export class EvaluationService implements IEvaluationService {
//   constructor(private readonly evaluationRepository: IEvaluationRepository) {}

//   async evaluateAttempt(attemptId: string): Promise<number> {
//     const attempt =
//       await this.evaluationRepository.findAttemptForEvaluation(attemptId);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     let totalScore = 0;

//     for (const answer of attempt.answers) {
//       const question = answer.question;

//       let obtainedMarks = 0;

//       switch (question.type) {
//         case QuestionType.MCQ: {
//           const studentAnswer = String(answer.answer ?? "");

//           const correctAnswer = question.solution ?? "";

//           if (studentAnswer === correctAnswer) {
//             obtainedMarks = question.marks ?? 0;
//           } else {
//             obtainedMarks = -(question.negativeMarks ?? 0);
//           }

//           break;
//         }

//         default:
//           obtainedMarks = 0;
//       }

//       await this.evaluationRepository.updateStudentAnswer(
//         answer.id,
//         obtainedMarks,
//       );

//       totalScore += obtainedMarks;
//     }

//     await this.evaluationRepository.updateAttemptScore(attemptId, totalScore);

//     return totalScore;
//   }
// }

import { QuestionType } from "@prisma/client";

import { NotFoundError } from "../../../common/errors";

import type { IEvaluationRepository } from "../repositories";
import type { IEvaluationService } from "./evaluation.service.interface";

export class EvaluationService implements IEvaluationService {
  constructor(private readonly evaluationRepository: IEvaluationRepository) {}

  async evaluateAttempt(attemptId: string): Promise<number> {
    const attempt =
      await this.evaluationRepository.findAttemptForEvaluation(attemptId);

    if (!attempt) {
      throw new NotFoundError("Exam attempt not found.");
    }

    let totalScore = 0;

    for (const answer of attempt.answers) {
      const question = answer.question;

      let obtainedMarks = 0;

      switch (question.type) {
        case QuestionType.MCQ:
        case QuestionType.TRUE_FALSE: {
          const studentAnswer = String(answer.answer ?? "").trim();

          const correctAnswer = (question.solution ?? "").trim();

          if (correctAnswer && studentAnswer === correctAnswer) {
            obtainedMarks = question.marks ?? 0;
          } else if (correctAnswer) {
            obtainedMarks = -(question.negativeMarks ?? 0);
          } else {
            // No solution has been set on this question — nothing to grade
            // against, so leave it for manual review rather than penalizing
            // the student for a data-entry gap.
            obtainedMarks = 0;
          }

          break;
        }

        case QuestionType.NUMERICAL: {
          const studentValue = Number(answer.answer);
          const correctValue = Number(question.solution);

          const bothValid =
            !Number.isNaN(studentValue) && !Number.isNaN(correctValue);
          const tolerance = 0.01;

          if (bothValid && Math.abs(studentValue - correctValue) <= tolerance) {
            obtainedMarks = question.marks ?? 0;
          } else if (bothValid) {
            obtainedMarks = -(question.negativeMarks ?? 0);
          } else {
            obtainedMarks = 0;
          }

          break;
        }

        default:
          // MULTIPLE_SELECT, SHORT_ANSWER, LONG_ANSWER, and CODING answers
          // aren't reliably auto-gradable with simple string matching — they
          // stay at 0 here and are left for a teacher to grade manually.
          obtainedMarks = 0;
      }

      await this.evaluationRepository.updateStudentAnswer(
        answer.id,
        obtainedMarks,
      );

      totalScore += obtainedMarks;
    }

    await this.evaluationRepository.updateAttemptScore(attemptId, totalScore);

    return totalScore;
  }
}