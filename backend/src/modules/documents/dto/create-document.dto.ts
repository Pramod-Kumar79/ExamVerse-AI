import { DocumentStatus } from "@prisma/client";

export interface CreateDocumentDto {
  originalName: string;

  storedName: string;

  mimeType: string;

  extension: string;

  fileSize: number;

  storagePath: string;

  checksum?: string;

  pageCount?: number;

  status?: DocumentStatus;
}
