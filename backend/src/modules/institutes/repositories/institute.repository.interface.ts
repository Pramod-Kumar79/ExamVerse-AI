import type { Institute } from "@prisma/client";

import type {
  CreateInstituteDto,
  QueryInstitutesDto,
  UpdateInstituteDto,
} from "../dto";

export interface IInstituteRepository {
  create(data: CreateInstituteDto): Promise<Institute>;

  findById(id: string): Promise<Institute | null>;

  findByCode(code: string): Promise<Institute | null>;

  update(id: string, data: UpdateInstituteDto): Promise<Institute>;

  findMany(query: QueryInstitutesDto): Promise<Institute[]>;

  count(query: QueryInstitutesDto): Promise<number>;

  delete(id: string): Promise<Institute>;
}
