// /**
//  * @openapi
//  * tags:
//  *   - name: Institutes
//  *     description: Institute management
//  */

// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { validateRequest } from "../../../common/middleware";

// import { authenticate, authorize } from "../../auth/middleware";

// import { createInstituteSchema, updateInstituteSchema } from "../schemas";

// import { InstituteRepository } from "../repositories";
// import { InstituteService } from "../services";
// import { InstituteController } from "../controllers";

// const router = Router();

// const instituteRepository = new InstituteRepository(prisma);
// const instituteService = new InstituteService(instituteRepository);
// const instituteController = new InstituteController(instituteService);

// /**
//  * Public
//  */
// /**
//  * @openapi
//  * /institutes/{id}:
//  *   get:
//  *     tags:
//  *       - Institutes
//  *     summary: Get institute by ID
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
//  *         description: Institute fetched successfully.
//  *       404:
//  *         description: Institute not found.
//  */
// router.get("/:id", authenticate, instituteController.getById);

// /**
//  * Admin
//  */

// /**
//  * @openapi
//  * /institutes:
//  *   post:
//  *     tags:
//  *       - Institutes
//  *     summary: Create institute
//  *     description: Creates a new institute. Admin only.
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateInstituteRequest'
//  *     responses:
//  *       201:
//  *         description: Institute created successfully.
//  *       400:
//  *         description: Validation error.
//  *       401:
//  *         description: Unauthorized.
//  *       403:
//  *         description: Forbidden.
//  */
// router.post(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(createInstituteSchema),
//   instituteController.create,
// );


// /**
//  * @openapi
//  * /institutes:
//  *   get:
//  *     tags:
//  *       - Institutes
//  *     summary: List institutes
//  *     description: Returns paginated institutes.
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Institutes fetched successfully.
//  */
// router.get(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   instituteController.list,
// );


// /**
//  * @openapi
//  * /institutes/{id}:
//  *   patch:
//  *     tags:
//  *       - Institutes
//  *     summary: Update institute
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
//  *             $ref: '#/components/schemas/UpdateInstituteRequest'
//  *     responses:
//  *       200:
//  *         description: Institute updated successfully.
//  */
// router.patch(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(updateInstituteSchema),
//   instituteController.update,
// );


// /**
//  * @openapi
//  * /institutes/{id}:
//  *   delete:
//  *     tags:
//  *       - Institutes
//  *     summary: Delete institute
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
//  *         description: Institute deleted successfully.
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   instituteController.delete,
// );

// export default router;



/**
 * @openapi
 * tags:
 *   - name: Institutes
 *     description: Institute management
 */

import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { validateRequest } from "../../../common/middleware";

import { authenticate, authorize } from "../../auth/middleware";

import { createInstituteSchema, updateInstituteSchema } from "../schemas";

import { InstituteRepository } from "../repositories";
import { InstituteService } from "../services";
import { InstituteController } from "../controllers";

const router = Router();

const instituteRepository = new InstituteRepository(prisma);
const instituteService = new InstituteService(instituteRepository);
const instituteController = new InstituteController(instituteService);

/**
 * Public
 */
/**
 * @openapi
 * /institutes/{id}:
 *   get:
 *     tags:
 *       - Institutes
 *     summary: Get institute by ID
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
 *         description: Institute fetched successfully.
 *       404:
 *         description: Institute not found.
 */
router.get("/:id", authenticate, instituteController.getById);

/**
 * Admin
 */

/**
 * @openapi
 * /institutes:
 *   post:
 *     tags:
 *       - Institutes
 *     summary: Create institute
 *     description: Creates a new institute. Admin only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstituteRequest'
 *     responses:
 *       201:
 *         description: Institute created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(createInstituteSchema),
  instituteController.create,
);


/**
 * @openapi
 * /institutes:
 *   get:
 *     tags:
 *       - Institutes
 *     summary: List institutes
 *     description: Returns paginated institutes.
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
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Institutes fetched successfully.
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  instituteController.list,
);


/**
 * @openapi
 * /institutes/{id}:
 *   patch:
 *     tags:
 *       - Institutes
 *     summary: Update institute
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
 *             $ref: '#/components/schemas/UpdateInstituteRequest'
 *     responses:
 *       200:
 *         description: Institute updated successfully.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(updateInstituteSchema),
  instituteController.update,
);


/**
 * @openapi
 * /institutes/{id}:
 *   delete:
 *     tags:
 *       - Institutes
 *     summary: Delete institute
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
 *         description: Institute deleted successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  instituteController.delete,
);

export default router;