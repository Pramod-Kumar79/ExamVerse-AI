// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";

// import { DocumentRepository } from "../../documents/repositories";

// import { TesseractProvider } from "../providers";
// import { OcrService } from "../services";
// import { OcrController } from "../controllers";

// const router = Router();

// const documentRepository = new DocumentRepository(prisma);

// const ocrProvider = new TesseractProvider();

// const ocrService = new OcrService(documentRepository, ocrProvider);

// const controller = new OcrController(ocrService);

// /**
//  * @openapi
//  * tags:
//  *   - name: OCR
//  *     description: Optical Character Recognition
//  */

// /**
//  * @openapi
//  * /ocr/documents/{documentId}/extract:
//  *   post:
//  *     tags:
//  *       - OCR
//  *     summary: Extract text using OCR
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: documentId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: OCR completed successfully.
//  *       404:
//  *         description: Document not found.
//  */
// router.post(
//   "/documents/:documentId/extract",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   controller.extract,
// );

// export default router;

import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";

import { DocumentRepository } from "../../documents/repositories";

import { TesseractProvider } from "../providers";
import { OcrService } from "../services";
import { OcrController } from "../controllers";

const router = Router();

const documentRepository = new DocumentRepository(prisma);

const ocrProvider = new TesseractProvider();

const ocrService = new OcrService(documentRepository, ocrProvider);

const controller = new OcrController(ocrService);

/**
 * @openapi
 * tags:
 *   - name: OCR
 *     description: Optical Character Recognition
 */

/**
 * @openapi
 * /ocr/documents/{documentId}/extract:
 *   post:
 *     tags:
 *       - OCR
 *     summary: Extract text using OCR
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OCR completed successfully.
 *       404:
 *         description: Document not found.
 */
router.post(
  "/documents/:documentId/extract",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  controller.extract,
);

export default router;