import type { Subject } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type {
  CreateSubjectDto,
  QuerySubjectsDto,
  UpdateSubjectDto,
} from "../dto";

export interface PaginatedSubjects {
  subjects: Subject[];
  pagination: PaginationDto;
}

export interface ISubjectService {
  create(dto: CreateSubjectDto): Promise<Subject>;

  getById(id: string): Promise<Subject>;

  update(id: string, dto: UpdateSubjectDto): Promise<Subject>;

  list(query: QuerySubjectsDto): Promise<PaginatedSubjects>;

  delete(id: string): Promise<void>;
}
