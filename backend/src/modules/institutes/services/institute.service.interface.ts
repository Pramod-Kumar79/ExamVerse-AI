import type { ApiResponseDto, PaginationDto } from "../../../common/dto";

import type { Institute } from "@prisma/client";

import type {
  CreateInstituteDto,
  QueryInstitutesDto,
  UpdateInstituteDto,
} from "../dto";

export interface PaginatedInstitutes {
  institutes: Institute[];
  pagination: PaginationDto;
}

export interface IInstituteService {
  create(dto: CreateInstituteDto): Promise<Institute>;

  getById(id: string): Promise<Institute>;

  update(id: string, dto: UpdateInstituteDto): Promise<Institute>;

  list(query: QueryInstitutesDto): Promise<PaginatedInstitutes>;

  approve(id: string): Promise<Institute>;

  suspend(id: string): Promise<Institute>;

  reactivate(id: string): Promise<Institute>;

  delete(id: string): Promise<void>;
}
