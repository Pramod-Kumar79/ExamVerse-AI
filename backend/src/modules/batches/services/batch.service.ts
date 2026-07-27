import { ConflictError, NotFoundError } from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import type { CreateBatchDto, QueryBatchesDto, UpdateBatchDto } from "../dto";
import type { IInstituteRepository } from "../../institutes/repositories";

import type { IBatchRepository } from "../repositories";

import type {
  IBatchService,
  PaginatedBatches,
} from "./batch.service.interface";

export class BatchService implements IBatchService {
  constructor(
    private readonly batchRepository: IBatchRepository,
    private readonly instituteRepository: IInstituteRepository,
  ) {}

  async create(dto: CreateBatchDto) {

    const institute = await this.instituteRepository.findById(dto.instituteId);

    if (!institute) {
      throw new NotFoundError("Institute not found.");
    }

    if (dto.startDate && dto.endDate && dto.endDate < dto.startDate) {
      throw new ConflictError("End date cannot be before start date.");
    }

    if (dto.code) {
      const existing = await this.batchRepository.findByCode(dto.code);

      if (existing) {
        throw new ConflictError("Batch code already exists.");
      }
    }

    return this.batchRepository.create(dto);
  }

  async getById(id: string) {
    const batch = await this.batchRepository.findById(id);

    if (!batch) {
      throw new NotFoundError("Batch not found.");
    }

    return batch;
  }

  async update(id: string, dto: UpdateBatchDto) {
    await this.getById(id);

    if (dto.code) {
      const existing = await this.batchRepository.findByCode(dto.code);

      if (existing && existing.id !== id) {
        throw new ConflictError("Batch code already exists.");
      }
    }

    return this.batchRepository.update(id, dto);
  }

  async list(query: QueryBatchesDto): Promise<PaginatedBatches> {
    const batches = await this.batchRepository.findMany(query);

    const total = await this.batchRepository.count(query);

    return {
      batches,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);

    await this.batchRepository.softDelete(id);
  }
}
