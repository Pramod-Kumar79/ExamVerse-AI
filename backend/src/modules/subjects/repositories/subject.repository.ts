import type { Prisma, PrismaClient, Subject } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type {
  CreateSubjectDto,
  QuerySubjectsDto,
  UpdateSubjectDto,
} from "../dto";

import type { ISubjectRepository } from "./subject.repository.interface";

export class SubjectRepository implements ISubjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateSubjectDto): Promise<Subject> {
    return this.prisma.subject.create({
      data,
    });
  }

  async findById(id: string): Promise<Subject | null> {
    return this.prisma.subject.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Subject | null> {
    return this.prisma.subject.findUnique({
      where: { code },
    });
  }

  async update(id: string, data: UpdateSubjectDto): Promise<Subject> {
    return this.prisma.subject.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QuerySubjectsDto): Promise<Subject[]> {
    const { search, isActive } = query;

    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.SubjectWhereInput = {
      isActive: isActive ?? true,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.subject.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(query: QuerySubjectsDto): Promise<number> {
    const { search, isActive } = query;

    const where: Prisma.SubjectWhereInput = {
      isActive: isActive ?? true,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.subject.count({
      where,
    });
  }

  async softDelete(id: string): Promise<Subject> {
    return this.prisma.subject.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
