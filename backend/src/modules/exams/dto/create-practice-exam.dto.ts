import type { DifficultyLevel, QuestionType } from "@prisma/client";

export interface CreatePracticeExamDto {
  title?: string;
  
  questionIds?: string[];

  chapter?: string;

  topic?: string;

  difficulty?: DifficultyLevel;

  type?: QuestionType;

  questionCount?: number;

  durationMinutes: number;

  negativeMarking?: boolean;
}
