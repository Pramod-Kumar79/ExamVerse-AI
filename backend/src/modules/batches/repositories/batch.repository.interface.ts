import type { Batch } from "@prisma/client";

import type { CreateBatchDto, QueryBatchesDto, UpdateBatchDto } from "../dto";

export interface IBatchRepository {
  create(data: CreateBatchDto): Promise<Batch>;

  findById(id: string): Promise<Batch | null>;

  findByCode(code: string): Promise<Batch | null>;

  update(id: string, data: UpdateBatchDto): Promise<Batch>;

  findMany(query: QueryBatchesDto): Promise<Batch[]>;

  count(query: QueryBatchesDto): Promise<number>;

  softDelete(id: string): Promise<Batch>;
}
