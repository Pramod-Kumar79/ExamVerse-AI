/**
 * @openapi
 * tags:
 *   - name: Exams
 *     description: Examination management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";
import { validateRequest } from "../../../common/middleware";

import { createExamSchema, createPracticeExamSchema, updateExamSchema } from "../schemas";

import { ExamRepository } from "../repositories";
import { ExamService } from "../services";
import { ExamController } from "../controllers";

import { CourseRepository } from "../../courses/repositories";
import { QuestionRepository } from "../../questions/repositories";

const router = Router();

const examRepository = new ExamRepository(prisma);
const courseRepository = new CourseRepository(prisma);
const questionRepository = new QuestionRepository(prisma);

const examService = new ExamService(examRepository, courseRepository, questionRepository);

const examController = new ExamController(examService);


/**
 * @openapi
 * /exams:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create exam
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExamRequest'
 *     responses:
 *       201:
 *         description: Exam created successfully.
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  validateRequest(createExamSchema),
  examController.create,
);


/**
 * @openapi
 * /exams/practice:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create a self-service practice exam from the question bank
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Practice exam created successfully.
 */
router.post(
  "/practice",
  authenticate,
  validateRequest(createPracticeExamSchema),
  examController.createPractice,
);

/**
 * @openapi
 * /exams/practice/mine:
 *   get:
 *     tags:
 *       - Exams
 *     summary: List practice exams the current user created
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Practice exams fetched successfully.
 */
router.get("/practice/mine", authenticate, examController.myPracticeExams);


/**
 * @openapi
 * /exams:
 *   get:
 *     tags:
 *       - Exams
 *     summary: List exams
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exams fetched successfully.
 */
router.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER), examController.list);


/**
 * @openapi
 * /exams/{id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get exam by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam fetched successfully.
 */
router.get("/:id", authenticate, examController.getById);


/**
 * @openapi
 * /exams/{id}:
 *   patch:
 *     tags:
 *       - Exams
 *     summary: Update exam
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExamRequest'
 *     responses:
 *       200:
 *         description: Exam updated successfully.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  validateRequest(updateExamSchema),
  examController.update,
);


/**
 * @openapi
 * /exams/{id}:
 *   delete:
 *     tags:
 *       - Exams
 *     summary: Archive exam
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam archived successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  examController.delete,
);

// NOTE: these four routes previously had no auth middleware at all — fixed
// alongside the practice-exam work since it touches this same file.
router.post(
  "/:id/questions",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  examController.attachQuestions,
);

router.delete(
  "/:id/questions/:questionId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  examController.removeQuestion,
);

router.patch(
  "/:id/questions/reorder",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  examController.reorderQuestions,
);

router.get(
  "/:id/preview",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  examController.preview,
);

export default router;