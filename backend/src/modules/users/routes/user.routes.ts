/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User profile and account management
 */

import { Router } from "express";

import { prisma } from "../../../lib/prisma";

import { authenticate, authorize } from "../../auth/middleware";

import { UserRole } from "@prisma/client";

import { validateRequest } from "../../../common/middleware";

import { changePasswordSchema, updateProfileSchema } from "../schemas";

import { UserRepository } from "../repositories";
import { UserService } from "../services";
import { UserController } from "../controllers";

const router = Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/**
 * Current User
 */

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully.
 *       401:
 *         description: Unauthorized.
 */

router.get("/me", authenticate, userController.getMe);


/**
 * @openapi
 * /users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user profile
 *     description: Updates the authenticated user's profile.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.patch(
  "/me",
  authenticate,
  validateRequest(updateProfileSchema),
  userController.updateProfile,
);

/**
 * @openapi
 * /users/change-password:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Change password
 *     description: Changes the password of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.patch(
  "/change-password",
  authenticate,
  validateRequest(changePasswordSchema),
  userController.changePassword,
);

/**
 * @openapi
 * /users/me:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete current account
 *     description: Permanently deletes the authenticated user's account.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *       401:
 *         description: Unauthorized.
 */
router.delete("/me", authenticate, userController.deleteAccount);

/**
 * Admin
 */

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Returns a user by ID. Admin access only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 */
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  userController.getUserById,
);

export default router;
