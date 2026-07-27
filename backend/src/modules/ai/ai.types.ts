// export interface GeminiResponse {
//   text: string;
// }

// export interface QuestionExtractionResult {
//   questions: unknown[];
// }


// export const AI_PROVIDER = {
//   GEMINI: "gemini",
// } as const;

// export const AI_MODEL = {
//   GEMINI_FLASH: "gemini-2.5-flash",
// } as const;

import type { DocumentPage } from "../../common/types";

export interface ExtractQuestionRequest {
  pages: DocumentPage[];
}

export interface ExtractedOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface ExtractedQuestion {
  questionNumber: number;
  questionType: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  difficulty?: string;
  title: string;
  description?: string;
  options: ExtractedOption[];
  correctAnswer?: string;
  explanation?: string;
  marks?: number;
  negativeMarks?: number;
  confidence: number;
  tags: string[];
  language: string;
}

export interface QuestionExtractionResult {
  questions: ExtractedQuestion[];

  metadata: {
    totalQuestions: number;

    confidence: number;

    provider: string;
  };
}
