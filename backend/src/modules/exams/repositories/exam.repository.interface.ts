import type { Exam } from "@prisma/client";

import type { CreateExamDto, QueryExamsDto, UpdateExamDto } from "../dto";

export interface IExamRepository {
  create(data: CreateExamDto): Promise<Exam>;

  findById(id: string): Promise<Exam | null>;

  update(id: string, data: UpdateExamDto): Promise<Exam>;

  findMany(query: QueryExamsDto): Promise<Exam[]>;

  findManyByCreator(userId: string): Promise<Exam[]>;

  count(query: QueryExamsDto): Promise<number>;
  attachQuestions(examId: string, questionIds: string[]): Promise<void>;

  removeQuestion(examId: string, questionId: string): Promise<void>;

  reorderQuestions(
    examId: string,
    questions: {
      questionId: string;
      displayOrder: number;
    }[],
  ): Promise<void>;

  findPreviewById(id: string): Promise<Exam | null>;
}