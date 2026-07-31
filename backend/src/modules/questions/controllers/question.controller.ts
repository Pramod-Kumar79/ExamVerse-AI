import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IQuestionService } from "../services";

export class QuestionController {
  constructor(private readonly questionService: IQuestionService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const question = await this.questionService.create(req.body, req.user.id);

    return ApiResponse.success(
      res,
      question,
      "Question created successfully.",
      201,
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid question id.");
    }

    const question = await this.questionService.getById(id, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(res, question, "Question fetched successfully.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid question id.");
    }

    const question = await this.questionService.update(id, req.body, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(res, question, "Question updated successfully.");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const isStudent = req.user.role === "STUDENT";
    const isTeacher = req.user.role === "TEACHER";
    // Students normally only see their own personal bank. When picking
    // questions for a practice exam, they can explicitly ask to also see
    // the shared teacher/admin bank via ?scope=own_and_shared — this never
    // exposes other students' personal questions. Teachers see only their own bank.
    const wantsCombinedScope =
      isStudent && req.query.scope === "own_and_shared";

    const result = await this.questionService.list({
      page: typeof req.query.page === "string" ? Number(req.query.page) : 1,

      limit: typeof req.query.limit === "string" ? Number(req.query.limit) : 10,

      search:
        typeof req.query.search === "string" ? req.query.search : undefined,

      type:
        typeof req.query.type === "string"
          ? (req.query.type as any)
          : undefined,

      difficulty:
        typeof req.query.difficulty === "string"
          ? (req.query.difficulty as any)
          : undefined,

      chapter:
        typeof req.query.chapter === "string" ? req.query.chapter : undefined,

      topic: typeof req.query.topic === "string" ? req.query.topic : undefined,

      isActive:
        typeof req.query.isActive === "string"
          ? req.query.isActive === "true"
          : undefined,
      aiGenerated:
        typeof req.query.aiGenerated === "string"
          ? req.query.aiGenerated === "true"
          : undefined,

      year:
        typeof req.query.year === "string" ? Number(req.query.year) : undefined,

      source:
        typeof req.query.source === "string" ? req.query.source : undefined,

      sortBy:
        typeof req.query.sortBy === "string"
          ? (req.query.sortBy as any)
          : undefined,

      sortOrder:
        typeof req.query.sortOrder === "string"
          ? (req.query.sortOrder as "asc" | "desc")
          : undefined,

      // Students and Teachers see their own personal bank.
      // Admins/Institutes see the shared/all bank.
      scope: isStudent || isTeacher
        ? wantsCombinedScope
          ? "own_and_shared"
          : "own"
        : "shared",
      ownerId: isStudent || isTeacher ? req.user.id : undefined,
    });

    return ApiResponse.success(res, result, "Questions fetched successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid question id.");
    }

    await this.questionService.delete(id, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(res, null, "Question deleted successfully.");
  });

  bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const count = await this.questionService.bulkDelete(req.body);

    return ApiResponse.success(
      res,
      {
        deletedCount: count,
      },
      `${count} question(s) deleted successfully.`,
    );
  });
}