// import type { Question } from "@prisma/client";

// import type { PaginationDto } from "../../../common/dto";

// import type {
//   CreateQuestionDto,
//   QueryQuestionsDto,
//   UpdateQuestionDto,
//   BulkDeleteQuestionsDto,
// } from "../dto";

// export interface PaginatedQuestions {
//   questions: Question[];
//   pagination: PaginationDto;
// }

// export interface IQuestionService {
//   create(dto: CreateQuestionDto, createdBy: string): Promise<Question>;

//   getById(id: string): Promise<Question>;

//   update(id: string, dto: UpdateQuestionDto): Promise<Question>;

//   list(query: QueryQuestionsDto): Promise<PaginatedQuestions>;

//   delete(id: string): Promise<void>;
//   bulkDelete(dto: BulkDeleteQuestionsDto): Promise<number>;
// }

import type { Question, UserRole } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type {
  CreateQuestionDto,
  QueryQuestionsDto,
  UpdateQuestionDto,
  BulkDeleteQuestionsDto,
} from "../dto";

export interface PaginatedQuestions {
  questions: Question[];
  pagination: PaginationDto;
}

export interface RequestingUser {
  id: string;
  role: UserRole;
}

export interface IQuestionService {
  create(dto: CreateQuestionDto, createdBy: string): Promise<Question>;

  getById(id: string, requestingUser?: RequestingUser): Promise<Question>;

  update(
    id: string,
    dto: UpdateQuestionDto,
    requestingUser?: RequestingUser,
  ): Promise<Question>;

  list(query: QueryQuestionsDto): Promise<PaginatedQuestions>;

  delete(id: string, requestingUser?: RequestingUser): Promise<void>;
  bulkDelete(dto: BulkDeleteQuestionsDto): Promise<number>;
}