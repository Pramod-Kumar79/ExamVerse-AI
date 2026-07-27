import type { IAiService } from "./ai.service.interface";

import { buildQuestionExtractionPrompt } from "../prompts";
import { JsonResponseParser } from "../parser";
import { QuestionResponseValidator, type QuestionResponse } from "../validator";

import type { IQuestionExtractionService } from "./question-extraction.service.interface";
import { logger } from "../../../lib/logger";

export class QuestionExtractionService implements IQuestionExtractionService {
  constructor(private readonly aiService: IAiService) {}

  async extractQuestions(text: string): Promise<QuestionResponse> {
    // 1. Build prompt
    const prompt = buildQuestionExtractionPrompt(text);

    const response = await this.aiService.generateContent(prompt);
    logger.info("Raw Gemini response received.");

    const parsed = JsonResponseParser.parse(response);

    logger.info("JSON parsed successfully.");

    // 4. Validate JSON
    const validated = QuestionResponseValidator.validate(parsed);
    logger.info("Question response validated.");
    return validated;
  }
}
