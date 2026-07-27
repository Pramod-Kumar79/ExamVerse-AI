import { Router } from "express";

import { authenticate } from "../../auth/middleware";

import { EvaluationRepository } from "../repositories";
import { EvaluationService } from "../services";
import { EvaluationController } from "../controllers";

const router = Router();

const repository = new EvaluationRepository();

const service = new EvaluationService(repository);

const controller = new EvaluationController(service);

router.post("/:attemptId/evaluate", authenticate, controller.evaluate);

export default router;
