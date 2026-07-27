import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IEvaluationService } from "../services";

export class EvaluationController {
  constructor(private readonly evaluationService: IEvaluationService) {}

  evaluate = asyncHandler(async (req: Request, res: Response) => {
    const attemptId = String(req.params.attemptId);

    const score = await this.evaluationService.evaluateAttempt(attemptId);

    return ApiResponse.success(
      res,
      {
        score,
      },
      "Evaluation completed successfully.",
    );
  });
}
