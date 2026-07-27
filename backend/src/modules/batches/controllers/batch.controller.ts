import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IBatchService } from "../services";

export class BatchController {
  constructor(private readonly batchService: IBatchService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const batch = await this.batchService.create(req.body);

    return ApiResponse.success(res, batch, "Batch created successfully.", 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid batch id.");
    }

    const batch = await this.batchService.getById(id);

    return ApiResponse.success(res, batch, "Batch fetched successfully.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid batch id.");
    }

    const batch = await this.batchService.update(id, req.body);

    return ApiResponse.success(res, batch, "Batch updated successfully.");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.batchService.list({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
      instituteId:
        typeof req.query.instituteId === "string"
          ? req.query.instituteId
          : undefined,
      academicYear:
        typeof req.query.academicYear === "string"
          ? req.query.academicYear
          : undefined,
      semester:
        typeof req.query.semester === "string"
          ? Number(req.query.semester)
          : undefined,
      isActive:
        typeof req.query.isActive === "string"
          ? req.query.isActive === "true"
          : undefined,
    });

    return ApiResponse.success(res, result, "Batches fetched successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid batch id.");
    }

    await this.batchService.delete(id);

    return ApiResponse.success(res, null, "Batch deleted successfully.");
  });
}
