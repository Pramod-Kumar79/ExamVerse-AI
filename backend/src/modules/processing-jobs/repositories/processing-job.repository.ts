import type { Prisma, PrismaClient, ProcessingJob } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type { QueryProcessingJobDto, UpdateProcessingJobDto } from "../dto";

import type { IProcessingJobRepository } from "./processing-job.repository.interface";

export class ProcessingJobRepository implements IProcessingJobRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.ProcessingJobCreateInput): Promise<ProcessingJob> {
    return this.prisma.processingJob.create({
      data,
    });
  }

  async findById(id: string): Promise<ProcessingJob | null> {
    return this.prisma.processingJob.findUnique({
      where: { id },

      include: {
        document: {
          select: {
            id: true,
            originalName: true,
            status: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: UpdateProcessingJobDto,
  ): Promise<ProcessingJob> {
    return this.prisma.processingJob.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QueryProcessingJobDto): Promise<ProcessingJob[]> {
    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.ProcessingJobWhereInput = {
      status: query.status,

      documentId: query.documentId,
    };

    return this.prisma.processingJob.findMany({
      where,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        document: {
          select: {
            id: true,
            originalName: true,
            status: true,
          },
        },
      },
    });
  }

  async count(query: QueryProcessingJobDto): Promise<number> {
    const where: Prisma.ProcessingJobWhereInput = {
      status: query.status,

      documentId: query.documentId,
    };

    return this.prisma.processingJob.count({
      where,
    });
  }
}
