import type { Batch, Prisma, PrismaClient } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type { CreateBatchDto, QueryBatchesDto, UpdateBatchDto } from "../dto";

import type { IBatchRepository } from "./batch.repository.interface";

export class BatchRepository implements IBatchRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateBatchDto): Promise<Batch> {
    return this.prisma.batch.create({
      data,
    });
  }

  async findById(id: string): Promise<Batch | null> {
    return this.prisma.batch.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Batch | null> {
    return this.prisma.batch.findUnique({
      where: { code },
    });
  }

  async update(id: string, data: UpdateBatchDto): Promise<Batch> {
    return this.prisma.batch.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QueryBatchesDto): Promise<Batch[]> {
    const { search, instituteId, academicYear, semester, isActive } = query;

    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.BatchWhereInput = {
      instituteId,
      academicYear,
      semester,
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

    return this.prisma.batch.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        institute: true,
      },
    });
  }

  async count(query: QueryBatchesDto): Promise<number> {
    const { search, instituteId, academicYear, semester, isActive } = query;

    const where: Prisma.BatchWhereInput = {
      instituteId,
      academicYear,
      semester,
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

    return this.prisma.batch.count({
      where,
    });
  }

  async softDelete(id: string): Promise<Batch> {
    return this.prisma.batch.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
