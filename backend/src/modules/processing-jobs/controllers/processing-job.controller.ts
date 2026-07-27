import type { Request, Response } from "express";
import { BadRequestError } from "../../../common/errors";
import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IProcessingJobService } from "../services";

export class ProcessingJobController {
  constructor(private readonly processingJobService: IProcessingJobService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      // throw new Error("Invalid document id.");
      throw new BadRequestError("Invalid document id.");
    }

    const job = await this.processingJobService.create({
      documentId: id,
    });

    return ApiResponse.success(
      res,
      job,
      "Processing job created successfully.",
      201,
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.jobId;

    if (typeof id !== "string") {
      // throw new Error("Invalid job id.");
      throw new BadRequestError("Invalid job id.");
    }

    const job = await this.processingJobService.getById(id);

    return ApiResponse.success(
      res,
      job,
      "Processing job fetched successfully.",
    );
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.processingJobService.list({
      page: typeof req.query.page === "string" ? Number(req.query.page) : 1,

      limit: typeof req.query.limit === "string" ? Number(req.query.limit) : 10,

      status:
        typeof req.query.status === "string"
          ? (req.query.status as any)
          : undefined,

      documentId:
        typeof req.query.documentId === "string"
          ? req.query.documentId
          : undefined,
    });

    return ApiResponse.success(
      res,
      result,
      "Processing jobs fetched successfully.",
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.jobId;

    if (typeof id !== "string") {
      throw new Error("Invalid job id.");
    }

    const job = await this.processingJobService.update(id, req.body);

    return ApiResponse.success(
      res,
      job,
      "Processing job updated successfully.",
    );
  });
}
