


import { ForbiddenError, NotFoundError } from "../../../common/errors";

import { UserRole } from "@prisma/client";

import type { IDocumentRepository } from "../../documents/repositories";

import type { IOcrProvider } from "../providers";

import type { IOcrService, RequestingUser } from "./ocr.service.interface";

export class OcrService implements IOcrService {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly ocrProvider: IOcrProvider,
  ) {}

  async extractDocument(documentId: string, requestingUser?: RequestingUser) {
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new NotFoundError("Document not found.");
    }

    if (
      requestingUser?.role === UserRole.STUDENT &&
      document.uploadedById !== requestingUser.id
    ) {
      throw new ForbiddenError(
        "You do not have permission to access this document.",
      );
    }

    return this.ocrProvider.extractText(document.storagePath);
  }
}
