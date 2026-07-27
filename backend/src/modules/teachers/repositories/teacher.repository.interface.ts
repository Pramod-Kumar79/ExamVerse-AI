import type { TeacherProfile } from "@prisma/client";

import type {
  CreateTeacherDto,
  QueryTeachersDto,
  UpdateTeacherDto,
} from "../dto";

export interface ITeacherRepository {
  create(data: CreateTeacherDto): Promise<TeacherProfile>;

  findById(id: string): Promise<TeacherProfile | null>;

  findByUserId(userId: string): Promise<TeacherProfile | null>;

  update(id: string, data: UpdateTeacherDto): Promise<TeacherProfile>;

  findMany(query: QueryTeachersDto): Promise<TeacherProfile[]>;

  count(query: QueryTeachersDto): Promise<number>;

  delete(id: string): Promise<TeacherProfile>;
}
