import type { Subject } from "@prisma/client";

import type {
  CreateSubjectDto,
  QuerySubjectsDto,
  UpdateSubjectDto,
} from "../dto";

export interface ISubjectRepository {
  create(data: CreateSubjectDto): Promise<Subject>;

  findById(id: string): Promise<Subject | null>;

  findByCode(code: string): Promise<Subject | null>;

  update(id: string, data: UpdateSubjectDto): Promise<Subject>;

  findMany(query: QuerySubjectsDto): Promise<Subject[]>;

  count(query: QuerySubjectsDto): Promise<number>;

  softDelete(id: string): Promise<Subject>;
}
