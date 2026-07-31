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
    return this.prisma.$transaction(
      async (tx) => {
        // 1. Update user's role to TEACHER
        await tx.user.update({
          where: { id: data.userId },
          data: { role: "TEACHER" },
        });

        // 2. Remove any existing student profile for this user
        await tx.studentProfile.deleteMany({
          where: { userId: data.userId },
        });

        // 3. Create and return the teacher profile
        return tx.teacherProfile.create({
          data,
        });
      },
      { timeout: 20000 },
    );
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
    return this.prisma.$transaction(
      async (tx) => {
        const teacher = await tx.teacherProfile.findUnique({
          where: { id },
          select: { userId: true },
        });

        if (teacher?.userId) {
          await tx.user.update({
            where: { id: teacher.userId },
            data: { role: "STUDENT" },
          });
        }

        await tx.course.deleteMany({
          where: { teacherId: id },
        });

        return tx.teacherProfile.delete({
          where: { id },
        });
      },
      { timeout: 20000 },
    );
  }
}
