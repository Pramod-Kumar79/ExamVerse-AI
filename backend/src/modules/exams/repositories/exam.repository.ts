import type { Exam, Prisma, PrismaClient } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type { CreateExamDto, QueryExamsDto, UpdateExamDto } from "../dto";

import type { IExamRepository } from "./exam.repository.interface";

export class ExamRepository implements IExamRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateExamDto): Promise<Exam> {
    return this.prisma.exam.create({
      data,
    });
  }

  async findById(id: string): Promise<Exam | null> {
    return this.prisma.exam.findUnique({
      where: { id },

      include: {
        course: {
          include: {
            institute: true,
            subject: true,
            teacher: {
              include: {
                user: true,
              },
            },
            batch: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateExamDto): Promise<Exam> {
    return this.prisma.exam.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QueryExamsDto): Promise<Exam[]> {
    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.ExamWhereInput = {
      courseId: query.courseId,

      status: query.status,

      isPublished: query.isPublished,

      ...(query.search && {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      }),
    };

    return this.prisma.exam.findMany({
      where,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        startTime: "asc",
      },

      include: {
        course: {
          include: {
            institute: true,
            subject: true,
            teacher: {
              include: {
                user: true,
              },
            },
            batch: true,
          },
        },
      },
    });
  }

  async findManyByCreator(userId: string): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      where: {
        createdByUserId: userId,
        isPractice: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(query: QueryExamsDto): Promise<number> {
    const where: Prisma.ExamWhereInput = {
      courseId: query.courseId,

      status: query.status,

      isPublished: query.isPublished,

      ...(query.search && {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      }),
    };

    return this.prisma.exam.count({
      where,
    });
  }

  async attachQuestions(examId: string, questionIds: string[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existingQuestions = await tx.examQuestion.findMany({
        where: {
          examId,
        },

        select: {
          questionId: true,
          displayOrder: true,
        },
      });

      const existingIds = new Set(existingQuestions.map((q) => q.questionId));

      let displayOrder =
        existingQuestions.length === 0
          ? 1
          : Math.max(...existingQuestions.map((q) => q.displayOrder)) + 1;

      for (const questionId of questionIds) {
        if (existingIds.has(questionId)) {
          continue;
        }

        const question = await tx.question.findUnique({
          where: {
            id: questionId,
          },

          select: {
            marks: true,
            negativeMarks: true,
          },
        });

        if (!question) {
          continue;
        }

        await tx.examQuestion.create({
          data: {
            examId,

            questionId,

            marks: question.marks ?? 1,

            negativeMarks: question.negativeMarks ?? 0,

            displayOrder,
          },
        });

        displayOrder++;
      }
    });
  }

  async removeQuestion(examId: string, questionId: string): Promise<void> {
    await this.prisma.examQuestion.deleteMany({
      where: {
        examId,
        questionId,
      },
    });
  }

  async reorderQuestions(
    examId: string,
    questions: {
      questionId: string;
      displayOrder: number;
    }[],
  ): Promise<void> {
    await this.prisma.$transaction(
      questions.map((question) =>
        this.prisma.examQuestion.updateMany({
          where: {
            examId,
            questionId: question.questionId,
          },

          data: {
            displayOrder: question.displayOrder,
          },
        }),
      ),
    );
  }

  async findPreviewById(id: string): Promise<Exam | null> {
    return this.prisma.exam.findUnique({
      where: {
        id,
      },

      include: {
        examQuestions: {
          orderBy: {
            displayOrder: "asc",
          },

          include: {
            question: {
              include: {
                options: {
                  orderBy: {
                    displayOrder: "asc",
                  },
                },
              },
            },
          },
        },

        course: true,
      },
    });
  }
}