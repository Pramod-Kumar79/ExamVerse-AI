// /**
//  * @openapi
//  * tags:
//  *   - name: Teachers
//  *     description: Teacher profile management
//  */
// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";
// import { validateRequest } from "../../../common/middleware";

// import { createTeacherSchema, updateTeacherSchema } from "../schemas";

// import { TeacherRepository } from "../repositories";
// import { TeacherService } from "../services";
// import { TeacherController } from "../controllers";

// import { UserRepository } from "../../users/repositories";

// const router = Router();

// const teacherRepository = new TeacherRepository(prisma);
// const userRepository = new UserRepository(prisma);

// const teacherService = new TeacherService(teacherRepository, userRepository);

// const teacherController = new TeacherController(teacherService);


// /**
//  * @openapi
//  * /teachers:
//  *   post:
//  *     tags:
//  *       - Teachers
//  *     summary: Create a teacher profile
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateTeacherRequest'
//  *     responses:
//  *       201:
//  *         description: Teacher created successfully.
//  */
// router.post(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(createTeacherSchema),
//   teacherController.create,
// );


// /**
//  * @openapi
//  * /teachers:
//  *   get:
//  *     tags:
//  *       - Teachers
//  *     summary: List teachers
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Teachers fetched successfully.
//  */
// router.get(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   teacherController.list,
// );


// /**
//  * @openapi
//  * /teachers/{id}:
//  *   get:
//  *     tags:
//  *       - Teachers
//  *     summary: Get teacher by id
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
//  *         description: Teacher fetched successfully.
//  */
// router.get("/:id", authenticate, teacherController.getById);


// /**
//  * @openapi
//  * /teachers/{id}:
//  *   patch:
//  *     tags:
//  *       - Teachers
//  *     summary: Update teacher
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
//  *             $ref: '#/components/schemas/UpdateTeacherRequest'
//  *     responses:
//  *       200:
//  *         description: Teacher updated successfully.
//  */
// router.patch(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(updateTeacherSchema),
//   teacherController.update,
// );


// /**
//  * @openapi
//  * /teachers/{id}:
//  *   delete:
//  *     tags:
//  *       - Teachers
//  *     summary: Delete teacher
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
//  *         description: Teacher deleted successfully.
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   teacherController.delete,
// );

// export default router;



/**
 * @openapi
 * tags:
 *   - name: Teachers
 *     description: Teacher profile management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";
import { validateRequest } from "../../../common/middleware";

import { createTeacherSchema, updateTeacherSchema } from "../schemas";

import { TeacherRepository } from "../repositories";
import { TeacherService } from "../services";
import { TeacherController } from "../controllers";

import { UserRepository } from "../../users/repositories";

const router = Router();

const teacherRepository = new TeacherRepository(prisma);
const userRepository = new UserRepository(prisma);

const teacherService = new TeacherService(teacherRepository, userRepository);

const teacherController = new TeacherController(teacherService);


/**
 * @openapi
 * /teachers:
 *   post:
 *     tags:
 *       - Teachers
 *     summary: Create a teacher profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeacherRequest'
 *     responses:
 *       201:
 *         description: Teacher created successfully.
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(createTeacherSchema),
  teacherController.create,
);


/**
 * @openapi
 * /teachers:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: List teachers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teachers fetched successfully.
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  teacherController.list,
);


/**
 * @openapi
 * /teachers/{id}:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get teacher by id
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
 *         description: Teacher fetched successfully.
 */
router.get("/:id", authenticate, teacherController.getById);


/**
 * @openapi
 * /teachers/{id}:
 *   patch:
 *     tags:
 *       - Teachers
 *     summary: Update teacher
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
 *             $ref: '#/components/schemas/UpdateTeacherRequest'
 *     responses:
 *       200:
 *         description: Teacher updated successfully.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(updateTeacherSchema),
  teacherController.update,
);


/**
 * @openapi
 * /teachers/{id}:
 *   delete:
 *     tags:
 *       - Teachers
 *     summary: Delete teacher
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
 *         description: Teacher deleted successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  teacherController.delete,
);

export default router;