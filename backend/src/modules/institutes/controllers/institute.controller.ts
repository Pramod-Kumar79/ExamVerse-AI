import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IInstituteService } from "../services";

export class InstituteController {
  constructor(private readonly instituteService: IInstituteService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const institute = await this.instituteService.create(req.body);

    return ApiResponse.success(
      res,
      institute,
      "Institute created successfully.",
      201,
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid institute id.");
    }

    const institute = await this.instituteService.getById(id);

    return ApiResponse.success(
      res,
      institute,
      "Institute fetched successfully.",
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid institute id.");
    }

    const institute = await this.instituteService.update(id, req.body);

    return ApiResponse.success(
      res,
      institute,
      "Institute updated successfully.",
    );
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.instituteService.list({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
    });

    return ApiResponse.success(res, result, "Institutes fetched successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid institute id.");
    }

    await this.instituteService.delete(id);

    return ApiResponse.success(res, null, "Institute deleted successfully.");
  });
}
