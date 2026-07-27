import { AIReviewStatus, Question } from "@prisma/client";

import type { IAIReviewRepository } from "../repositories";
import type { IAIReviewService } from "./ai-review.service.interface";
import type { QuestionResponse } from "../../ai/validator";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "../../../common/errors";

import { AIExtractedQuestion } from "@prisma/client";

import type { UpdateAIQuestionDto } from "../dto";

export class AIReviewService implements IAIReviewService {
  constructor(private readonly repository: IAIReviewRepository) {}

  async getQuestionsByProcessingJob(processingJobId: string) {
    return this.repository.findByProcessingJob(processingJobId);
  }

  async getQuestionById(id: string) {
    return this.repository.findById(id);
  }

  async approveQuestion(id: string, reviewedById: string) {
    const question = await this.repository.findById(id);

    if (!question) {
      throw new NotFoundError("AI extracted question not found.");
    }

    if (question.status !== AIReviewStatus.PENDING) {
      throw new BadRequestError("Only pending questions can be approved.");
    }

    return this.repository.updateStatus(
      id,
      AIReviewStatus.APPROVED,
      reviewedById,
    );
  }

  async rejectQuestion(id: string, reviewedById: string) {
    const question = await this.repository.findById(id);

    if (!question) {
      throw new NotFoundError("AI extracted question not found.");
    }

    if (question.status !== AIReviewStatus.PENDING) {
      throw new BadRequestError("Only pending questions can be rejected.");
    }

    return this.repository.updateStatus(
      id,
      AIReviewStatus.REJECTED,
      reviewedById,
    );
  }

  async saveExtractedQuestions(
    processingJobId: string,
    documentId: string,
    questions: QuestionResponse["questions"],
  ): Promise<void> {
    await this.repository.createMany(processingJobId, documentId, questions);
  }

  async publishQuestion(id: string, teacherId: string): Promise<Question> {
    const question = await this.repository.findById(id);

    if (!question) {
      throw new NotFoundError("AI extracted question not found.");
    }

    if (question.status !== "APPROVED") {
      throw new BadRequestError("Only approved questions can be published.");
    }

    if (question.approvedAt) {
      throw new ConflictError("Question has already been published.");
    }

    return this.repository.publishQuestion(id, teacherId);
  }

  async updateQuestion(
    id: string,
    dto: UpdateAIQuestionDto,
  ): Promise<AIExtractedQuestion> {
    const question = await this.repository.findById(id);

    if (!question) {
      throw new NotFoundError("Question not found.");
    }

    if (question.status !== AIReviewStatus.PENDING) {
      throw new BadRequestError("Only pending questions can be edited.");
    }

    return this.repository.updateQuestion(id, dto);
  }
}
