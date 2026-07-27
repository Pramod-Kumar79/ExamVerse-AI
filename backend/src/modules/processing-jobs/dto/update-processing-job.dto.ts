import { ProcessingStatus } from "@prisma/client";

export interface UpdateProcessingJobDto {
  status?: ProcessingStatus;

  progress?: number;

  currentStep?: string;

  errorMessage?: string;

  completedAt?: Date;
}
