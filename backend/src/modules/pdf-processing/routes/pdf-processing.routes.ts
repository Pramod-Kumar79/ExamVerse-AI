// /**
//  * @openapi
//  * tags:
//  *   - name: PDF Processing
//  *     description: Analyze uploaded PDF documents
//  */
// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";

// import { DocumentRepository } from "../../documents/repositories";

// import { PdfProcessingController } from "../controllers";

// import { PdfProcessingService } from "../services";

// const router = Router();

// const documentRepository = new DocumentRepository(prisma);

// const pdfProcessingService = new PdfProcessingService();

// const pdfProcessingController = new PdfProcessingController(
//   pdfProcessingService,
//   documentRepository,
// );


// /**
//  * @openapi
//  * /pdf-processing/{documentId}/analyze:
//  *   post:
//  *     tags:
//  *       - PDF Processing
//  *     summary: Analyze a PDF document
//  *     description: Extracts text and metadata from an uploaded PDF.
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
//  *         description: PDF analyzed successfully.
//  *       404:
//  *         description: Document not found.
//  */
// router.post(
//   "/:documentId/analyze",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   pdfProcessingController.analyze,
// );

// export default router;



/**
 * @openapi
 * tags:
 *   - name: PDF Processing
 *     description: Analyze uploaded PDF documents
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";

import { DocumentRepository } from "../../documents/repositories";

import { PdfProcessingController } from "../controllers";

import { PdfProcessingService } from "../services";

const router = Router();

const documentRepository = new DocumentRepository(prisma);

const pdfProcessingService = new PdfProcessingService();

const pdfProcessingController = new PdfProcessingController(
  pdfProcessingService,
  documentRepository,
);


/**
 * @openapi
 * /pdf-processing/{documentId}/analyze:
 *   post:
 *     tags:
 *       - PDF Processing
 *     summary: Analyze a PDF document
 *     description: Extracts text and metadata from an uploaded PDF.
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
 *         description: PDF analyzed successfully.
 *       404:
 *         description: Document not found.
 */
router.post(
  "/:documentId/analyze",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  pdfProcessingController.analyze,
);

export default router;