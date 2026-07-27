// /**
//  * @openapi
//  * tags:
//  *   - name: Students
//  *     description: Student profile management
//  */
// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";
// import { validateRequest } from "../../../common/middleware";

// import { createStudentSchema, updateStudentSchema } from "../schemas";

// import { StudentRepository } from "../repositories";
// import { StudentService } from "../services";
// import { StudentController } from "../controllers";

// const router = Router();

// const studentRepository = new StudentRepository(prisma);

// import { UserRepository } from "../../users/repositories";
// import { BatchRepository } from "../../batches/repositories";

// const userRepository = new UserRepository(prisma);
// const batchRepository = new BatchRepository(prisma);

// const studentService = new StudentService(
//   studentRepository,
//   userRepository,
//   batchRepository,
// );

// const studentController = new StudentController(studentService);


// /**
//  * @openapi
//  * /students:
//  *   post:
//  *     tags:
//  *       - Students
//  *     summary: Create a student profile
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateStudentRequest'
//  *     responses:
//  *       201:
//  *         description: Student created successfully.
//  */
// router.post(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(createStudentSchema),
//   studentController.create,
// );


// /**
//  * @openapi
//  * /students:
//  *   get:
//  *     tags:
//  *       - Students
//  *     summary: List students
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Students fetched successfully.
//  */
// router.get(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   studentController.list,
// );


// /**
//  * @openapi
//  * /students/{id}:
//  *   get:
//  *     tags:
//  *       - Students
//  *     summary: Get student by id
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
//  *         description: Student fetched successfully.
//  */
// router.get("/:id", authenticate, studentController.getById);


// /**
//  * @openapi
//  * /students/{id}:
//  *   patch:
//  *     tags:
//  *       - Students
//  *     summary: Update student
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
//  *             $ref: '#/components/schemas/UpdateStudentRequest'
//  *     responses:
//  *       200:
//  *         description: Student updated successfully.
//  */
// router.patch(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(updateStudentSchema),
//   studentController.update,
// );


// /**
//  * @openapi
//  * /students/{id}:
//  *   delete:
//  *     tags:
//  *       - Students
//  *     summary: Delete student
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
//  *         description: Student deleted successfully.
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   studentController.delete,
// );

// export default router;



/**
 * @openapi
 * tags:
 *   - name: Students
 *     description: Student profile management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";
import { validateRequest } from "../../../common/middleware";

import { createStudentSchema, updateStudentSchema } from "../schemas";

import { StudentRepository } from "../repositories";
import { StudentService } from "../services";
import { StudentController } from "../controllers";

const router = Router();

const studentRepository = new StudentRepository(prisma);

import { UserRepository } from "../../users/repositories";
import { BatchRepository } from "../../batches/repositories";

const userRepository = new UserRepository(prisma);
const batchRepository = new BatchRepository(prisma);

const studentService = new StudentService(
  studentRepository,
  userRepository,
  batchRepository,
);

const studentController = new StudentController(studentService);


/**
 * @openapi
 * /students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Create a student profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: Student created successfully.
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(createStudentSchema),
  studentController.create,
);


/**
 * @openapi
 * /students:
 *   get:
 *     tags:
 *       - Students
 *     summary: List students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students fetched successfully.
 */
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  studentController.list,
);


/**
 * @openapi
 * /students/{id}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get student by id
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
 *         description: Student fetched successfully.
 */
router.get("/:id", authenticate, studentController.getById);


/**
 * @openapi
 * /students/{id}:
 *   patch:
 *     tags:
 *       - Students
 *     summary: Update student
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
 *             $ref: '#/components/schemas/UpdateStudentRequest'
 *     responses:
 *       200:
 *         description: Student updated successfully.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(updateStudentSchema),
  studentController.update,
);


/**
 * @openapi
 * /students/{id}:
 *   delete:
 *     tags:
 *       - Students
 *     summary: Delete student
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
 *         description: Student deleted successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  studentController.delete,
);

export default router;