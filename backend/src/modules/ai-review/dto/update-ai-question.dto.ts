import { DifficultyLevel, QuestionType } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export interface UpdateAIQuestionDto {
  questionText?: string;
  questionType?: QuestionType;
  subject?: string;
  chapter?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  marks?: number;
  negativeMarks?: number;
  answer?: Prisma.InputJsonValue;
  explanation?: string;
  options?: {
    id?: string;
    optionText: string;
    isCorrect: boolean;
    displayOrder: number;
  }[];
}
