import type { Prisma, ProcessingJob } from "@prisma/client";

import type { QueryProcessingJobDto, UpdateProcessingJobDto } from "../dto";

export interface IProcessingJobRepository {
  create(data: Prisma.ProcessingJobCreateInput): Promise<ProcessingJob>;

  findById(id: string): Promise<ProcessingJob | null>;

  update(id: string, data: UpdateProcessingJobDto): Promise<ProcessingJob>;

  findMany(query: QueryProcessingJobDto): Promise<ProcessingJob[]>;

  count(query: QueryProcessingJobDto): Promise<number>;
}
