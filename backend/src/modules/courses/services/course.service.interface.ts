import type { Course } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type { CreateCourseDto, QueryCoursesDto, UpdateCourseDto } from "../dto";

export interface PaginatedCourses {
  courses: Course[];
  pagination: PaginationDto;
}

export interface ICourseService {
  create(dto: CreateCourseDto): Promise<Course>;

  getById(id: string): Promise<Course>;

  update(id: string, dto: UpdateCourseDto): Promise<Course>;

  list(query: QueryCoursesDto): Promise<PaginatedCourses>;

  delete(id: string): Promise<void>;
}
