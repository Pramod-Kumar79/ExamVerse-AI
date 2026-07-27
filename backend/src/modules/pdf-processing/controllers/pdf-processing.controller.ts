// import type { Request, Response } from "express";
// import { BadRequestError, NotFoundError } from "../../../common/errors";
// import { asyncHandler } from "../../../common/middleware";
// import { ApiResponse } from "../../../common/response";

// import type { IPdfProcessingService } from "../services";
// import type { IDocumentRepository } from "../../documents/repositories";

// export class PdfProcessingController {
//   constructor(
//     private readonly pdfProcessingService: IPdfProcessingService,
//     private readonly documentRepository: IDocumentRepository,
//   ) {}

//   analyze = asyncHandler(async (req: Request, res: Response) => {
//     const id = req.params.documentId;

//     if (typeof id !== "string") {
//       throw new BadRequestError("Invalid document id.");
//     }

//     const document = await this.documentRepository.findById(id);

//     if (!document) {
//       throw new NotFoundError("Document not found.");
//     }

//     const result = await this.pdfProcessingService.analyzeDocument(
//       document.storagePath,
//     );

//     return ApiResponse.success(res, result, "PDF analyzed successfully.");
//   });
// }

import type { Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../common/errors";
import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IPdfProcessingService } from "../services";
import type { IDocumentRepository } from "../../documents/repositories";

export class PdfProcessingController {
  constructor(
    private readonly pdfProcessingService: IPdfProcessingService,
    private readonly documentRepository: IDocumentRepository,
  ) {}

  analyze = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.documentId;

    if (typeof id !== "string") {
      throw new BadRequestError("Invalid document id.");
    }

    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundError("Document not found.");
    }

    if (req.user.role === "STUDENT" && document.uploadedById !== req.user.id) {
      throw new ForbiddenError(
        "You do not have permission to access this document.",
      );
    }

    const result = await this.pdfProcessingService.analyzeDocument(
      document.storagePath,
    );

    return ApiResponse.success(res, result, "PDF analyzed successfully.");
  });
}