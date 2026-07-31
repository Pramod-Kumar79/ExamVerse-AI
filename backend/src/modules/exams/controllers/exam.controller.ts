import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import { ReorderExamQuestionsDto } from "../dto";

import type { IExamService } from "../services";

export class ExamController {
  constructor(private readonly examService: IExamService) {}

  private getRequestingUser(req: Request<any, any, any, any>) {
    return {
      id: req.user.id,
      role: req.user.role,
      instituteId: (req.user as any).instituteId,
    };
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const exam = await this.examService.create(req.body, req.user.id);

    return ApiResponse.success(res, exam, "Exam created successfully.", 201);
  });

  createPractice = asyncHandler(async (req: Request, res: Response) => {
    const exam = await this.examService.createPracticeExam(
      req.user.id,
      req.body,
    );

    return ApiResponse.success(
      res,
      exam,
      "Practice exam created successfully.",
      201,
    );
  });

  myPracticeExams = asyncHandler(async (req: Request, res: Response) => {
    const exams = await this.examService.listMyPracticeExams(req.user.id);

    return ApiResponse.success(
      res,
      exams,
      "Your practice exams fetched successfully.",
    );
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid exam id.");
    }

    const exam = await this.examService.getById(id, this.getRequestingUser(req));

    return ApiResponse.success(res, exam, "Exam fetched successfully.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid exam id.");
    }

    const exam = await this.examService.update(id, req.body, this.getRequestingUser(req));

    return ApiResponse.success(res, exam, "Exam updated successfully.");
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.examService.list(
      {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,

        search:
          typeof req.query.search === "string" ? req.query.search : undefined,

        courseId:
          typeof req.query.courseId === "string" ? req.query.courseId : undefined,

        status:
          typeof req.query.status === "string"
            ? (req.query.status as any)
            : undefined,

        isPublished:
          typeof req.query.isPublished === "string"
            ? req.query.isPublished === "true"
            : undefined,

        isPractice: false,
      },
      this.getRequestingUser(req),
    );

    return ApiResponse.success(res, result, "Exams fetched successfully.");
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid exam id.");
    }

    await this.examService.delete(id, this.getRequestingUser(req));

    return ApiResponse.success(res, null, "Exam archived successfully.");
  });

  attachQuestions = asyncHandler(async (req: Request, res: Response) => {
    const examId = String(req.params.id);

    const { questionIds } = req.body;

    await this.examService.attachQuestions(examId, questionIds, this.getRequestingUser(req));

    return ApiResponse.success(res, null, "Questions attached successfully.");
  });

  removeQuestion = asyncHandler(async (req, res) => {
    const examId = String(req.params.id);

    const questionId = String(req.params.questionId);

    await this.examService.removeQuestion(examId, questionId, this.getRequestingUser(req));

    return ApiResponse.success(res, null, "Question removed successfully.");
  });

  reorderQuestions = asyncHandler(async (req, res) => {
    const examId = String(req.params.id);

    await this.examService.reorderQuestions(
      examId,
      req.body as ReorderExamQuestionsDto,
      this.getRequestingUser(req),
    );

    return ApiResponse.success(res, null, "Questions reordered successfully.");
  });

  preview = asyncHandler(async (req, res) => {
    const examId = String(req.params.id);

    const exam = await this.examService.getPreview(examId, this.getRequestingUser(req));

    return ApiResponse.success(res, exam, "Exam preview fetched successfully.");
  });
}