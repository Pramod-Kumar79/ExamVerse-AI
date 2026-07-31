import type { Prisma, PrismaClient, Question } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type {
  CreateQuestionDto,
  QueryQuestionsDto,
  UpdateQuestionDto,
} from "../dto";

import type { IQuestionRepository } from "./question.repository.interface";

export class QuestionRepository implements IQuestionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private buildScopeFilter(
    query: QueryQuestionsDto,
  ): Prisma.QuestionWhereInput | null {
    if (query.scope === "own" && query.ownerId) {
      return { createdById: query.ownerId };
    }

    if (query.scope === "own_and_shared" && query.ownerId) {
      return {
        OR: [
          { createdById: query.ownerId },
          { createdBy: { role: { not: "STUDENT" } } },
        ],
      };
    }

    if (query.scope === "shared") {
      return { createdBy: { role: { not: "STUDENT" } } };
    }

    return null;
  }

  async create(data: Prisma.QuestionCreateInput): Promise<Question> {
    return this.prisma.question.create({
      data,
    });
  }

  async findById(id: string): Promise<Question | null> {
    return this.prisma.question.findUnique({
      where: { id },

      include: {
        options: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        createdBy: {
          select: {
            role: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateQuestionDto): Promise<Question> {
    return this.prisma.$transaction(async (tx) => {
      const { options, ...questionData } = data;

      await tx.question.update({
        where: {
          id,
        },
        data: questionData,
      });

      if (options) {
        await tx.questionOption.deleteMany({
          where: {
            questionId: id,
          },
        });

        if (options.length > 0) {
          await tx.questionOption.createMany({
            data: options.map((option) => ({
              questionId: id,
              optionText: option.optionText,
              imageUrl: option.imageUrl ?? null,
              isCorrect: option.isCorrect,
              displayOrder: option.displayOrder,
            })),
          });
        }
      }

      return tx.question.findUniqueOrThrow({
        where: {
          id,
        },

        include: {
          options: {
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      });
    });
  }

  async findMany(query: QueryQuestionsDto): Promise<Question[]> {
    const { page, limit } = resolvePagination(query.page, query.limit);

    const baseWhere: Prisma.QuestionWhereInput = {
      type: query.type,

      difficulty: query.difficulty,

      chapter: query.chapter,

      topic: query.topic,

      isActive: query.isActive ?? true,

      aiGenerated: query.aiGenerated,

      year: query.year,

      source: query.source,

      ...(query.search && {
        OR: [
          {
            title: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            chapter: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            topic: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            tags: {
              has: query.search,
            },
          },
        ],
      }),
    };

    const scopeFilter = this.buildScopeFilter(query);
    const where: Prisma.QuestionWhereInput = scopeFilter
      ? { AND: [baseWhere, scopeFilter] }
      : baseWhere;

    return this.prisma.question.findMany({
      where,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc",
      },

      include: {
        options: {
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    });
  }

  async count(query: QueryQuestionsDto): Promise<number> {
    const baseWhere: Prisma.QuestionWhereInput = {
      type: query.type,
      difficulty: query.difficulty,
      chapter: query.chapter,
      topic: query.topic,
      isActive: query.isActive ?? true,

      ...(query.search && {
        OR: [
          {
            title: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const scopeFilter = this.buildScopeFilter(query);
    const where: Prisma.QuestionWhereInput = scopeFilter
      ? { AND: [baseWhere, scopeFilter] }
      : baseWhere;

    return this.prisma.question.count({
      where,
    });
  }

  async softDelete(id: string): Promise<Question> {
    return this.prisma.question.update({
      where: { id },

      data: {
        isActive: false,
      },
    });
  }

  async softDeleteMany(ids: string[]): Promise<number> {
    const result = await this.prisma.question.updateMany({
      where: {
        id: {
          in: ids,
        },
      },

      data: {
        isActive: false,
      },
    });

    return result.count;
  }
}