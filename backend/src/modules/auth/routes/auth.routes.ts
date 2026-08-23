/**
 * @openapi
 * tags:
 *   - name: Authentication
 *     description: Authentication and session management
 */

import { Router } from "express";

import { prisma } from "../../../lib/prisma";

import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";

import { AuthService } from "../services";
import { AuthController } from "../controllers";

import { authenticate } from "../middleware/authenticate";
import { validateRequest } from "../../../common/middleware/validate-request";

import { loginSchema, registerSchema, registerInstituteSchema } from "../schemas/auth.schema";

const router = Router();

const userRepository = new UserRepository(prisma);
const refreshTokenRepository = new RefreshTokenRepository(prisma);

const authService = new AuthService(userRepository, refreshTokenRepository);

const authController = new AuthController(authService);


/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation error.
 */
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

/**
 * @openapi
 * /auth/register-institute:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new institute account
 *     description: Registers an institute account pending admin approval.
 *     responses:
 *       201:
 *         description: Institute registration submitted successfully.
 *       400:
 *         description: Validation error.
 */
router.post(
  "/register-institute",
  validateRequest(registerInstituteSchema),
  authController.registerInstitute,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login
 *     description: Authenticates a user and returns access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 */
router.post("/login", validateRequest(loginSchema), authController.login);


/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     description: Generates a new access token using a valid refresh token.
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Invalid refresh token.
 */
router.post("/refresh", authController.refresh);


/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout
 *     description: Invalidates the current refresh token.
 *     responses:
 *       200:
 *         description: Logged out successfully.
 */
router.post("/logout", authController.logout);


/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout from all devices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices.
 *       401:
 *         description: Unauthorized.
 */
router.post("/logout-all", authenticate, authController.logoutAll);

export default router;
