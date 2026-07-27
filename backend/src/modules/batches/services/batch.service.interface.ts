import type { Batch } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type { CreateBatchDto, QueryBatchesDto, UpdateBatchDto } from "../dto";

export interface PaginatedBatches {
  batches: Batch[];
  pagination: PaginationDto;
}

export interface IBatchService {
  create(dto: CreateBatchDto): Promise<Batch>;

  getById(id: string): Promise<Batch>;

  update(id: string, dto: UpdateBatchDto): Promise<Batch>;

  list(query: QueryBatchesDto): Promise<PaginatedBatches>;

  delete(id: string): Promise<void>;
}
