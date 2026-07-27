import type { QuestionResponse } from "../validator";

export interface IQuestionExtractionService {
  extractQuestions(text: string): Promise<QuestionResponse>;
}
