import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IInstituteService } from "../services";

import { UserRole } from "@prisma/client";
import { ForbiddenError } from "../../../common/errors";

export class InstituteController {
  constructor(private readonly instituteService: IInstituteService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    if (req.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Only platform administrators can add new institutes directly.");
    }

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

    if (req.user?.role === UserRole.INSTITUTE && id !== req.user.instituteId) {
      throw new ForbiddenError("You are not authorized to view other institutes.");
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

    if (req.user?.role === UserRole.INSTITUTE && id !== req.user.instituteId) {
      throw new ForbiddenError("You are not authorized to modify other institutes.");
    }

    const institute = await this.instituteService.update(id, req.body);

    return ApiResponse.success(
      res,
      institute,
      "Institute updated successfully.",
    );
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const scopedId =
      req.user?.role === UserRole.INSTITUTE
        ? req.user.instituteId || "non-existent-id"
        : undefined;

    const result = await this.instituteService.list({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
      status:
        typeof req.query.status === "string" ? req.query.status : undefined,
      id: scopedId,
    });

    return ApiResponse.success(res, result, "Institutes fetched successfully.");
  });

  approve = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid institute id.");
    }

    const institute = await this.instituteService.approve(id);

    return ApiResponse.success(res, institute, "Institute approved successfully.");
  });

  suspend = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid institute id.");
    }

    const institute = await this.instituteService.suspend(id);

    return ApiResponse.success(res, institute, "Institute suspended successfully.");
  });

  reactivate = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid institute id.");
    }

    const institute = await this.instituteService.reactivate(id);

    return ApiResponse.success(res, institute, "Institute reactivated successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid institute id.");
    }

    if (req.user?.role === UserRole.INSTITUTE && id !== req.user.instituteId) {
      throw new ForbiddenError("You are not authorized to delete other institutes.");
    }

    await this.instituteService.delete(id);

    return ApiResponse.success(res, null, "Institute deleted successfully.");
  });
}
