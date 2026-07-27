import type { ProcessingJob } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type {
  CreateProcessingJobDto,
  QueryProcessingJobDto,
  UpdateProcessingJobDto,
} from "../dto";

export interface PaginatedProcessingJobs {
  jobs: ProcessingJob[];

  pagination: PaginationDto;
}

export interface IProcessingJobService {
  create(dto: CreateProcessingJobDto): Promise<ProcessingJob>;

  getById(id: string): Promise<ProcessingJob>;

  list(query: QueryProcessingJobDto): Promise<PaginatedProcessingJobs>;

  update(id: string, dto: UpdateProcessingJobDto): Promise<ProcessingJob>;
}
