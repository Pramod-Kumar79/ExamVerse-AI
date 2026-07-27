import { z } from "zod";
import { DocumentStatus } from "@prisma/client";

export const updateDocumentSchema = z.object({
  pageCount: z.number().int().positive().optional(),

  checksum: z.string().optional(),

  status: z.nativeEnum(DocumentStatus).optional(),
});

export const queryDocumentSchema = z.object({
  page: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().optional(),

  search: z.string().optional(),

  status: z.nativeEnum(DocumentStatus).optional(),
});
