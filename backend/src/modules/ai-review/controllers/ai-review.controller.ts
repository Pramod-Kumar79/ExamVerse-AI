import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IAIReviewService } from "../services";

export class AIReviewController {
  constructor(private readonly aiReviewService: IAIReviewService) {}

  getQuestions = asyncHandler(async (_req: Request, res: Response) => {
    // const processingJobId = Array.isArray(_req.params.processingJobId)
    //   ? _req.params.processingJobId[0]
    //   : _req.params.processingJobId;

    const processingJobId = String(_req.params.processingJobId);

    const questions =
      await this.aiReviewService.getQuestionsByProcessingJob(processingJobId);

    return ApiResponse.success(
      res,
      questions,
      "Pending AI questions fetched successfully.",
    );
  });

  getQuestionById = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const question = await this.aiReviewService.getQuestionById(id);

    return ApiResponse.success(
      res,
      question,
      "AI question fetched successfully.",
    );
  });

  approveQuestion = asyncHandler(async (req: Request, res: Response) => {
    // const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const id = String(req.params.id);

    const question = await this.aiReviewService.approveQuestion(
      id,
      req.user.id,
    );

    return ApiResponse.success(
      res,
      question,
      "Question approved successfully.",
    );
  });

  rejectQuestion = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const question = await this.aiReviewService.rejectQuestion(id, req.user.id);

    return ApiResponse.success(
      res,
      question,
      "Question rejected successfully.",
    );
  });

  updateQuestion = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const result = await this.aiReviewService.updateQuestion(id, req.body);

    return ApiResponse.success(res, result, "Question updated successfully.");
  });

  publishQuestion = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const teacherId = req.user.id;

    const question = await this.aiReviewService.publishQuestion(id, teacherId);

    return ApiResponse.success(
      res,
      question,
      "Question published successfully.",
    );
  });
}
