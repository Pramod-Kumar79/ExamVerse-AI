// /**
//  * @openapi
//  * tags:
//  *   - name: Courses
//  *     description: Course management
//  */
// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";
// import { validateRequest } from "../../../common/middleware";

// import { createCourseSchema, updateCourseSchema } from "../schemas";

// import { CourseRepository } from "../repositories";
// import { CourseService } from "../services";
// import { CourseController } from "../controllers";

// import { InstituteRepository } from "../../institutes/repositories";
// import { SubjectRepository } from "../../subjects/repositories";
// import { TeacherRepository } from "../../teachers/repositories";
// import { BatchRepository } from "../../batches/repositories";

// const router = Router();

// const courseRepository = new CourseRepository(prisma);
// const instituteRepository = new InstituteRepository(prisma);
// const subjectRepository = new SubjectRepository(prisma);
// const teacherRepository = new TeacherRepository(prisma);
// const batchRepository = new BatchRepository(prisma);

// const courseService = new CourseService(
//   courseRepository,
//   instituteRepository,
//   subjectRepository,
//   teacherRepository,
//   batchRepository,
// );

// const courseController = new CourseController(courseService);

// /**
//  * @openapi
//  * /courses:
//  *   post:
//  *     tags:
//  *       - Courses
//  *     summary: Create a course
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateCourseRequest'
//  *     responses:
//  *       201:
//  *         description: Course created successfully.
//  */
// router.post(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(createCourseSchema),
//   courseController.create,
// );

// /**
//  * @openapi
//  * /courses:
//  *   get:
//  *     tags:
//  *       - Courses
//  *     summary: List courses
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Courses fetched successfully.
//  */
// router.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER), courseController.list);


// /**
//  * @openapi
//  * /courses/{id}:
//  *   get:
//  *     tags:
//  *       - Courses
//  *     summary: Get course by id
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
//  *         description: Course fetched successfully.
//  */
// router.get("/:id", authenticate, courseController.getById);


// /**
//  * @openapi
//  * /courses/{id}:
//  *   patch:
//  *     tags:
//  *       - Courses
//  *     summary: Update course
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
//  *             $ref: '#/components/schemas/UpdateCourseRequest'
//  *     responses:
//  *       200:
//  *         description: Course updated successfully.
//  */
// router.patch(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   validateRequest(updateCourseSchema),
//   courseController.update,
// );


// /**
//  * @openapi
//  * /courses/{id}:
//  *   delete:
//  *     tags:
//  *       - Courses
//  *     summary: Delete course
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
//  *         description: Course deleted successfully.
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   courseController.delete,
// );

// export default router;



/**
 * @openapi
 * tags:
 *   - name: Courses
 *     description: Course management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";
import { validateRequest } from "../../../common/middleware";

import { createCourseSchema, updateCourseSchema } from "../schemas";

import { CourseRepository } from "../repositories";
import { CourseService } from "../services";
import { CourseController } from "../controllers";

import { InstituteRepository } from "../../institutes/repositories";
import { SubjectRepository } from "../../subjects/repositories";
import { TeacherRepository } from "../../teachers/repositories";
import { BatchRepository } from "../../batches/repositories";

const router = Router();

const courseRepository = new CourseRepository(prisma);
const instituteRepository = new InstituteRepository(prisma);
const subjectRepository = new SubjectRepository(prisma);
const teacherRepository = new TeacherRepository(prisma);
const batchRepository = new BatchRepository(prisma);

const courseService = new CourseService(
  courseRepository,
  instituteRepository,
  subjectRepository,
  teacherRepository,
  batchRepository,
);

const courseController = new CourseController(courseService);

/**
 * @openapi
 * /courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Create a course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseRequest'
 *     responses:
 *       201:
 *         description: Course created successfully.
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(createCourseSchema),
  courseController.create,
);

/**
 * @openapi
 * /courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: List courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses fetched successfully.
 */
router.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.INSTITUTE, UserRole.TEACHER), courseController.list);


/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get course by id
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
 *         description: Course fetched successfully.
 */
router.get("/:id", authenticate, courseController.getById);


/**
 * @openapi
 * /courses/{id}:
 *   patch:
 *     tags:
 *       - Courses
 *     summary: Update course
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
 *             $ref: '#/components/schemas/UpdateCourseRequest'
 *     responses:
 *       200:
 *         description: Course updated successfully.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  validateRequest(updateCourseSchema),
  courseController.update,
);


/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     tags:
 *       - Courses
 *     summary: Delete course
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
 *         description: Course deleted successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTITUTE),
  courseController.delete,
);

export default router;