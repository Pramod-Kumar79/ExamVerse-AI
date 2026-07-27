import { DocumentStatus } from "@prisma/client";

export interface UpdateDocumentDto {
  pageCount?: number;

  checksum?: string;

  status?: DocumentStatus;
}
