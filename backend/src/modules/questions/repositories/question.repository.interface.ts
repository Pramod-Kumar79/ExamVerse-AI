import type { Prisma, Question } from "@prisma/client";

import type {
  CreateQuestionDto,
  QueryQuestionsDto,
  UpdateQuestionDto,
} from "../dto";

export interface IQuestionRepository {
  create(data: Prisma.QuestionCreateInput): Promise<Question>;

  findById(id: string): Promise<Question | null>;

  update(id: string, data: UpdateQuestionDto): Promise<Question>;

  findMany(query: QueryQuestionsDto): Promise<Question[]>;

  count(query: QueryQuestionsDto): Promise<number>;

  softDelete(id: string): Promise<Question>;
  softDeleteMany(ids: string[]): Promise<number>;
}
