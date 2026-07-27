import { ConflictError, NotFoundError } from "../../../common/errors";

import type {
  CreateInstituteDto,
  QueryInstitutesDto,
  UpdateInstituteDto,
} from "../dto";

import type { IInstituteRepository } from "../repositories";
import { buildPagination } from "../../../common/utils";

import type {
  IInstituteService,
  PaginatedInstitutes,
} from "./institute.service.interface";

export class InstituteService implements IInstituteService {
  constructor(private readonly instituteRepository: IInstituteRepository) {}

  async create(dto: CreateInstituteDto) {
    const existing = await this.instituteRepository.findByCode(dto.code);

    if (existing) {
      throw new ConflictError("Institute code already exists.");
    }

    return this.instituteRepository.create(dto);
  }

  async getById(id: string) {
    const institute = await this.instituteRepository.findById(id);

    if (!institute) {
      throw new NotFoundError("Institute not found.");
    }

    return institute;
  }

  async update(id: string, dto: UpdateInstituteDto) {
    await this.getById(id);

    return this.instituteRepository.update(id, dto);
  }

  async list(query: QueryInstitutesDto): Promise<PaginatedInstitutes> {
    const institutes = await this.instituteRepository.findMany(query);

    const total = await this.instituteRepository.count(query);

    return {
      institutes,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);

    await this.instituteRepository.delete(id);
  }
}
