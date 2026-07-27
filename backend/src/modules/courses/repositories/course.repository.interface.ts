import type { Course } from "@prisma/client";

import type { CreateCourseDto, QueryCoursesDto, UpdateCourseDto } from "../dto";

export interface ICourseRepository {
  create(data: CreateCourseDto): Promise<Course>;

  findById(id: string): Promise<Course | null>;

  findByCode(code: string): Promise<Course | null>;

  update(id: string, data: UpdateCourseDto): Promise<Course>;

  findMany(query: QueryCoursesDto): Promise<Course[]>;

  count(query: QueryCoursesDto): Promise<number>;

  softDelete(id: string): Promise<Course>;
}
