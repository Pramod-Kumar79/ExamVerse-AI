// /**
//  * @openapi
//  * tags:
//  *   - name: Questions
//  *     description: Question Bank management
//  */
// import { Router } from "express";
// import { UserRole } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { authenticate, authorize } from "../../auth/middleware";
// import { validateRequest, asyncHandler } from "../../../common/middleware";
// import { ApiResponse } from "../../../common/response";
// import { BadRequestError } from "../../../common/errors";

// import { createQuestionSchema, updateQuestionSchema } from "../schemas";

// import { QuestionRepository } from "../repositories";
// import { QuestionService } from "../services";
// import { QuestionController } from "../controllers";

// import { uploadQuestionImage } from "../middleware/upload-image.middleware";

// const router = Router();

// const questionRepository = new QuestionRepository(prisma);

// const questionService = new QuestionService(questionRepository);

// const questionController = new QuestionController(questionService);


// /**
//  * @openapi
//  * /questions:
//  *   post:
//  *     tags:
//  *       - Questions
//  *     summary: Create question
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateQuestionRequest'
//  *     responses:
//  *       201:
//  *         description: Question created successfully.
//  */
// router.post(
//   "/",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   validateRequest(createQuestionSchema),
//   questionController.create,
// );

// /**
//  * @openapi
//  * /questions/upload-image:
//  *   post:
//  *     tags:
//  *       - Questions
//  *     summary: Upload an image to attach to a question or option (e.g. a diagram)
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       201:
//  *         description: Image uploaded successfully.
//  */
// router.post(
//   "/upload-image",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   uploadQuestionImage.single("image"),
//   asyncHandler(async (req, res) => {
//     if (!req.file) {
//       throw new BadRequestError("No image file was provided.");
//     }

//     const url = `/uploads/question-images/${req.file.filename}`;

//     return ApiResponse.success(res, { url }, "Image uploaded successfully.", 201);
//   }),
// );


// /**
//  * @openapi
//  * /questions:
//  *   get:
//  *     tags:
//  *       - Questions
//  *     summary: List questions
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Questions fetched successfully.
//  */
// router.get("/", authenticate, questionController.list);

// /**
//  * @openapi
//  * /questions/{id}:
//  *   get:
//  *     tags:
//  *       - Questions
//  *     summary: Get question by id
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
//  *         description: Question fetched successfully.
//  */
// router.get("/:id", authenticate, questionController.getById);


// /**
//  * @openapi
//  * /questions/{id}:
//  *   patch:
//  *     tags:
//  *       - Questions
//  *     summary: Update question
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
//  *             $ref: '#/components/schemas/UpdateQuestionRequest'
//  *     responses:
//  *       200:
//  *         description: Question updated successfully.
//  */
// router.patch(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   validateRequest(updateQuestionSchema),
//   questionController.update,
// );


// /**
//  * @openapi
//  * /questions/{id}:
//  *   delete:
//  *     tags:
//  *       - Questions
//  *     summary: Soft delete question
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
//  *         description: Question deleted successfully.
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.TEACHER),
//   questionController.delete,
// );

// router.post("/bulk-delete", questionController.bulkDelete);

// export default router;


/**
 * @openapi
 * tags:
 *   - name: Questions
 *     description: Question Bank management
 */
import { Router } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";
import { validateRequest, asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";
import { BadRequestError } from "../../../common/errors";

import { createQuestionSchema, updateQuestionSchema } from "../schemas";

import { QuestionRepository } from "../repositories";
import { QuestionService } from "../services";
import { QuestionController } from "../controllers";

import { uploadQuestionImage } from "../middleware/upload-image.middleware";

const router = Router();

const questionRepository = new QuestionRepository(prisma);

const questionService = new QuestionService(questionRepository);

const questionController = new QuestionController(questionService);


/**
 * @openapi
 * /questions:
 *   post:
 *     tags:
 *       - Questions
 *     summary: Create question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuestionRequest'
 *     responses:
 *       201:
 *         description: Question created successfully.
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  validateRequest(createQuestionSchema),
  questionController.create,
);

/**
 * @openapi
 * /questions/upload-image:
 *   post:
 *     tags:
 *       - Questions
 *     summary: Upload an image to attach to a question or option (e.g. a diagram)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Image uploaded successfully.
 */
router.post(
  "/upload-image",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  uploadQuestionImage.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new BadRequestError("No image file was provided.");
    }

    const url = `/uploads/question-images/${req.file.filename}`;

    return ApiResponse.success(res, { url }, "Image uploaded successfully.", 201);
  }),
);


/**
 * @openapi
 * /questions:
 *   get:
 *     tags:
 *       - Questions
 *     summary: List questions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Questions fetched successfully.
 */
router.get("/", authenticate, questionController.list);

/**
 * @openapi
 * /questions/{id}:
 *   get:
 *     tags:
 *       - Questions
 *     summary: Get question by id
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
 *         description: Question fetched successfully.
 */
router.get("/:id", authenticate, questionController.getById);


/**
 * @openapi
 * /questions/{id}:
 *   patch:
 *     tags:
 *       - Questions
 *     summary: Update question
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
 *             $ref: '#/components/schemas/UpdateQuestionRequest'
 *     responses:
 *       200:
 *         description: Question updated successfully.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  validateRequest(updateQuestionSchema),
  questionController.update,
);


/**
 * @openapi
 * /questions/{id}:
 *   delete:
 *     tags:
 *       - Questions
 *     summary: Soft delete question
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
 *         description: Question deleted successfully.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  questionController.delete,
);

router.post(
  "/bulk-delete",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.TEACHER),
  questionController.bulkDelete,
);

export default router;