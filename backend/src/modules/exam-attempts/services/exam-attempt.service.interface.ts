// import type { ExamAttempt } from "@prisma/client";
// import type { SaveAnswerDto } from "../dto";
// import type { StartExamDto } from "../dto";

// export interface IExamAttemptService {
//   startExam(userId: string, dto: StartExamDto): Promise<ExamAttempt>;

//   saveAnswer(attemptId: string, dto: SaveAnswerDto): Promise<void>;

//   getAttempt(id: string): Promise<ExamAttempt>;

//   submitExam(id: string): Promise<void>;

//   getResultsForExam(examId: string): Promise<ExamAttempt[]>;

//   getMyAttempts(userId: string): Promise<ExamAttempt[]>;
// }

import type { ExamAttempt, UserRole } from "@prisma/client";
import type { SaveAnswerDto } from "../dto";
import type { StartExamDto } from "../dto";

export interface RequestingUser {
  id: string;
  role: UserRole;
}

export interface IExamAttemptService {
  startExam(userId: string, dto: StartExamDto): Promise<ExamAttempt>;

  saveAnswer(
    attemptId: string,
    dto: SaveAnswerDto,
    requestingUser: RequestingUser,
  ): Promise<void>;

  getAttempt(id: string, requestingUser: RequestingUser): Promise<ExamAttempt>;

  submitExam(id: string, requestingUser: RequestingUser): Promise<void>;

  getResultsForExam(examId: string): Promise<ExamAttempt[]>;

  getMyAttempts(userId: string): Promise<ExamAttempt[]>;
}