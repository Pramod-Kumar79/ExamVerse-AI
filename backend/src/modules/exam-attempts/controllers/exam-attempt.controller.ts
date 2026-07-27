// import type { Request, Response } from "express";

// import { asyncHandler } from "../../../common/middleware";
// import { ApiResponse } from "../../../common/response";

// import type { IExamAttemptService } from "../services";

// export class ExamAttemptController {
//   constructor(private readonly examAttemptService: IExamAttemptService) {}

//   startExam = asyncHandler(async (req: Request, res: Response) => {
//     const attempt = await this.examAttemptService.startExam(
//       req.user.id,
//       req.body,
//     );

//     return ApiResponse.created(res, attempt, "Exam started successfully.");
//   });

//   saveAnswer = asyncHandler(async (req: Request, res: Response) => {
//     const attemptId = String(req.params.id);

//     await this.examAttemptService.saveAnswer(attemptId, req.body);

//     return ApiResponse.success(res, null, "Answer saved successfully.");
//   });

//   getAttempt = asyncHandler(async (req, res) => {
//     const attemptId = String(req.params.id);

//     const result = await this.examAttemptService.getAttempt(attemptId);

//     return ApiResponse.success(
//       res,
//       result,
//       "Exam attempt fetched successfully.",
//     );
//   });

//   submitExam = asyncHandler(async (req: Request, res: Response) => {
//     const attemptId = String(req.params.id);

//     await this.examAttemptService.submitExam(attemptId);

//     return ApiResponse.success(res, null, "Exam submitted successfully.");
//   });

//   listAttemptsForExam = asyncHandler(async (req: Request, res: Response) => {
//     const examId = String(req.params.examId);

//     const attempts = await this.examAttemptService.getResultsForExam(examId);

//     return ApiResponse.success(
//       res,
//       attempts,
//       "Exam attempts fetched successfully.",
//     );
//   });
// }

// import type { Request, Response } from "express";

// import { asyncHandler } from "../../../common/middleware";
// import { ApiResponse } from "../../../common/response";

// import type { IExamAttemptService } from "../services";

// export class ExamAttemptController {
//   constructor(private readonly examAttemptService: IExamAttemptService) {}

//   startExam = asyncHandler(async (req: Request, res: Response) => {
//     const attempt = await this.examAttemptService.startExam(
//       req.user.id,
//       req.body,
//     );

//     return ApiResponse.created(res, attempt, "Exam started successfully.");
//   });

//   saveAnswer = asyncHandler(async (req: Request, res: Response) => {
//     const attemptId = String(req.params.id);

//     await this.examAttemptService.saveAnswer(attemptId, req.body);

//     return ApiResponse.success(res, null, "Answer saved successfully.");
//   });

//   getAttempt = asyncHandler(async (req, res) => {
//     const attemptId = String(req.params.id);

//     const result = await this.examAttemptService.getAttempt(attemptId);

//     return ApiResponse.success(
//       res,
//       result,
//       "Exam attempt fetched successfully.",
//     );
//   });

//   submitExam = asyncHandler(async (req: Request, res: Response) => {
//     const attemptId = String(req.params.id);

//     await this.examAttemptService.submitExam(attemptId);

//     return ApiResponse.success(res, null, "Exam submitted successfully.");
//   });

//   listAttemptsForExam = asyncHandler(async (req: Request, res: Response) => {
//     const examId = String(req.params.examId);

//     const attempts = await this.examAttemptService.getResultsForExam(examId);

//     return ApiResponse.success(
//       res,
//       attempts,
//       "Exam attempts fetched successfully.",
//     );
//   });

//   listMyAttempts = asyncHandler(async (req: Request, res: Response) => {
//     const attempts = await this.examAttemptService.getMyAttempts(req.user.id);

//     return ApiResponse.success(
//       res,
//       attempts,
//       "Your exam attempts fetched successfully.",
//     );
//   });
// }

import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IExamAttemptService } from "../services";

export class ExamAttemptController {
  constructor(private readonly examAttemptService: IExamAttemptService) {}

  startExam = asyncHandler(async (req: Request, res: Response) => {
    const attempt = await this.examAttemptService.startExam(
      req.user.id,
      req.body,
    );

    return ApiResponse.created(res, attempt, "Exam started successfully.");
  });

  saveAnswer = asyncHandler(async (req: Request, res: Response) => {
    const attemptId = String(req.params.id);

    await this.examAttemptService.saveAnswer(attemptId, req.body, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(res, null, "Answer saved successfully.");
  });

  getAttempt = asyncHandler(async (req, res) => {
    const attemptId = String(req.params.id);

    const result = await this.examAttemptService.getAttempt(attemptId, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(
      res,
      result,
      "Exam attempt fetched successfully.",
    );
  });

  submitExam = asyncHandler(async (req: Request, res: Response) => {
    const attemptId = String(req.params.id);

    await this.examAttemptService.submitExam(attemptId, {
      id: req.user.id,
      role: req.user.role,
    });

    return ApiResponse.success(res, null, "Exam submitted successfully.");
  });

  listAttemptsForExam = asyncHandler(async (req: Request, res: Response) => {
    const examId = String(req.params.examId);

    const attempts = await this.examAttemptService.getResultsForExam(examId);

    return ApiResponse.success(
      res,
      attempts,
      "Exam attempts fetched successfully.",
    );
  });

  listMyAttempts = asyncHandler(async (req: Request, res: Response) => {
    const attempts = await this.examAttemptService.getMyAttempts(req.user.id);

    return ApiResponse.success(
      res,
      attempts,
      "Your exam attempts fetched successfully.",
    );
  });
}