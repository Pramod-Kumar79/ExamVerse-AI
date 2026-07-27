// /**
//  * @openapi
//  * tags:
//  *   - name: Subjects
//  *     description: Subject management
//  */
// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";

// import { validateRequest } from "../../../common/middleware";

// import { createSubjectSchema, updateSubjectSchema } from "../schemas";

// import { SubjectRepository } from "../repositories";
// import { SubjectService } from "../services";
// import { SubjectController } from "../controllers";

// const router = Router();

// const subjectRepository = new SubjectRepository(prisma);
// const subjectService = new SubjectService(subjectRepository);
// const subjectController = new SubjectController(subjectService);

// /**
//  * Public (Authenticated)
//  */

// /**
//  * @openapi
//  * /subjects/{id}:
//  *   get:
//  *     tags:
//  *       - Subjects
//  *     summary: Get subject by ID
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
//  *         description: Subject fetched successfully.
//  *       404:
//  *         description: Subject not found.
//  */
// router.get("/:id", authenticate, subjectController.getById);

// /**
//  * Admin
//  */

// /**
//  * @openapi
//  * /subjects:
//  *   post:
//  *     tags:
//  *       - Subjects
//  *     summary: Create a subject
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateSubjectRequest'
//  *     responses:
//  *       201:
//  *         description: Subject created successfully.
//  *       400:
//  *         description: Validation error.
//  *       401:
//  *         description: Unauthorized.
//  */
// router.post(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(createSubjectSchema),
//   subjectController.create,
// );

// /**
//  * @openapi
//  * /subjects:
//  *   get:
//  *     tags:
//  *       - Subjects
//  *     summary: List subjects
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Subjects fetched successfully.
//  */
// router.get(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   subjectController.list,
// );


// /**
//  * @openapi
//  * /subjects/{id}:
//  *   patch:
//  *     tags:
//  *       - Subjects
//  *     summary: Update subject
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/UpdateSubjectRequest'
//  *     responses:
//  *       200:
//  *         description: Subject updated successfully.
//  */
// router.patch(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(updateSubjectSchema),
//   subjectController.update,
// );

// /**
//  * @openapi
//  * /subjects/{id}:
//  *   delete:
//  *     tags:
//  *       - Subjects
//  *     summary: Soft delete subject
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
//  *         description: Subject deleted successfully.
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   subjectController.delete,
// );

// export default router;




/**
 * @openapi
 * tags:
 *   - name: Subjects
 *     description: Subject management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";

import { validateRequest } from "../../../common/middleware";

import { createSubjectSchema, updateSubjectSchema } from "../schemas";

import { SubjectRepository } from "../repositories";
import { SubjectService } from "../services";
import { SubjectController } from "../controllers";

const router = Router();

const subjectRepository = new SubjectRepository(prisma);
const subjectService = new SubjectService(subjectRepository);
const subjectController = new SubjectController(subjectService);

/**
 * Public (Authenticated)
 */

/**
 * @openapi
 * /subjects/{id}:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: Get subject by ID
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
 *         description: Subject fetched successfully.
 *       404:
 *         description: Subject not found.
 */
router.get("/:id", authenticate, subjectController.getById);

/**
 * Admin
 */

/**
 * @openapi
 * /subjects:
 *   post:
 *     tags:
 *       - Subjects
 *     summary: Create a subject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubjectRequest'
 *     responses:
 *       201:
 *         description: Subject created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(createSubjectSchema),
  subjectController.create,
);

/**
 * @openapi
 * /subjects:
 *   get:
 *     tags:
 *       - Subjects
 *     summary: List subjects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subjects fetched successfully.
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  subjectController.list,
);


/**
 * @openapi
 * /subjects/{id}:
 *   patch:
 *     tags:
 *       - Subjects
 *     summary: Update subject
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
 *             $ref: '#/components/schemas/UpdateSubjectRequest'
 *     responses:
 *       200:
 *         description: Subject updated successfully.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(updateSubjectSchema),
  subjectController.update,
);

/**
 * @openapi
 * /subjects/{id}:
 *   delete:
 *     tags:
 *       - Subjects
 *     summary: Soft delete subject
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
 *         description: Subject deleted successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  subjectController.delete,
);

export default router;