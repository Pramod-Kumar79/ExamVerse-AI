import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { ICourseService } from "../services";

export class CourseController {
  constructor(private readonly courseService: ICourseService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const course = await this.courseService.create(req.body);

    return ApiResponse.success(
      res,
      course,
      "Course created successfully.",
      201,
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid course id.");
    }

    const course = await this.courseService.getById(id);

    return ApiResponse.success(res, course, "Course fetched successfully.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid course id.");
    }

    const course = await this.courseService.update(id, req.body);

    return ApiResponse.success(res, course, "Course updated successfully.");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.courseService.list({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,

      search:
        typeof req.query.search === "string" ? req.query.search : undefined,

      instituteId:
        typeof req.query.instituteId === "string"
          ? req.query.instituteId
          : undefined,

      subjectId:
        typeof req.query.subjectId === "string"
          ? req.query.subjectId
          : undefined,

      teacherId:
        typeof req.query.teacherId === "string"
          ? req.query.teacherId
          : undefined,

      batchId:
        typeof req.query.batchId === "string" ? req.query.batchId : undefined,

      semester:
        typeof req.query.semester === "string"
          ? Number(req.query.semester)
          : undefined,

      academicYear:
        typeof req.query.academicYear === "string"
          ? req.query.academicYear
          : undefined,

      isActive:
        typeof req.query.isActive === "string"
          ? req.query.isActive === "true"
          : undefined,
    });

    return ApiResponse.success(res, result, "Courses fetched successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid course id.");
    }

    await this.courseService.delete(id);

    return ApiResponse.success(res, null, "Course deleted successfully.");
  });
}
