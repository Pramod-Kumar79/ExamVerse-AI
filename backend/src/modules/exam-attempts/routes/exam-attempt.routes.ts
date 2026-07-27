// import { Router } from "express";
// import { UserRole } from "@prisma/client";
// import { prisma } from "../../../lib/prisma";
// import { authenticate, authorize } from "../../auth/middleware";

// import { ExamRepository } from "../../exams/repositories";
// import { StudentRepository } from "../../students/repositories";
// import { EvaluationRepository } from "../../evaluation/repositories";
// import { EvaluationService } from "../../evaluation/services";
// import { ExamAttemptRepository } from "../repositories";

// import { ExamAttemptService } from "../services";

// import { ExamAttemptController } from "../controllers";

// const router = Router();

// const examRepository = new ExamRepository(prisma);

// const studentRepository = new StudentRepository(prisma);

// const examAttemptRepository = new ExamAttemptRepository();

// const evaluationRepository = new EvaluationRepository();

// const evaluationService = new EvaluationService(evaluationRepository);

// const service = new ExamAttemptService(
//   examAttemptRepository,
//   examRepository,
//   studentRepository,
//   evaluationService,
// );

// const controller = new ExamAttemptController(service);

// router.post("/start", authenticate, controller.startExam);

// router.get(
//   "/exam/:examId",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   controller.listAttemptsForExam,
// );

// router.patch("/:id/save-answer", authenticate, controller.saveAnswer);

// router.get("/:id", authenticate, controller.getAttempt);

// router.post("/:id/submit", authenticate, controller.submitExam);

// export default router;

import { Router } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { authenticate, authorize } from "../../auth/middleware";

import { ExamRepository } from "../../exams/repositories";
import { StudentRepository } from "../../students/repositories";
import { EvaluationRepository } from "../../evaluation/repositories";
import { EvaluationService } from "../../evaluation/services";
import { ExamAttemptRepository } from "../repositories";

import { ExamAttemptService } from "../services";

import { ExamAttemptController } from "../controllers";

const router = Router();

const examRepository = new ExamRepository(prisma);

const studentRepository = new StudentRepository(prisma);

const examAttemptRepository = new ExamAttemptRepository();

const evaluationRepository = new EvaluationRepository();

const evaluationService = new EvaluationService(evaluationRepository);

const service = new ExamAttemptService(
  examAttemptRepository,
  examRepository,
  studentRepository,
  evaluationService,
);

const controller = new ExamAttemptController(service);

router.post("/start", authenticate, controller.startExam);

router.get(
  "/exam/:examId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  controller.listAttemptsForExam,
);

router.get("/me/attempts", authenticate, controller.listMyAttempts);

router.patch("/:id/save-answer", authenticate, controller.saveAnswer);

router.get("/:id", authenticate, controller.getAttempt);

router.post("/:id/submit", authenticate, controller.submitExam);

export default router;