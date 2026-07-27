// /**
//  * @openapi
//  * tags:
//  *   - name: Batches
//  *     description: Batch management
//  */
// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";
// import { validateRequest } from "../../../common/middleware";

// import { createBatchSchema, updateBatchSchema } from "../schemas";

// import { BatchRepository } from "../repositories";
// import { BatchService } from "../services";
// import { BatchController } from "../controllers";

// import { InstituteRepository } from "../../institutes/repositories";

// const router = Router();

// const instituteRepository = new InstituteRepository(prisma);

// const batchRepository = new BatchRepository(prisma);

// const batchService = new BatchService(batchRepository, instituteRepository);

// const batchController = new BatchController(batchService);


// /**
//  * @openapi
//  * /batches:
//  *   post:
//  *     tags:
//  *       - Batches
//  *     summary: Create a batch
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateBatchRequest'
//  *     responses:
//  *       201:
//  *         description: Batch created successfully.
//  *       400:
//  *         description: Validation error.
//  *       401:
//  *         description: Unauthorized.
//  */
// router.post(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(createBatchSchema),
//   batchController.create,
// );

// /**
//  * @openapi
//  * /batches:
//  *   get:
//  *     tags:
//  *       - Batches
//  *     summary: List batches
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Batches fetched successfully.
//  */
// router.get("/", authenticate, authorize(UserRole.ADMIN), batchController.list);


// /**
//  * @openapi
//  * /batches/{id}:
//  *   get:
//  *     tags:
//  *       - Batches
//  *     summary: Get batch by id
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
//  *         description: Batch fetched successfully.
//  *       404:
//  *         description: Batch not found.
//  */
// router.get("/:id", authenticate, batchController.getById);


// /**
//  * @openapi
//  * /batches/{id}:
//  *   patch:
//  *     tags:
//  *       - Batches
//  *     summary: Update batch
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
//  *             $ref: '#/components/schemas/UpdateBatchRequest'
//  *     responses:
//  *       200:
//  *         description: Batch updated successfully.
//  *       409:
//  *         description: Conflict (e.g. duplicate code).
//  */
// router.patch(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(updateBatchSchema),
//   batchController.update,
// );


// /**
//  * @openapi
//  * /batches/{id}:
//  *   delete:
//  *     tags:
//  *       - Batches
//  *     summary: Soft delete batch
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
//  *         description: Batch deleted successfully.
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   batchController.delete,
// );

// export default router;



/**
 * @openapi
 * tags:
 *   - name: Batches
 *     description: Batch management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";
import { validateRequest } from "../../../common/middleware";

import { createBatchSchema, updateBatchSchema } from "../schemas";

import { BatchRepository } from "../repositories";
import { BatchService } from "../services";
import { BatchController } from "../controllers";

import { InstituteRepository } from "../../institutes/repositories";

const router = Router();

const instituteRepository = new InstituteRepository(prisma);

const batchRepository = new BatchRepository(prisma);

const batchService = new BatchService(batchRepository, instituteRepository);

const batchController = new BatchController(batchService);


/**
 * @openapi
 * /batches:
 *   post:
 *     tags:
 *       - Batches
 *     summary: Create a batch
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBatchRequest'
 *     responses:
 *       201:
 *         description: Batch created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(createBatchSchema),
  batchController.create,
);

/**
 * @openapi
 * /batches:
 *   get:
 *     tags:
 *       - Batches
 *     summary: List batches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Batches fetched successfully.
 */
router.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.INSTITUTE), batchController.list);


/**
 * @openapi
 * /batches/{id}:
 *   get:
 *     tags:
 *       - Batches
 *     summary: Get batch by id
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
 *         description: Batch fetched successfully.
 *       404:
 *         description: Batch not found.
 */
router.get("/:id", authenticate, batchController.getById);


/**
 * @openapi
 * /batches/{id}:
 *   patch:
 *     tags:
 *       - Batches
 *     summary: Update batch
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
 *             $ref: '#/components/schemas/UpdateBatchRequest'
 *     responses:
 *       200:
 *         description: Batch updated successfully.
 *       409:
 *         description: Conflict (e.g. duplicate code).
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(updateBatchSchema),
  batchController.update,
);


/**
 * @openapi
 * /batches/{id}:
 *   delete:
 *     tags:
 *       - Batches
 *     summary: Soft delete batch
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
 *         description: Batch deleted successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  batchController.delete,
);

export default router;