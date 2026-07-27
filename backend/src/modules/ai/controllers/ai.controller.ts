import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IAiService } from "../services";
import type { IQuestionExtractionService } from "../services";
import type { IAIReviewService } from "../../ai-review/services";

export class AIController {
  constructor(
    private readonly aiService: IAiService,
    private readonly questionExtractionService: IQuestionExtractionService,
    private readonly aiReviewService: IAIReviewService,
  ) {}

  generate = asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;

    const result = await this.aiService.generateContent(prompt);

    return ApiResponse.success(res, result, "Content generated successfully.");
  });

  extractQuestions = asyncHandler(async (req: Request, res: Response) => {
    const { text } = req.body;

    const result = await this.questionExtractionService.extractQuestions(text);

    // await this.aiReviewService.saveExtractedQuestions(
    //   processingJobId,
    //   documentId,
    //   result.questions,
    // );

    return ApiResponse.success(
      res,
      result,
      "Questions extracted and saved successfully.",
    );
  });
}