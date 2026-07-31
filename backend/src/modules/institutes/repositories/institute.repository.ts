import type { Institute, Prisma, PrismaClient } from "@prisma/client";

import type {
  CreateInstituteDto,
  QueryInstitutesDto,
  UpdateInstituteDto,
} from "../dto";

import type { IInstituteRepository } from "./institute.repository.interface";
import { resolvePagination } from "../../../common/utils";

export class InstituteRepository implements IInstituteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateInstituteDto): Promise<Institute> {
    return this.prisma.institute.create({
      data,
    });
  }

  async findById(id: string): Promise<Institute | null> {
    return this.prisma.institute.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Institute | null> {
    return this.prisma.institute.findUnique({
      where: { code },
    });
  }

  async update(id: string, data: UpdateInstituteDto): Promise<Institute> {
    return this.prisma.institute.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QueryInstitutesDto): Promise<Institute[]> {
    const { search } = query;

    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.InstituteWhereInput = {
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

    return this.prisma.institute.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(query: QueryInstitutesDto): Promise<number> {
    const { search } = query;

    const where: Prisma.InstituteWhereInput = {
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

    return this.prisma.institute.count({
      where,
    });
  }

  async delete(id: string): Promise<Institute> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Unlink users from this institute
      await tx.user.updateMany({
        where: { instituteId: id },
        data: { instituteId: null },
      });

      // 2. Delete courses associated with this institute
      await tx.course.deleteMany({
        where: { instituteId: id },
      });

      // 3. Delete batches associated with this institute
      await tx.batch.deleteMany({
        where: { instituteId: id },
      });

      // 4. Delete the institute itself
      return tx.institute.delete({
        where: { id },
      });
    });
  }
}
