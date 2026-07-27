import type { Prisma, PrismaClient, StudentProfile } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type {
  CreateStudentDto,
  QueryStudentsDto,
  UpdateStudentDto,
} from "../dto";

import type { IStudentRepository } from "./student.repository.interface";

export class StudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateStudentDto): Promise<StudentProfile> {
    return this.prisma.studentProfile.create({
      data,
    });
  }

  async findById(id: string): Promise<StudentProfile | null> {
    return this.prisma.studentProfile.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<StudentProfile | null> {
    return this.prisma.studentProfile.findUnique({
      where: { userId },
    });
  }

  async findByRollNumber(rollNumber: string): Promise<StudentProfile | null> {
    return this.prisma.studentProfile.findFirst({
      where: { rollNumber },
    });
  }

  async update(id: string, data: UpdateStudentDto): Promise<StudentProfile> {
    return this.prisma.studentProfile.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QueryStudentsDto): Promise<StudentProfile[]> {
    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.StudentProfileWhereInput = {
      batchId: query.batchId,
      semester: query.semester,

      ...(query.search && {
        OR: [
          {
            rollNumber: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            user: {
              name: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              email: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
    };

    return this.prisma.studentProfile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        batch: true,
      },
    });
  }

  async count(query: QueryStudentsDto): Promise<number> {
    const where: Prisma.StudentProfileWhereInput = {
      batchId: query.batchId,
      semester: query.semester,

      ...(query.search && {
        OR: [
          {
            rollNumber: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            user: {
              name: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              email: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
    };

    return this.prisma.studentProfile.count({
      where,
    });
  }

  async delete(id: string): Promise<StudentProfile> {
    return this.prisma.studentProfile.delete({
      where: { id },
    });
  }
}
