import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IStudentService } from "../services";

export class StudentController {
  constructor(private readonly studentService: IStudentService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const student = await this.studentService.create(req.body);

    return ApiResponse.success(
      res,
      student,
      "Student created successfully.",
      201,
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid student id.");
    }

    const student = await this.studentService.getById(id);

    return ApiResponse.success(res, student, "Student fetched successfully.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid student id.");
    }

    const student = await this.studentService.update(id, req.body);

    return ApiResponse.success(res, student, "Student updated successfully.");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.studentService.list({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      batchId:
        typeof req.query.batchId === "string" ? req.query.batchId : undefined,
      semester:
        typeof req.query.semester === "string"
          ? Number(req.query.semester)
          : undefined,
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
    });

    return ApiResponse.success(res, result, "Students fetched successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid student id.");
    }

    await this.studentService.delete(id);

    return ApiResponse.success(res, null, "Student deleted successfully.");
  });
}
