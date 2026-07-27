import { AIExtractedQuestion, Question } from "@prisma/client";
import type { QuestionResponse } from "../../ai/validator";
import type { UpdateAIQuestionDto } from "../dto";

export interface IAIReviewService {
  getQuestionsByProcessingJob(
    processingJobId: string,
  ): Promise<AIExtractedQuestion[]>;

  getQuestionById(id: string): Promise<AIExtractedQuestion | null>;

  approveQuestion(
    id: string,
    reviewedById: string,
  ): Promise<AIExtractedQuestion>;

  rejectQuestion(
    id: string,
    reviewedById: string,
  ): Promise<AIExtractedQuestion>;

  saveExtractedQuestions(
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
