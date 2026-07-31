import type { Course, Prisma, PrismaClient } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type { CreateCourseDto, QueryCoursesDto, UpdateCourseDto } from "../dto";

import type { ICourseRepository } from "./course.repository.interface";

export class CourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateCourseDto): Promise<Course> {
    return this.prisma.course.create({
      data,
    });
  }

  async findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },

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
    });
  }

  async findByCode(code: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { code },
    });
  }

  async update(id: string, data: UpdateCourseDto): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QueryCoursesDto): Promise<Course[]> {
    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.CourseWhereInput = {
      instituteId: query.instituteId,
      subjectId: query.subjectId,
      teacherId: query.teacherId,
      batchId: query.batchId,
      semester: query.semester,
      academicYear: query.academicYear,
      isActive: query.isActive ?? true,

      ...(query.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.course.findMany({
      where,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

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
    });
  }

  async count(query: QueryCoursesDto): Promise<number> {
    const where: Prisma.CourseWhereInput = {
      instituteId: query.instituteId,
      subjectId: query.subjectId,
      teacherId: query.teacherId,
      batchId: query.batchId,
      semester: query.semester,
      academicYear: query.academicYear,
      isActive: query.isActive ?? true,

      ...(query.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    return this.prisma.course.count({
      where,
    });
  }

  async softDelete(id: string): Promise<Course> {
    return this.prisma.course.update({
      where: { id },

      data: {
        isActive: false,
      },
    });
  }
}
