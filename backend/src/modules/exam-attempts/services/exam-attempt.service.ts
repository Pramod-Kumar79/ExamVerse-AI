// import type { ExamAttempt } from "@prisma/client";

// import { BadRequestError, NotFoundError } from "../../../common/errors";

// import type { IExamRepository } from "../../exams/repositories";
// import type { IStudentRepository } from "../../students/repositories";
// import type { IEvaluationService } from "../../evaluation/services";
// import type { IExamAttemptRepository } from "../repositories";
// import type { StartExamDto } from "../dto";

// import type { IExamAttemptService } from "./exam-attempt.service.interface";
// import type { SaveAnswerDto } from "../dto";
// import { AttemptStatus } from "@prisma/client";

// export class ExamAttemptService implements IExamAttemptService {
//   constructor(
//     private readonly examAttemptRepository: IExamAttemptRepository,
//     private readonly examRepository: IExamRepository,
//     private readonly studentRepository: IStudentRepository,
//     private readonly evaluationService: IEvaluationService,
//   ) {}

//   async startExam(userId: string, dto: StartExamDto): Promise<ExamAttempt> {
//     const exam = await this.examRepository.findById(dto.examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     if (!exam.isPublished) {
//       throw new BadRequestError("Exam is not published.");
//     }

//     const studentProfile = await this.studentRepository.findByUserId(userId);

//     if (!studentProfile) {
//       throw new BadRequestError(
//         "No student profile is linked to this account. Ask your institute admin to set one up before taking exams.",
//       );
//     }

//     const previousAttempts =
//       await this.examAttemptRepository.findByExamAndStudent(
//         dto.examId,
//         studentProfile.id,
//       );

//     const inProgress = previousAttempts.find(
//       (attempt) => attempt.status === AttemptStatus.IN_PROGRESS,
//     );

//     if (inProgress) {
//       return inProgress;
//     }

//     const maxAttempts = exam.maxAttempts ?? 1;
//     const usedAttempts = previousAttempts.filter(
//       (attempt) => attempt.status !== AttemptStatus.IN_PROGRESS,
//     ).length;

//     if (usedAttempts >= maxAttempts) {
//       throw new BadRequestError(
//         maxAttempts === 1
//           ? "You have already attempted this exam. Retakes are not allowed for this exam."
//           : `You have used all ${maxAttempts} of your allowed attempts for this exam.`,
//       );
//     }

//     return this.examAttemptRepository.createAttempt(
//       dto.examId,
//       studentProfile.id,
//     );
//   }

//   async saveAnswer(attemptId: string, dto: SaveAnswerDto): Promise<void> {
//     const attempt = await this.examAttemptRepository.findById(attemptId);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     if (attempt.status !== AttemptStatus.IN_PROGRESS) {
//       throw new BadRequestError("Cannot save answers for a submitted exam.");
//     }

//     await this.examAttemptRepository.saveAnswer(
//       attemptId,
//       dto.questionId,
//       dto.answer,
//     );
//   }

//   async getAttempt(id: string): Promise<ExamAttempt> {
//     const attempt = await this.examAttemptRepository.findAttemptWithExam(id);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     return attempt;
//   }

//   async submitExam(id: string): Promise<void> {
//     const attempt = await this.examAttemptRepository.findById(id);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     if (attempt.status !== AttemptStatus.IN_PROGRESS) {
//       throw new BadRequestError("Exam has already been submitted.");
//     }

//     await this.examAttemptRepository.submitAttempt(id);

//     // Auto-grade immediately so students (and teachers) see a result right
//     // away instead of requiring a separate manual evaluation step. Only
//     // objective question types (MCQ, TRUE_FALSE, NUMERICAL) can be scored
//     // automatically; anything else is left for manual grading later and
//     // won't block this from completing.
//     try {
//       await this.evaluationService.evaluateAttempt(id);
//     } catch {
//       // Evaluation failing shouldn't block the submission itself from
//       // succeeding — the attempt is still recorded as submitted either way.
//     }
//   }

//   async getResultsForExam(examId: string): Promise<ExamAttempt[]> {
//     const exam = await this.examRepository.findById(examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     return this.examAttemptRepository.findManyByExam(examId);
//   }
// }

// import type { ExamAttempt } from "@prisma/client";

// import { BadRequestError, NotFoundError } from "../../../common/errors";

// import type { IExamRepository } from "../../exams/repositories";
// import type { IStudentRepository } from "../../students/repositories";
// import type { IEvaluationService } from "../../evaluation/services";
// import type { IExamAttemptRepository } from "../repositories";
// import type { StartExamDto } from "../dto";

// import type { IExamAttemptService } from "./exam-attempt.service.interface";
// import type { SaveAnswerDto } from "../dto";
// import { AttemptStatus } from "@prisma/client";

// export class ExamAttemptService implements IExamAttemptService {
//   constructor(
//     private readonly examAttemptRepository: IExamAttemptRepository,
//     private readonly examRepository: IExamRepository,
//     private readonly studentRepository: IStudentRepository,
//     private readonly evaluationService: IEvaluationService,
//   ) {}

//   async startExam(userId: string, dto: StartExamDto): Promise<ExamAttempt> {
//     const exam = await this.examRepository.findById(dto.examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     if (!exam.isPublished) {
//       throw new BadRequestError("Exam is not published.");
//     }

//     const studentProfile = await this.studentRepository.findByUserId(userId);

//     if (!studentProfile) {
//       throw new BadRequestError(
//         "No student profile is linked to this account. Ask your institute admin to set one up before taking exams.",
//       );
//     }

//     const previousAttempts =
//       await this.examAttemptRepository.findByExamAndStudent(
//         dto.examId,
//         studentProfile.id,
//       );

//     const inProgress = previousAttempts.find(
//       (attempt) => attempt.status === AttemptStatus.IN_PROGRESS,
//     );

//     if (inProgress) {
//       return inProgress;
//     }

//     const maxAttempts = exam.maxAttempts ?? 1;
//     const usedAttempts = previousAttempts.filter(
//       (attempt) => attempt.status !== AttemptStatus.IN_PROGRESS,
//     ).length;

//     if (usedAttempts >= maxAttempts) {
//       throw new BadRequestError(
//         maxAttempts === 1
//           ? "You have already attempted this exam. Retakes are not allowed for this exam."
//           : `You have used all ${maxAttempts} of your allowed attempts for this exam.`,
//       );
//     }

//     return this.examAttemptRepository.createAttempt(
//       dto.examId,
//       studentProfile.id,
//     );
//   }

//   async saveAnswer(attemptId: string, dto: SaveAnswerDto): Promise<void> {
//     const attempt = await this.examAttemptRepository.findById(attemptId);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     if (attempt.status !== AttemptStatus.IN_PROGRESS) {
//       throw new BadRequestError("Cannot save answers for a submitted exam.");
//     }

//     await this.examAttemptRepository.saveAnswer(
//       attemptId,
//       dto.questionId,
//       dto.answer,
//     );
//   }

//   async getAttempt(id: string): Promise<ExamAttempt> {
//     const attempt = await this.examAttemptRepository.findAttemptWithExam(id);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     return attempt;
//   }

//   async submitExam(id: string): Promise<void> {
//     const attempt = await this.examAttemptRepository.findById(id);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     if (attempt.status !== AttemptStatus.IN_PROGRESS) {
//       throw new BadRequestError("Exam has already been submitted.");
//     }

//     await this.examAttemptRepository.submitAttempt(id);

//     // Auto-grade immediately so students (and teachers) see a result right
//     // away instead of requiring a separate manual evaluation step. Only
//     // objective question types (MCQ, TRUE_FALSE, NUMERICAL) can be scored
//     // automatically; anything else is left for manual grading later and
//     // won't block this from completing.
//     try {
//       await this.evaluationService.evaluateAttempt(id);
//     } catch {
//       // Evaluation failing shouldn't block the submission itself from
//       // succeeding — the attempt is still recorded as submitted either way.
//     }
//   }

//   async getResultsForExam(examId: string): Promise<ExamAttempt[]> {
//     const exam = await this.examRepository.findById(examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     return this.examAttemptRepository.findManyByExam(examId);
//   }

//   async getMyAttempts(userId: string): Promise<ExamAttempt[]> {
//     const studentProfile = await this.studentRepository.findByUserId(userId);

//     if (!studentProfile) {
//       return [];
//     }

//     return this.examAttemptRepository.findManyByStudent(studentProfile.id);
//   }
// }

// import type { ExamAttempt } from "@prisma/client";
// import { UserRole } from "@prisma/client";

// import {
//   BadRequestError,
//   ForbiddenError,
//   NotFoundError,
// } from "../../../common/errors";

// import type { IExamRepository } from "../../exams/repositories";
// import type { IStudentRepository } from "../../students/repositories";
// import type { IEvaluationService } from "../../evaluation/services";
// import type { IExamAttemptRepository } from "../repositories";
// import type { StartExamDto } from "../dto";

// import type {
//   IExamAttemptService,
//   RequestingUser,
// } from "./exam-attempt.service.interface";
// import type { SaveAnswerDto } from "../dto";
// import { AttemptStatus } from "@prisma/client";

// const STAFF_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.TEACHER];

// export class ExamAttemptService implements IExamAttemptService {
//   constructor(
//     private readonly examAttemptRepository: IExamAttemptRepository,
//     private readonly examRepository: IExamRepository,
//     private readonly studentRepository: IStudentRepository,
//     private readonly evaluationService: IEvaluationService,
//   ) {}

//   /**
//    * Ensures the requesting user is allowed to view/modify a given attempt.
//    * Staff (admins/teachers) can access any attempt. Students may only
//    * access their own — verified against their linked StudentProfile, not
//    * just their raw user id, since attempts are keyed by StudentProfile.id.
//    */
//   private async assertCanAccessAttempt(
//     attempt: { studentId: string },
//     requestingUser: RequestingUser,
//   ): Promise<void> {
//     if (STAFF_ROLES.includes(requestingUser.role)) {
//       return;
//     }

//     const studentProfile = await this.studentRepository.findByUserId(
//       requestingUser.id,
//     );

//     if (!studentProfile || studentProfile.id !== attempt.studentId) {
//       throw new ForbiddenError(
//         "You do not have permission to access this exam attempt.",
//       );
//     }
//   }

//   async startExam(userId: string, dto: StartExamDto): Promise<ExamAttempt> {
//     const exam = await this.examRepository.findById(dto.examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     if (!exam.isPublished) {
//       throw new BadRequestError("Exam is not published.");
//     }

//     const studentProfile = await this.studentRepository.findByUserId(userId);

//     if (!studentProfile) {
//       throw new BadRequestError(
//         "No student profile is linked to this account. Ask your institute admin to set one up before taking exams.",
//       );
//     }

//     const previousAttempts =
//       await this.examAttemptRepository.findByExamAndStudent(
//         dto.examId,
//         studentProfile.id,
//       );

//     const inProgress = previousAttempts.find(
//       (attempt) => attempt.status === AttemptStatus.IN_PROGRESS,
//     );

//     if (inProgress) {
//       return inProgress;
//     }

//     const maxAttempts = exam.maxAttempts ?? 1;
//     const usedAttempts = previousAttempts.filter(
//       (attempt) => attempt.status !== AttemptStatus.IN_PROGRESS,
//     ).length;

//     if (usedAttempts >= maxAttempts) {
//       throw new BadRequestError(
//         maxAttempts === 1
//           ? "You have already attempted this exam. Retakes are not allowed for this exam."
//           : `You have used all ${maxAttempts} of your allowed attempts for this exam.`,
//       );
//     }

//     return this.examAttemptRepository.createAttempt(
//       dto.examId,
//       studentProfile.id,
//     );
//   }

//   async saveAnswer(
//     attemptId: string,
//     dto: SaveAnswerDto,
//     requestingUser: RequestingUser,
//   ): Promise<void> {
//     const attempt = await this.examAttemptRepository.findById(attemptId);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     await this.assertCanAccessAttempt(attempt, requestingUser);

//     if (attempt.status !== AttemptStatus.IN_PROGRESS) {
//       throw new BadRequestError("Cannot save answers for a submitted exam.");
//     }

//     await this.examAttemptRepository.saveAnswer(
//       attemptId,
//       dto.questionId,
//       dto.answer,
//     );
//   }

//   async getAttempt(
//     id: string,
//     requestingUser: RequestingUser,
//   ): Promise<ExamAttempt> {
//     const attempt = await this.examAttemptRepository.findAttemptWithExam(id);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     await this.assertCanAccessAttempt(attempt, requestingUser);

//     return attempt;
//   }

//   async submitExam(id: string, requestingUser: RequestingUser): Promise<void> {
//     const attempt = await this.examAttemptRepository.findById(id);

//     if (!attempt) {
//       throw new NotFoundError("Exam attempt not found.");
//     }

//     await this.assertCanAccessAttempt(attempt, requestingUser);

//     if (attempt.status !== AttemptStatus.IN_PROGRESS) {
//       throw new BadRequestError("Exam has already been submitted.");
//     }

//     await this.examAttemptRepository.submitAttempt(id);

//     // Auto-grade immediately so students (and teachers) see a result right
//     // away instead of requiring a separate manual evaluation step. Only
//     // objective question types (MCQ, TRUE_FALSE, NUMERICAL) can be scored
//     // automatically; anything else is left for manual grading later and
//     // won't block this from completing.
//     try {
//       await this.evaluationService.evaluateAttempt(id);
//     } catch {
//       // Evaluation failing shouldn't block the submission itself from
//       // succeeding — the attempt is still recorded as submitted either way.
//     }
//   }

//   async getResultsForExam(examId: string): Promise<ExamAttempt[]> {
//     const exam = await this.examRepository.findById(examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     return this.examAttemptRepository.findManyByExam(examId);
//   }

//   async getMyAttempts(userId: string): Promise<ExamAttempt[]> {
//     const studentProfile = await this.studentRepository.findByUserId(userId);

//     if (!studentProfile) {
//       return [];
//     }

//     return this.examAttemptRepository.findManyByStudent(studentProfile.id);
//   }
// }

import type { ExamAttempt } from "@prisma/client";
import { UserRole } from "@prisma/client";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../common/errors";

import type { IExamRepository } from "../../exams/repositories";
import type { IStudentRepository } from "../../students/repositories";
import type { IEvaluationService } from "../../evaluation/services";
import type { IExamAttemptRepository } from "../repositories";
import type { StartExamDto } from "../dto";

import type {
  IExamAttemptService,
  RequestingUser,
} from "./exam-attempt.service.interface";
import type { SaveAnswerDto } from "../dto";
import { AttemptStatus } from "@prisma/client";
import { EXAM_WINDOW_BUFFER_MINUTES } from "../exam-attempts.constants";

const STAFF_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.TEACHER];

export class ExamAttemptService implements IExamAttemptService {
  constructor(
    private readonly examAttemptRepository: IExamAttemptRepository,
    private readonly examRepository: IExamRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly evaluationService: IEvaluationService,
  ) {}

  /**
   * Ensures the requesting user is allowed to view/modify a given attempt.
   * Staff (admins/teachers) can access any attempt. Students may only
   * access their own — verified against their linked StudentProfile, not
   * just their raw user id, since attempts are keyed by StudentProfile.id.
   */
  private async assertCanAccessAttempt(
    attempt: { studentId: string },
    requestingUser: RequestingUser,
  ): Promise<void> {
    if (STAFF_ROLES.includes(requestingUser.role)) {
      return;
    }

    const studentProfile = await this.studentRepository.findByUserId(
      requestingUser.id,
    );

    if (!studentProfile || studentProfile.id !== attempt.studentId) {
      throw new ForbiddenError(
        "You do not have permission to access this exam attempt.",
      );
    }
  }

  async startExam(userId: string, dto: StartExamDto): Promise<ExamAttempt> {
    const exam = await this.examRepository.findById(dto.examId);

    if (!exam) {
      throw new NotFoundError("Exam not found.");
    }

    if (!exam.isPublished) {
      throw new BadRequestError("Exam is not published.");
    }

    const studentProfile = await this.studentRepository.findByUserId(userId);

    if (!studentProfile) {
      throw new BadRequestError(
        "No student profile is linked to this account. Ask your institute admin to set one up before taking exams.",
      );
    }

    const previousAttempts =
      await this.examAttemptRepository.findByExamAndStudent(
        dto.examId,
        studentProfile.id,
      );

    const inProgress = previousAttempts.find(
      (attempt) => attempt.status === AttemptStatus.IN_PROGRESS,
    );

    if (inProgress) {
      // Always allow resuming a session already in progress — it's governed
      // by the exam's duration from when it started, not the exam's
      // scheduled window.
      return inProgress;
    }

    const now = new Date();
    const windowCloseWithBuffer = new Date(
      exam.endTime.getTime() + EXAM_WINDOW_BUFFER_MINUTES * 60 * 1000,
    );

    if (now < exam.startTime) {
      throw new BadRequestError(
        `This exam hasn't started yet. It opens at ${exam.startTime.toLocaleString()}.`,
      );
    }

    if (now > windowCloseWithBuffer) {
      throw new BadRequestError(
        `The time window for this exam has passed. It closed at ${exam.endTime.toLocaleString()}.`,
      );
    }

    const maxAttempts = exam.maxAttempts ?? 1;
    const usedAttempts = previousAttempts.filter(
      (attempt) => attempt.status !== AttemptStatus.IN_PROGRESS,
    ).length;

    if (usedAttempts >= maxAttempts) {
      throw new BadRequestError(
        maxAttempts === 1
          ? "You have already attempted this exam. Retakes are not allowed for this exam."
          : `You have used all ${maxAttempts} of your allowed attempts for this exam.`,
      );
    }

    return this.examAttemptRepository.createAttempt(
      dto.examId,
      studentProfile.id,
    );
  }

  async saveAnswer(
    attemptId: string,
    dto: SaveAnswerDto,
    requestingUser: RequestingUser,
  ): Promise<void> {
    const attempt = await this.examAttemptRepository.findById(attemptId);

    if (!attempt) {
      throw new NotFoundError("Exam attempt not found.");
    }

    await this.assertCanAccessAttempt(attempt, requestingUser);

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestError("Cannot save answers for a submitted exam.");
    }

    await this.examAttemptRepository.saveAnswer(
      attemptId,
      dto.questionId,
      dto.answer,
    );
  }

  async getAttempt(
    id: string,
    requestingUser: RequestingUser,
  ): Promise<ExamAttempt> {
    const attempt = await this.examAttemptRepository.findAttemptWithExam(id);

    if (!attempt) {
      throw new NotFoundError("Exam attempt not found.");
    }

    await this.assertCanAccessAttempt(attempt, requestingUser);

    return attempt;
  }

  async submitExam(id: string, requestingUser: RequestingUser): Promise<void> {
    const attempt = await this.examAttemptRepository.findById(id);

    if (!attempt) {
      throw new NotFoundError("Exam attempt not found.");
    }

    await this.assertCanAccessAttempt(attempt, requestingUser);

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestError("Exam has already been submitted.");
    }

    await this.examAttemptRepository.submitAttempt(id);

    // Auto-grade immediately so students (and teachers) see a result right
    // away instead of requiring a separate manual evaluation step. Only
    // objective question types (MCQ, TRUE_FALSE, NUMERICAL) can be scored
    // automatically; anything else is left for manual grading later and
    // won't block this from completing.
    try {
      await this.evaluationService.evaluateAttempt(id);
    } catch {
      // Evaluation failing shouldn't block the submission itself from
      // succeeding — the attempt is still recorded as submitted either way.
    }
  }

  async getResultsForExam(examId: string): Promise<ExamAttempt[]> {
    const exam = await this.examRepository.findById(examId);

    if (!exam) {
      throw new NotFoundError("Exam not found.");
    }

    return this.examAttemptRepository.findManyByExam(examId);
  }

  async getMyAttempts(userId: string): Promise<ExamAttempt[]> {
    const studentProfile = await this.studentRepository.findByUserId(userId);

    if (!studentProfile) {
      return [];
    }

    return this.examAttemptRepository.findManyByStudent(studentProfile.id);
  }
}