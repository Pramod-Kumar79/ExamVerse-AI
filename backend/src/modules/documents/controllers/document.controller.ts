import type { Request, Response } from "express";
import { BadRequestError } from "../../../common/errors";
import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";
import { UserRole } from "@prisma/client";

import type { IDocumentService } from "../services";
import type { StorageProvider } from "../storage";

export class DocumentController {
  constructor(
    private readonly documentService: IDocumentService,
    private readonly storageProvider: StorageProvider,
  ) {}

  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("No file uploaded.");
    }

    const storedFile = await this.storageProvider.save(req.file);

    const document = await this.documentService.upload(storedFile, req.user.id);

    return ApiResponse.success(
      res,
      document,
      "Document uploaded successfully.",
      201,
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid document id.");
    }

    const document = await this.documentService.getById(id, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(res, document, "Document fetched successfully.");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const isStudent = req.user.role === "STUDENT";
    const isTeacher = req.user.role === "TEACHER";

    const result = await this.documentService.list({
      page: req.query.page ? Number(req.query.page) : 1,

      limit: req.query.limit ? Number(req.query.limit) : 10,

      search:
        typeof req.query.search === "string" ? req.query.search : undefined,

      status:
        typeof req.query.status === "string"
          ? (req.query.status as any)
          : undefined,

      // Students and Teachers only see their own uploads;
      // Admins/Institutes see the shared pool.
      uploadedById: isStudent || isTeacher ? req.user.id : undefined,
      excludeUploaderRole: isStudent || isTeacher ? undefined : UserRole.STUDENT,
    });

    return ApiResponse.success(res, result, "Documents fetched successfully.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid document id.");
    }

    const document = await this.documentService.update(id, req.body, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(res, document, "Document updated successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid document id.");
    }

    await this.documentService.delete(id, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(res, null, "Document deleted successfully.");
  });
}