// import type { Request, Response } from "express";

// import { asyncHandler } from "../../../common/middleware";
// import { ApiResponse } from "../../../common/response";

// import type { IQuestionService } from "../services";

// export class QuestionController {
//   constructor(private readonly questionService: IQuestionService) {}

//   create = asyncHandler(async (req: Request, res: Response) => {
//     const question = await this.questionService.create(req.body, req.user.id);

//     return ApiResponse.success(
//       res,
//       question,
//       "Question created successfully.",
//       201,
//     );
//   });

//   getById = asyncHandler(async (req: Request, res: Response) => {
//     const id = req.params.id;

//     if (typeof id !== "string") {
//       throw new Error("Invalid question id.");
//     }

//     const question = await this.questionService.getById(id);

//     return ApiResponse.success(res, question, "Question fetched successfully.");
//   });

//   update = asyncHandler(async (req: Request, res: Response) => {
//     const id = req.params.id;

//     if (typeof id !== "string") {
//       throw new Error("Invalid question id.");
//     }

//     const question = await this.questionService.update(id, req.body);

//     return ApiResponse.success(res, question, "Question updated successfully.");
//   });

//   list = asyncHandler(async (req: Request, res: Response) => {
//     const result = await this.questionService.list({
//       page: typeof req.query.page === "string" ? Number(req.query.page) : 1,

//       limit: typeof req.query.limit === "string" ? Number(req.query.limit) : 10,

//       search:
//         typeof req.query.search === "string" ? req.query.search : undefined,

//       type:
//         typeof req.query.type === "string"
//           ? (req.query.type as any)
//           : undefined,

//       difficulty:
//         typeof req.query.difficulty === "string"
//           ? (req.query.difficulty as any)
//           : undefined,

//       chapter:
//         typeof req.query.chapter === "string" ? req.query.chapter : undefined,

//       topic: typeof req.query.topic === "string" ? req.query.topic : undefined,

//       isActive:
//         typeof req.query.isActive === "string"
//           ? req.query.isActive === "true"
//           : undefined,
//       aiGenerated:
//         typeof req.query.aiGenerated === "string"
//           ? req.query.aiGenerated === "true"
//           : undefined,

//       year:
//         typeof req.query.year === "string" ? Number(req.query.year) : undefined,

//       source:
//         typeof req.query.source === "string" ? req.query.source : undefined,

//       sortBy:
//         typeof req.query.sortBy === "string"
//           ? (req.query.sortBy as any)
//           : undefined,

//       sortOrder:
//         typeof req.query.sortOrder === "string"
//           ? (req.query.sortOrder as "asc" | "desc")
//           : undefined,
//     });

//     return ApiResponse.success(res, result, "Questions fetched successfully.");
//   });

//   delete = asyncHandler(async (req: Request, res: Response) => {
//     const id = req.params.id;

//     if (typeof id !== "string") {
//       throw new Error("Invalid question id.");
//     }

//     await this.questionService.delete(id);

//     return ApiResponse.success(res, null, "Question deleted successfully.");
//   });

//   bulkDelete = asyncHandler(async (req: Request, res: Response) => {
//     const count = await this.questionService.bulkDelete(req.body);

//     return ApiResponse.success(
//       res,
//       {
//         deletedCount: count,
//       },
//       `${count} question(s) deleted successfully.`,
//     );
//   });
// }

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

      // Students only ever see their own personal bank here; staff see the
      // shared bank (never mixed with any student's personal questions).
      scope: isStudent ? "own" : "shared",
      ownerId: isStudent ? req.user.id : undefined,
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