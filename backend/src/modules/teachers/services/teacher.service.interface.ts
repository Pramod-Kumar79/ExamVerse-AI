import type { TeacherProfile } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type {
  CreateTeacherDto,
  QueryTeachersDto,
  UpdateTeacherDto,
} from "../dto";

export interface PaginatedTeachers {
  teachers: TeacherProfile[];
  pagination: PaginationDto;
}

export interface ITeacherService {
  create(dto: CreateTeacherDto): Promise<TeacherProfile>;

  getById(id: string): Promise<TeacherProfile>;

  update(id: string, dto: UpdateTeacherDto): Promise<TeacherProfile>;

  list(query: QueryTeachersDto): Promise<PaginatedTeachers>;

  delete(id: string): Promise<void>;
}
