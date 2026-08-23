import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { ITeacherService } from "../services";

import { UserRole } from "@prisma/client";

export class TeacherController {
  constructor(private readonly teacherService: ITeacherService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const teacher = await this.teacherService.create(req.body);

    return ApiResponse.success(
      res,
      teacher,
      "Teacher created successfully.",
      201,
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid teacher id.");
    }

    const teacher = await this.teacherService.getById(id);

    return ApiResponse.success(res, teacher, "Teacher fetched successfully.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid teacher id.");
    }

    const teacher = await this.teacherService.update(id, req.body);

    return ApiResponse.success(res, teacher, "Teacher updated successfully.");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const scopedInstituteId =
      req.user?.role === UserRole.INSTITUTE
        ? req.user.instituteId || "non-existent-id"
        : typeof req.query.instituteId === "string"
        ? req.query.instituteId
        : undefined;

    const result = await this.teacherService.list({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
      instituteId: scopedInstituteId,
    });

    return ApiResponse.success(res, result, "Teachers fetched successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid teacher id.");
    }

    await this.teacherService.delete(id);

    return ApiResponse.success(res, null, "Teacher deleted successfully.");
  });
}
