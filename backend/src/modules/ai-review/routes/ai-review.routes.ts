import { Router } from "express";
import { UserRole } from "@prisma/client";

import { authenticate, authorize } from "../../auth/middleware";

import { AIReviewController } from "../controllers";

import { AIReviewRepository } from "../repositories";

import { AIReviewService } from "../services";

const router = Router();

const repository = new AIReviewRepository();

const service = new AIReviewService(repository);

const controller = new AIReviewController(service);

router.get(
  "/jobs/:processingJobId",
  controller.getQuestions,
);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  controller.getQuestionById,
);

router.patch(
  "/:id/approve",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  controller.approveQuestion,
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  controller.rejectQuestion,
);

router.post("/questions/:id/approve", controller.approveQuestion);

router.patch("/questions/:id", controller.updateQuestion);

router.post(
  "/:id/publish",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  controller.publishQuestion,
);

export default router;
