import { ProcessingStatus } from "@prisma/client";

export interface QueryProcessingJobDto {
  page?: number;

  limit?: number;

  status?: ProcessingStatus;

  documentId?: string;
}
