import type { Prisma, UploadedDocument } from "@prisma/client";

import type { QueryDocumentsDto, UpdateDocumentDto } from "../dto";

export interface IDocumentRepository {
  create(data: Prisma.UploadedDocumentCreateInput): Promise<UploadedDocument>;

  findById(id: string): Promise<UploadedDocument | null>;

  update(id: string, data: UpdateDocumentDto): Promise<UploadedDocument>;

  findMany(query: QueryDocumentsDto): Promise<UploadedDocument[]>;

  count(query: QueryDocumentsDto): Promise<number>;

  delete(id: string): Promise<UploadedDocument>;
}
