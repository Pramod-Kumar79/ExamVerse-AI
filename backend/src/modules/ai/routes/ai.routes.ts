// import { Router } from "express";
// import { UserRole } from "@prisma/client";
// import { authenticate, authorize } from "../../auth/middleware";

// import { validateRequest } from "../../../common/middleware";

// import { generateContentSchema, extractQuestionsSchema } from "../schemas";

// import { AIController } from "../controllers";

// import { AiService, QuestionExtractionService } from "../services";
// import { AIReviewRepository } from "../../ai-review/repositories";

// import { AIReviewService } from "../../ai-review/services";

// const router = Router();

// export default router;

// import { GeminiProvider } from "../providers";

// const aiProvider = new GeminiProvider();

// const aiService = new AiService(aiProvider);

// const aiReviewRepository = new AIReviewRepository();

// const aiReviewService = new AIReviewService(aiReviewRepository);

// const questionExtractionService = new QuestionExtractionService(aiService);

// const aiController = new AIController(
//   aiService,
//   questionExtractionService,
//   aiReviewService,
// );

// router.post(
//   "/test",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   validateRequest(generateContentSchema),
//   aiController.generate,
// );

// router.post(
//   "/extract-questions",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   validateRequest(extractQuestionsSchema),
//   aiController.extractQuestions,
// );

import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../../auth/middleware";

import { validateRequest } from "../../../common/middleware";

import { generateContentSchema, extractQuestionsSchema } from "../schemas";

import { AIController } from "../controllers";

import { AiService, QuestionExtractionService } from "../services";
import { AIReviewRepository } from "../../ai-review/repositories";

import { AIReviewService } from "../../ai-review/services";

const router = Router();

export default router;

import { GeminiProvider } from "../providers";

const aiProvider = new GeminiProvider();

const aiService = new AiService(aiProvider);

const aiReviewRepository = new AIReviewRepository();

const aiReviewService = new AIReviewService(aiReviewRepository);

const questionExtractionService = new QuestionExtractionService(aiService);

const aiController = new AIController(
  aiService,
  questionExtractionService,
  aiReviewService,
);

router.post(
  "/test",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  validateRequest(generateContentSchema),
  aiController.generate,
);

router.post(
  "/extract-questions",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  validateRequest(extractQuestionsSchema),
  aiController.extractQuestions,
);