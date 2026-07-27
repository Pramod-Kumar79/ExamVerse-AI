import type { DifficultyLevel, QuestionType } from "@prisma/client";

export interface CreatePracticeExamDto {
  title?: string;

  chapter?: string;

  topic?: string;

  difficulty?: DifficultyLevel;

  type?: QuestionType;

  questionCount: number;

  durationMinutes: number;

  negativeMarking?: boolean;
}
