// import type { ExamAttempt, Prisma } from "@prisma/client";

// export interface IExamAttemptRepository {
//   createAttempt(examId: string, studentId: string): Promise<ExamAttempt>;

//   findById(id: string): Promise<ExamAttempt | null>;

//   saveAnswer(
//     attemptId: string,
//     questionId: string,
//     answer: Prisma.InputJsonValue,
//   ): Promise<void>;

//   findAttemptWithExam(id: string): Promise<ExamAttempt | null>;

//   submitAttempt(id: string): Promise<void>;
// }

// import type { ExamAttempt, Prisma } from "@prisma/client";

// export interface IExamAttemptRepository {
//   createAttempt(examId: string, studentId: string): Promise<ExamAttempt>;

//   findById(id: string): Promise<ExamAttempt | null>;

//   findByExamAndStudent(
//     examId: string,
//     studentId: string,
//   ): Promise<ExamAttempt[]>;

//   findManyByExam(examId: string): Promise<ExamAttempt[]>;

//   saveAnswer(
//     attemptId: string,
//     questionId: string,
//     answer: Prisma.InputJsonValue,
//   ): Promise<void>;

//   findAttemptWithExam(id: string): Promise<ExamAttempt | null>;

//   submitAttempt(id: string): Promise<void>;
// }

import type { ExamAttempt, Prisma } from "@prisma/client";

export interface IExamAttemptRepository {
  createAttempt(examId: string, studentId: string): Promise<ExamAttempt>;

  findById(id: string): Promise<ExamAttempt | null>;

  findByExamAndStudent(
    examId: string,
    studentId: string,
  ): Promise<ExamAttempt[]>;

  findManyByStudent(studentId: string): Promise<ExamAttempt[]>;

  findManyByExam(examId: string): Promise<ExamAttempt[]>;

  saveAnswer(
    attemptId: string,
    questionId: string,
    answer: Prisma.InputJsonValue,
  ): Promise<void>;

  findAttemptWithExam(id: string): Promise<ExamAttempt | null>;

  submitAttempt(id: string): Promise<void>;
}