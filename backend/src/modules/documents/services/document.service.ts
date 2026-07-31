import { ForbiddenError, NotFoundError } from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import { UserRole } from "@prisma/client";

import type { QueryDocumentsDto, UpdateDocumentDto } from "../dto";

import type { IDocumentRepository } from "../repositories";

import type {
  IDocumentService,
  PaginatedDocuments,
  RequestingUser,
} from "./document.service.interface";

import type { StorageProvider, StoredFile } from "../storage";

export class DocumentService implements IDocumentService {
  constructor(
    private readonly repository: IDocumentRepository,

    private readonly storage: StorageProvider,
  ) {}

  async upload(
    file: StoredFile,

    uploadedById: string,
  ) {
    return this.repository.create({
      originalName: file.originalName,

      storedName: file.storedName,

      mimeType: file.mimeType,

      extension: file.extension,

      fileSize: file.fileSize,

      storagePath: file.storagePath,

      uploadedBy: {
        connect: {
          id: uploadedById,
        },
      },
    });
  }

  private assertOwnership(
    document: { uploadedById: string },
    requestingUser?: RequestingUser,
  ): void {
    if (!requestingUser) return;

    // Both Students and Teachers are restricted to their own uploaded documents.
    // Admins and Institutes retain full administrative access.
    if (
      (requestingUser.role === UserRole.STUDENT ||
        requestingUser.role === UserRole.TEACHER) &&
      document.uploadedById !== requestingUser.id
    ) {
      throw new ForbiddenError(
        "You do not have permission to access this document.",
      );
    }
  }

  async getById(id: string, requestingUser?: RequestingUser) {
    const document = await this.repository.findById(id);

    if (!document) {
      throw new NotFoundError("Document not found.");
    }

    this.assertOwnership(document, requestingUser);

    return {
      ...document,

      downloadUrl: this.storage.getDownloadUrl(document.storagePath),
    };
  }

  async list(query: QueryDocumentsDto): Promise<PaginatedDocuments> {
    const documents = await this.repository.findMany(query);

    const total = await this.repository.count(query);

    return {
      documents: documents.map((document) => ({
        ...document,

        downloadUrl: this.storage.getDownloadUrl(document.storagePath),
      })),

      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async update(
    id: string,

    dto: UpdateDocumentDto,

    requestingUser?: RequestingUser,
  ) {
    await this.getById(id, requestingUser);

    return this.repository.update(id, dto);
  }

  async delete(id: string, requestingUser?: RequestingUser) {
    const document = await this.getById(id, requestingUser);

    await this.storage.delete(document.storagePath);

    await this.repository.delete(id);
  }
}