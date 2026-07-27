import { z } from "zod";
import { ProcessingStatus } from "@prisma/client";

export const createProcessingJobSchema = z.object({
  documentId: z.string().cuid(),
});

export const updateProcessingJobSchema = z.object({
  status: z.nativeEnum(ProcessingStatus).optional(),

  progress: z.number().min(0).max(100).optional(),

  currentStep: z.string().max(100).optional(),

  errorMessage: z.string().optional(),
});

export const queryProcessingJobSchema = z.object({
  page: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().optional(),

  status: z.nativeEnum(ProcessingStatus).optional(),
});
