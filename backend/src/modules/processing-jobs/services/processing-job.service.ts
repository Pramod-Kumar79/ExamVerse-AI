import { DocumentStatus, ProcessingStatus } from "@prisma/client";

import { NotFoundError, BadRequestError } from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import type { IDocumentRepository } from "../../documents/repositories";

import type {
  CreateProcessingJobDto,
  QueryProcessingJobDto,
  UpdateProcessingJobDto,
} from "../dto";

import type { IProcessingJobRepository } from "../repositories";

import type {
  IProcessingJobService,
  PaginatedProcessingJobs,
} from "./processing-job.service.interface";
import type { IProcessingPipelineService } from "../pipeline";

export class ProcessingJobService implements IProcessingJobService {
  constructor(
    private readonly processingRepository: IProcessingJobRepository,
    private readonly documentRepository: IDocumentRepository,
    private readonly pipelineService: IProcessingPipelineService,
  ) {}

  async create(dto: CreateProcessingJobDto) {
    const document = await this.documentRepository.findById(dto.documentId);

    if (!document) {
      throw new NotFoundError("Document not found.");
    }

    if (
      document.status !== DocumentStatus.UPLOADED &&
      document.status !== DocumentStatus.READY_FOR_PROCESSING
    ) {
      throw new BadRequestError(
        "Document has already been processed or is currently in progress.",
      );
    }

    const job = await this.processingRepository.create({
      status: ProcessingStatus.QUEUED,

      document: {
        connect: {
          id: dto.documentId,
        },
      },
    });

    // await this.documentRepository.update(dto.documentId, {
    //   status: DocumentStatus.QUEUED,
    // });

    // return job;
    await this.documentRepository.update(dto.documentId, {
      status: DocumentStatus.QUEUED,
    });

    // Start the processing pipeline
    await this.pipelineService.process(job.id);

    return job;
  }

  async getById(id: string) {
    const job = await this.processingRepository.findById(id);

    if (!job) {
      throw new NotFoundError("Processing job not found.");
    }

    return job;
  }

  async list(query: QueryProcessingJobDto): Promise<PaginatedProcessingJobs> {
    const jobs = await this.processingRepository.findMany(query);

    const total = await this.processingRepository.count(query);

    return {
      jobs,

      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async update(id: string, dto: UpdateProcessingJobDto) {
    await this.getById(id);

    return this.processingRepository.update(id, dto);
  }
}
