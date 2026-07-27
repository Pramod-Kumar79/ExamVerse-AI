import type { StudentProfile } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type {
  CreateStudentDto,
  QueryStudentsDto,
  UpdateStudentDto,
} from "../dto";

export interface PaginatedStudents {
  students: StudentProfile[];
  pagination: PaginationDto;
}

export interface IStudentService {
  create(dto: CreateStudentDto): Promise<StudentProfile>;

  getById(id: string): Promise<StudentProfile>;

  update(id: string, dto: UpdateStudentDto): Promise<StudentProfile>;

  list(query: QueryStudentsDto): Promise<PaginatedStudents>;

  delete(id: string): Promise<void>;
}
