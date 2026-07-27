// import type { Exam } from "@prisma/client";

// import type { PaginationDto } from "../../../common/dto";

// import type {
//   CreateExamDto,
//   QueryExamsDto,
//   UpdateExamDto,
//   ReorderExamQuestionsDto,
// } from "../dto";

// export interface PaginatedExams {
//   exams: Exam[];
//   pagination: PaginationDto;
// }

// export interface IExamService {
//   create(dto: CreateExamDto): Promise<Exam>;

//   getById(id: string): Promise<Exam>;

//   update(id: string, dto: UpdateExamDto): Promise<Exam>;

//   list(query: QueryExamsDto): Promise<PaginatedExams>;

//   delete(id: string): Promise<void>;

//   attachQuestions(examId: string, questionIds: string[]): Promise<void>;

//   removeQuestion(examId: string, questionId: string): Promise<void>;

//   reorderQuestions(examId: string, dto: ReorderExamQuestionsDto): Promise<void>;

//   getPreview(examId: string): Promise<Exam>;
// }

import type { Exam } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type {
  CreateExamDto,
  CreatePracticeExamDto,
  QueryExamsDto,
  UpdateExamDto,
  ReorderExamQuestionsDto,
} from "../dto";

export interface PaginatedExams {
  exams: Exam[];
  pagination: PaginationDto;
}

export interface IExamService {
  create(dto: CreateExamDto): Promise<Exam>;

  createPracticeExam(userId: string, dto: CreatePracticeExamDto): Promise<Exam>;

  listMyPracticeExams(userId: string): Promise<Exam[]>;

  getById(id: string): Promise<Exam>;

  update(id: string, dto: UpdateExamDto): Promise<Exam>;

  list(query: QueryExamsDto): Promise<PaginatedExams>;

  delete(id: string): Promise<void>;

  attachQuestions(examId: string, questionIds: string[]): Promise<void>;

  removeQuestion(examId: string, questionId: string): Promise<void>;

  reorderQuestions(examId: string, dto: ReorderExamQuestionsDto): Promise<void>;

  getPreview(examId: string): Promise<Exam>;
}