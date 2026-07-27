/**
 * @openapi
 * tags:
 *   - name: Processing Jobs
 *     description: Document processing queue management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";
import { validateRequest } from "../../../common/middleware";

import {
  createProcessingJobSchema,
  updateProcessingJobSchema,
  queryProcessingJobSchema,
} from "../schemas";

import { ProcessingJobRepository } from "../repositories";
import { ProcessingJobService } from "../services";
import { ProcessingJobController } from "../controllers";

import { DocumentRepository } from "../../documents/repositories";

import { ProcessingPipelineService } from "../pipeline";

import { PdfProcessingService } from "../../pdf-processing/services";

import { OcrService } from "../../ocr/services";
import { TesseractProvider } from "../../ocr/providers";

import { AiService } from "../../ai/services/ai.service";
import { QuestionExtractionService } from "../../ai/services/question-extraction.service";

import { AIReviewRepository } from "../../ai-review/repositories";
import { AIReviewService } from "../../ai-review/services";

import { GeminiProvider } from "../../ai/providers";

const router = Router();

const processingRepository = new ProcessingJobRepository(prisma);
const documentRepository = new DocumentRepository(prisma);

const pdfProcessingService = new PdfProcessingService();

const ocrProvider = new TesseractProvider();

const ocrService = new OcrService(documentRepository, ocrProvider);

const aiProvider = new GeminiProvider();

const aiService = new AiService(aiProvider);

const questionExtractionService = new QuestionExtractionService(aiService);

const aiReviewRepository = new AIReviewRepository();

const aiReviewService = new AIReviewService(aiReviewRepository);

const pipelineService = new ProcessingPipelineService(
  processingRepository,
  documentRepository,
  pdfProcessingService,
  ocrService,
  questionExtractionService,
  aiReviewService,
);

const processingService = new ProcessingJobService(
  processingRepository,
  documentRepository,
  pipelineService,
);

const processingController = new ProcessingJobController(processingService);

/**
 * Create processing job
 */

/**
 * @openapi
 * /processing-jobs/documents/{id}/process:
 *   post:
 *     tags:
 *       - Processing Jobs
 *     summary: Create a processing job for a document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Processing job created successfully.
 *       404:
 *         description: Document not found.
 *       400:
 *         description: Document already queued.
 */
router.post(
  "/documents/:id/process",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  processingController.create,
);

/**
 * Get all jobs
 */

/**
 * @openapi
 * /processing-jobs:
 *   get:
 *     tags:
 *       - Processing Jobs
 *     summary: List processing jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: documentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Processing jobs fetched successfully.
 */
router.get(
  "/",
  authenticate,
  validateRequest(queryProcessingJobSchema, "query"),
  processingController.list,
);

/**
 * Get single job
 */

/**
 * @openapi
 * /processing-jobs/{jobId}:
 *   get:
 *     tags:
 *       - Processing Jobs
 *     summary: Get processing job by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Processing job fetched successfully.
 */
router.get("/:jobId", authenticate, processingController.getById);

/**
 * Update job
 */

/**
 * @openapi
 * /processing-jobs/{jobId}:
 *   patch:
 *     tags:
 *       - Processing Jobs
 *     summary: Update processing job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProcessingJobRequest'
 *     responses:
 *       200:
 *         description: Processing job updated successfully.
 */
router.patch(
  "/:jobId",
  authenticate,
  authorize(UserRole.ADMIN),
  validateRequest(updateProcessingJobSchema),
  processingController.update,
);

export default router;
