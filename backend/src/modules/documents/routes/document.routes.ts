// /**
//  * @openapi
//  * tags:
//  *   - name: Documents
//  *     description: Document upload and management
//  */
// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";
// import { validateRequest } from "../../../common/middleware";

// import { queryDocumentSchema } from "../schemas";

// import { DocumentRepository } from "../repositories";
// import { DocumentService } from "../services";
// import { DocumentController } from "../controllers";

// import { LocalStorageProvider } from "../storage";

// import { uploadDocument } from "../middleware";

// const router = Router();

// const repository = new DocumentRepository(prisma);

// const storage = new LocalStorageProvider();

// const service = new DocumentService(repository, storage);

// const controller = new DocumentController(service, storage);


// /**
//  * @openapi
//  * /documents/upload:
//  *   post:
//  *     tags:
//  *       - Documents
//  *     summary: Upload a document
//  *     description: Upload a PDF or image document.
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - file
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       201:
//  *         description: Document uploaded successfully.
//  *       400:
//  *         description: Invalid upload.
//  *       401:
//  *         description: Unauthorized.
//  */
// router.post(
//   "/upload",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   uploadDocument.single("file"),
//   controller.upload,
// );

// /**
//  * @openapi
//  * /documents:
//  *   get:
//  *     tags:
//  *       - Documents
//  *     summary: List uploaded documents
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Documents fetched successfully.
//  */
// router.get(
//   "/",
//   authenticate,
//   validateRequest(queryDocumentSchema, "query"),
//   controller.list,
// );

// /**
//  * @openapi
//  * /documents/{id}:
//  *   get:
//  *     tags:
//  *       - Documents
//  *     summary: Get document by id
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Document fetched successfully.
//  */
// router.get("/:id", authenticate, controller.getById);

// /**
//  * @openapi
//  * /documents/{id}:
//  *   delete:
//  *     tags:
//  *       - Documents
//  *     summary: Delete document
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Document deleted successfully.
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   controller.delete,
// );

// export default router;




/**
 * @openapi
 * tags:
 *   - name: Documents
 *     description: Document upload and management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";
import { validateRequest } from "../../../common/middleware";

import { queryDocumentSchema } from "../schemas";

import { DocumentRepository } from "../repositories";
import { DocumentService } from "../services";
import { DocumentController } from "../controllers";

import { LocalStorageProvider } from "../storage";

import { uploadDocument } from "../middleware";

const router = Router();

const repository = new DocumentRepository(prisma);

const storage = new LocalStorageProvider();

const service = new DocumentService(repository, storage);

const controller = new DocumentController(service, storage);


/**
 * @openapi
 * /documents/upload:
 *   post:
 *     tags:
 *       - Documents
 *     summary: Upload a document
 *     description: Upload a PDF or image document.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully.
 *       400:
 *         description: Invalid upload.
 *       401:
 *         description: Unauthorized.
 */
router.post(
  "/upload",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  uploadDocument.single("file"),
  controller.upload,
);

/**
 * @openapi
 * /documents:
 *   get:
 *     tags:
 *       - Documents
 *     summary: List uploaded documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents fetched successfully.
 */
router.get(
  "/",
  authenticate,
  validateRequest(queryDocumentSchema, "query"),
  controller.list,
);

/**
 * @openapi
 * /documents/{id}:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get document by id
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
 *         description: Document fetched successfully.
 */
router.get("/:id", authenticate, controller.getById);

/**
 * @openapi
 * /documents/{id}:
 *   delete:
 *     tags:
 *       - Documents
 *     summary: Delete document
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
 *         description: Document deleted successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  controller.delete,
);

export default router;