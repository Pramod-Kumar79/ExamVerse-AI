import type { Prisma, PrismaClient, TeacherProfile } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type {
  CreateTeacherDto,
  QueryTeachersDto,
  UpdateTeacherDto,
} from "../dto";

import type { ITeacherRepository } from "./teacher.repository.interface";

export class TeacherRepository implements ITeacherRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTeacherDto): Promise<TeacherProfile> {
    return this.prisma.teacherProfile.create({
      data,
    });
  }

  async findById(id: string): Promise<TeacherProfile | null> {
    return this.prisma.teacherProfile.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<TeacherProfile | null> {
    return this.prisma.teacherProfile.findUnique({
      where: { userId },
    });
  }

  async update(id: string, data: UpdateTeacherDto): Promise<TeacherProfile> {
    return this.prisma.teacherProfile.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QueryTeachersDto): Promise<TeacherProfile[]> {
    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.TeacherProfileWhereInput = {
      ...(query.search && {
        OR: [
          {
            designation: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            qualification: {
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

    return this.prisma.teacherProfile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });
  }

  async count(query: QueryTeachersDto): Promise<number> {
    const where: Prisma.TeacherProfileWhereInput = {
      ...(query.search && {
        OR: [
          {
            designation: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            qualification: {
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

    return this.prisma.teacherProfile.count({
      where,
    });
  }

  async delete(id: string): Promise<TeacherProfile> {
    return this.prisma.teacherProfile.delete({
      where: { id },
    });
  }
}
