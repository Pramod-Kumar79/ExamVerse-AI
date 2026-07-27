import type { StudentProfile } from "@prisma/client";

import type {
  CreateStudentDto,
  QueryStudentsDto,
  UpdateStudentDto,
} from "../dto";

export interface IStudentRepository {
  create(data: CreateStudentDto): Promise<StudentProfile>;

  findById(id: string): Promise<StudentProfile | null>;

  findByUserId(userId: string): Promise<StudentProfile | null>;

  findByRollNumber(rollNumber: string): Promise<StudentProfile | null>;

  update(id: string, data: UpdateStudentDto): Promise<StudentProfile>;

  findMany(query: QueryStudentsDto): Promise<StudentProfile[]>;

  count(query: QueryStudentsDto): Promise<number>;

  delete(id: string): Promise<StudentProfile>;
}
