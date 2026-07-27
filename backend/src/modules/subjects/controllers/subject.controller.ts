import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { ISubjectService } from "../services";

export class SubjectController {
  constructor(private readonly subjectService: ISubjectService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const subject = await this.subjectService.create(req.body);

    return ApiResponse.success(
      res,
      subject,
      "Subject created successfully.",
      201,
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid subject id.");
    }

    const subject = await this.subjectService.getById(id);

    return ApiResponse.success(res, subject, "Subject fetched successfully.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid subject id.");
    }

    const subject = await this.subjectService.update(id, req.body);

    return ApiResponse.success(res, subject, "Subject updated successfully.");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.subjectService.list({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
      isActive:
        typeof req.query.isActive === "string"
          ? req.query.isActive === "true"
          : undefined,
    });

    return ApiResponse.success(res, result, "Subjects fetched successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid subject id.");
    }

    await this.subjectService.delete(id);

    return ApiResponse.success(res, null, "Subject deleted successfully.");
  });
}
