import { AIExtractedQuestion, AIReviewStatus, Question } from "@prisma/client";

import type { QuestionResponse } from "../../ai/validator";
import type { UpdateAIQuestionDto } from "../dto";

export interface IAIReviewRepository {
  findByProcessingJob(processingJobId: string): Promise<AIExtractedQuestion[]>;

  findById(id: string): Promise<AIExtractedQuestion | null>;

  updateStatus(
    id: string,
    status: AIReviewStatus,
    reviewedById: string,
  ): Promise<AIExtractedQuestion>;

  createMany(
    processingJobId: string,
    documentId: string,
    questions: QuestionResponse["questions"],
  ): Promise<void>;

  updateQuestion(
    id: string,
    dto: UpdateAIQuestionDto,
  ): Promise<AIExtractedQuestion>;
  
  publishQuestion(id: string, teacherId: string): Promise<Question>;
}


