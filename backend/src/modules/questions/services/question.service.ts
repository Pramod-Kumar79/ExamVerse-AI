// import { BadRequestError, NotFoundError } from "../../../common/errors";

// import { buildPagination } from "../../../common/utils";

// import { QuestionType } from "@prisma/client";

// import type {
//   CreateQuestionDto,
//   QueryQuestionsDto,
//   UpdateQuestionDto,
//   BulkDeleteQuestionsDto,
// } from "../dto";

// import type { IQuestionRepository } from "../repositories";

// import type {
//   IQuestionService,
//   PaginatedQuestions,
// } from "./question.service.interface";

// export class QuestionService implements IQuestionService {
//   constructor(private readonly questionRepository: IQuestionRepository) {}

//   async create(dto: CreateQuestionDto, createdBy: string) {
//     if (dto.type === QuestionType.MCQ && !dto.explanation) {
//       throw new BadRequestError("MCQ questions should include an explanation.");
//     }

//     return this.questionRepository.create({
//       ...dto,
//       createdBy: {
//         connect: {
//           id: createdBy,
//         },
//       },
//     });
//   }

//   async getById(id: string) {
//     const question = await this.questionRepository.findById(id);

//     if (!question) {
//       throw new NotFoundError("Question not found.");
//     }

//     return question;
//   }

//   async update(id: string, dto: UpdateQuestionDto) {
//     await this.getById(id);

//     return this.questionRepository.update(id, dto);
//   }

//   async list(query: QueryQuestionsDto): Promise<PaginatedQuestions> {
//     const questions = await this.questionRepository.findMany(query);

//     const total = await this.questionRepository.count(query);

//     return {
//       questions,
//       pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
//     };
//   }

//   async delete(id: string): Promise<void> {
//     await this.getById(id);

//     await this.questionRepository.softDelete(id);
//   }
//   async bulkDelete(dto: BulkDeleteQuestionsDto): Promise<number> {
//     if (dto.questionIds.length === 0) {
//       throw new BadRequestError("No questions selected.");
//     }

//     return this.questionRepository.softDeleteMany(dto.questionIds);
//   }
// }

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import { QuestionType, UserRole } from "@prisma/client";

import type {
  CreateQuestionDto,
  QueryQuestionsDto,
  UpdateQuestionDto,
  BulkDeleteQuestionsDto,
} from "../dto";

import type { IQuestionRepository } from "../repositories";

import type {
  IQuestionService,
  PaginatedQuestions,
  RequestingUser,
} from "./question.service.interface";

export class QuestionService implements IQuestionService {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async create(dto: CreateQuestionDto, createdBy: string) {
    if (dto.type === QuestionType.MCQ && !dto.explanation) {
      throw new BadRequestError("MCQ questions should include an explanation.");
    }

    return this.questionRepository.create({
      ...dto,
      createdBy: {
        connect: {
          id: createdBy,
        },
      },
    });
  }

  private assertOwnership(
    question: { createdById: string },
    requestingUser?: RequestingUser,
  ): void {
    if (!requestingUser) return;

    // Only students are restricted to their own questions — the shared
    // teacher/admin bank stays open to any staff member, matching how it
    // already worked before personal student banks existed.
    if (
      requestingUser.role === UserRole.STUDENT &&
      question.createdById !== requestingUser.id
    ) {
      throw new ForbiddenError(
        "You do not have permission to access this question.",
      );
    }
  }

  async getById(id: string, requestingUser?: RequestingUser) {
    const question = await this.questionRepository.findById(id);

    if (!question) {
      throw new NotFoundError("Question not found.");
    }

    this.assertOwnership(question, requestingUser);

    return question;
  }

  async update(
    id: string,
    dto: UpdateQuestionDto,
    requestingUser?: RequestingUser,
  ) {
    await this.getById(id, requestingUser);

    return this.questionRepository.update(id, dto);
  }

  async list(query: QueryQuestionsDto): Promise<PaginatedQuestions> {
    const questions = await this.questionRepository.findMany(query);

    const total = await this.questionRepository.count(query);

    return {
      questions,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string, requestingUser?: RequestingUser): Promise<void> {
    await this.getById(id, requestingUser);

    await this.questionRepository.softDelete(id);
  }

  async bulkDelete(dto: BulkDeleteQuestionsDto): Promise<number> {
    if (dto.questionIds.length === 0) {
      throw new BadRequestError("No questions selected.");
    }

    return this.questionRepository.softDeleteMany(dto.questionIds);
  }
}