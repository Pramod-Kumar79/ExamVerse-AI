import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";
import { BadRequestError } from "../../../common/errors";

import type { IOcrService } from "../services";

export class OcrController {
  constructor(private readonly ocrService: IOcrService) {}

  extract = asyncHandler(async (req: Request, res: Response) => {
    const documentId = req.params.documentId;

    if (typeof documentId !== "string") {
      throw new BadRequestError("Invalid document id.");
    }

    const result = await this.ocrService.extractDocument(documentId, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(
      res,
      result,
      "OCR extraction completed successfully.",
    );
  });
}